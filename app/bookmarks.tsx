import { View, ScrollView, TouchableOpacity, Animated, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBookmark } from '@/hooks/useBookmark';
import { LinearGradient } from 'expo-linear-gradient';
import { constants } from '@/utils/constants';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FlashList } from '@shopify/flash-list';
import ForYouItem from '@/components/home/for-you-item';
import { BottomSheet } from '@/components/ui/bottom-sheet';

const Bookmarks = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { collections, bookmarks, clearBookmarks, deleteCollection } = useBookmark();
  const { id } = useLocalSearchParams();

  const headerOpacity = useRef(new Animated.Value(0)).current;

  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [manageModal, toggleManageModal] = useState(false);

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: headerScrolled ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [headerScrolled]);

  const collection = collections.find((c) => c.id == id) || bookmarks;
  const title = 'title' in collection ? collection?.title : 'All Bookmarks';

  const isCollectionType = 'title' in collection;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[constants.TRANSPARENT, constants.OPAQUE]}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0 }}
      />
      <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
        <Animated.View
          className="absolute z-10 w-full flex-row items-center justify-between gap-10"
          style={{
            padding: 24,
            paddingTop: insets.top + 20,
            backgroundColor: headerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'],
            }),
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className={'h-10 w-10 items-center justify-center rounded-full bg-[#11111177]'}>
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white">{title}</Text>
          <TouchableOpacity
            onPress={() => toggleManageModal(true)}
            className={'h-10 w-10 items-center justify-center rounded-full bg-[#11111177]'}>
            <MaterialCommunityIcons name="dots-horizontal" size={16} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <FlashList
          onScroll={(e) => {
            const offsetY = e.nativeEvent.contentOffset.y;
            setHeaderScrolled(offsetY > 40);
          }}
          data={'items' in collection ? collection.items : collection}
          renderItem={({ item }) => <ForYouItem pixel={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={{ paddingTop: insets.top + 30 }}
          masonry
        />
      </SafeAreaView>
      <BottomSheet
        isVisible={manageModal}
        snapPoints={[0.38]}
        onClose={() => toggleManageModal(false)}
        isTransparent>
        <View className="mt-auto w-full overflow-hidden rounded-[20px] bg-[#151515]">
          <TouchableOpacity
            onPress={() => {
              if (isCollectionType) {
                deleteCollection(id as string);
                router.back();
              } else {
                clearBookmarks();
                router.back();
              }
            }}
            className="w-full items-center justify-center border-b border-[#222] py-[16px] ">
            <Text className="text-lg font-medium text-[#f35757]">
              {isCollectionType ? 'Delete collection' : 'Clear Bookmarks'}
            </Text>
          </TouchableOpacity>
          <View className="w-full items-center justify-center border-b border-[#222] py-[16px] ">
            <Text className="text-lg font-medium text-white">Edit collection</Text>
          </View>
          <View className="w-full items-center justify-center border-b border-[#222] py-[16px] ">
            <Text className="text-lg font-medium text-white">Add to collection</Text>
          </View>
          <View className="w-full items-center justify-center py-[16px] ">
            <Text className="text-lg font-medium text-white">Select</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => toggleManageModal(false)}
          className="mt-2 w-full overflow-hidden rounded-[20px] bg-[#151515]">
          <View className="w-full items-center justify-center py-[18px] ">
            <Text className="text-lg font-medium text-white">Cancel</Text>
          </View>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
};

export default Bookmarks;
