import { BookmarkContextType } from '@/types/context/bookmark';
import { BookmarkItem, Collection } from '@/types/hooks/bookmark';
import { helpers } from '@/utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState, ReactNode } from 'react';

const STORAGE_KEY = 'bookmarks';
const COLLECTION_KEY = 'collections';

const initializeBookmarks = async (): Promise<BookmarkItem[]> => {
  try {
    const bookmarks = await AsyncStorage.getItem(STORAGE_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

const initializeCollections = async (): Promise<Collection[]> => {
  try {
    const collections = await AsyncStorage.getItem(COLLECTION_KEY);
    return collections ? JSON.parse(collections) : [];
  } catch (error) {
    console.error('Error loading collections:', error);
    return [];
  }
};

export const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [loadedBookmarks, loadedCollections] = await Promise.all([
        initializeBookmarks(),
        initializeCollections(),
      ]);
      setBookmarks(loadedBookmarks);
      setCollections(loadedCollections);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collections));
    }
  }, [collections, isLoading]);

  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id);
  };

  const isInCollection = (id: string, collection_id: string) => {
    const collection = collections.find((c) => c.id === collection_id);
    if (!collection) return false;
    return collection.items.some((i) => i.id === id);
  };

  const addBookmark = (item: BookmarkItem) => {
    if (isBookmarked(item.id)) return;
    setBookmarks((prev) => [...prev, item]);
    if (item.collection_id) {
      addToCollection(item);
    }
  };

  const removeBookmark = (id: string) => {
    if (!isBookmarked(id)) return;
    const item = bookmarks.find((item) => item.id === id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    if (item && item.collection_id) {
      removeFromCollection(item);
    }
  };

  const createCollection = (title: string, item?: BookmarkItem) => {
    setCollections((prev) => [
      ...prev,
      {
        id: helpers.generateId(title),
        title,
        items: item ? [item] : [],
      },
    ]);
  };

  const addToCollection = (item: BookmarkItem) => {
    const collection = collections.find((c) => c.id === item.collection_id);
    if (collection) {
      if (isInCollection(item.id, item?.collection_id ?? '')) return;
      setCollections((prev) =>
        prev.map((c) => (c.id === item.collection_id ? { ...c, items: [...c.items, item] } : c))
      );
    }
  };

  const removeFromCollection = (item: BookmarkItem) => {
    const collection = collections.find((c) => c.id === item.collection_id);
    if (collection) {
      if (!isInCollection(item.id, item?.collection_id ?? '')) return;
      setCollections((prev) =>
        prev.map((c) =>
          c.id === item.collection_id ? { ...c, items: c.items.filter((i) => i.id !== item.id) } : c
        )
      );
    }
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };
  const clearBookmarks = () => {
    setBookmarks([]);
    setCollections([]);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        collections,
        isLoading,
        isBookmarked,
        addBookmark,
        removeBookmark,
        createCollection,
        isInCollection,
        addToCollection,
        removeFromCollection,
        deleteCollection,
        clearBookmarks,
      }}>
      {children}
    </BookmarkContext.Provider>
  );
};
