import { BookmarkItem } from '@/types/hooks/bookmark';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BottomSheet } from '../ui/bottom-sheet';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { useBookmark } from '@/hooks/useBookmark';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';

const BookmarkModal = ({
  isVisible,
  onClose,
  item,
  img,
}: {
  isVisible: boolean;
  onClose: () => void;
  item: BookmarkItem;
  img?: string;
}) => {
  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
    addToCollection,
    removeFromCollection,
    collections,
    isInCollection,
  } = useBookmark();

  const [collectionView, setCollectionView] = useState(false);

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      snapPoints={[collectionView ? 0.45 : 0.4, 0.8]}>
      <>
        {collectionView ? (
          <CollectionView item={item} close={() => setCollectionView(false)} img={img} />
        ) : (
          <>
            <View className="flex w-full flex-row items-center justify-between gap-4 px-2">
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: img ?? item.urls.regular }}
                  style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#222',
                    width: 60,
                    height: 60,
                  }}
                  contentFit="cover"
                />
                <View>
                  <Text className="text-xl font-semibold text-white">
                    {isBookmarked(item.id) ? 'Bookmarked' : 'Bookmark'}
                  </Text>
                  <Text className="mt-0.5 font-semibold text-[#BBB]">(Private)</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (!isBookmarked(item.id)) {
                    addBookmark(item);
                  } else {
                    removeBookmark(item.id);
                  }
                }}>
                <FontAwesome
                  name={isBookmarked(item.id) ? 'bookmark' : 'bookmark-o'}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View className="my-7 flex w-full flex-row items-center justify-between gap-4">
              <Text className="text-xl font-bold text-white">Collections</Text>
              <TouchableOpacity onPress={() => setCollectionView(true)}>
                <Text className="text-lg font-semibold text-[#737cde]">New collection</Text>
              </TouchableOpacity>
            </View>
            <View className="gap-4">
              {collections.map((c) => (
                <View
                  key={c.id}
                  className="flex w-full flex-row items-center justify-between gap-4 px-2">
                  <View className="flex-row items-center gap-3">
                    {c?.items?.[0] ? (
                      <Image
                        source={{ uri: c.items[0].urls.regular }}
                        style={{
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: '#222',
                          width: 60,
                          height: 60,
                        }}
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: '#222',
                          backgroundColor: '#CCC',
                          width: 60,
                          height: 60,
                        }}
                      />
                    )}

                    <View>
                      <Text className="text-xl font-semibold text-white">{c.title}</Text>
                      <Text className="mt-0.5 font-semibold text-[#BBB]">(Private)</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (!isInCollection(item.id, c.id)) {
                        addToCollection({ ...item, collection_id: c.id });
                      } else {
                        removeFromCollection({ ...item, collection_id: c.id });
                      }
                    }}>
                    {!isInCollection(item.id, c.id) ? (
                      <AntDesign name="plus-circle" size={24} color="white" />
                    ) : (
                      <Octicons name="check-circle-fill" size={24} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </>
    </BottomSheet>
  );
};

export default BookmarkModal;

const CollectionView = ({
  item,
  close,
  img,
}: {
  item: BookmarkItem;
  close: () => void;
  img?: string;
}) => {
  const { createCollection } = useBookmark();
  const [title, setTitle] = useState('');

  const handleCollection = () => {
    if (!title) return;
    createCollection(title, item);
    close();
  };
  return (
    <>
      <View className="flex w-full flex-row items-center justify-between gap-4">
        <TouchableOpacity onPress={close}>
          <Text className="text-xl font-bold text-white">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">New Collection</Text>
        <TouchableOpacity
          className="pl-4 disabled:opacity-40"
          disabled={!title}
          onPress={handleCollection}>
          <Text className="text-xl font-bold text-white">Save</Text>
        </TouchableOpacity>
      </View>
      <View className="my-8 w-full items-center justify-center">
        <Image
          source={{ uri: img ?? item.urls.regular }}
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#222',
            width: 160,
            height: 170,
          }}
          contentFit="cover"
        />
      </View>
      <TextInput
        onChangeText={(text) => setTitle(text)}
        className="w-full rounded-[10px] border border-[#333] p-4 text-xl font-medium text-white"
        placeholder="Collection name"
        placeholderTextColor={'#777'}
      />
    </>
  );
};
