import { BookmarkItem, Collection } from '../hooks/bookmark';

export interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  collections: Collection[];
  isLoading: boolean;
  isBookmarked: (id: string) => boolean;
  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (id: string) => void;
  createCollection: (title: string, item?: BookmarkItem) => void;
  isInCollection: (id: string, collection_id: string) => boolean;
  addToCollection: (item: BookmarkItem) => void;
  removeFromCollection: (item: BookmarkItem) => void;
  deleteCollection: (id: string) => void;
  clearBookmarks: () => void;
}
