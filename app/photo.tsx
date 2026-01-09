import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSinglePhotoQuery } from '@/services/pinterest/pinterestSlice';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import OptimizedImage from '@/components/shared/image';
import useImageDefinition from '@/hooks/useImageDefinition';
import { GetSinglePhotoResponse } from '@/types/slices/search';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { constants } from '@/utils/constants';
import SearchView from '@/components/home/search-view';
import { helpers } from '@/utils/helpers';
import { useBookmark } from '@/hooks/useBookmark';
import BookmarkModal from '@/components/shared/bookmark-modal';

const ViewPhoto = () => {
  const { id } = useLocalSearchParams();
  const { data: pixel, isLoading } = useSinglePhotoQuery({ id: id as string });

  if (!id) return <Redirect href={'/home'} />;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <LinearGradient
          colors={[constants.OPAQUE, constants.TRANSPARENT]}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0 }}
        />
        <Text className="font-bold text-white">Loading pixels</Text>
      </View>
    );
  }
  if (!pixel) {
    return (
      <View className="flex-1 items-center justify-center">
        <LinearGradient
          colors={[constants.OPAQUE, constants.TRANSPARENT]}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0 }}
        />
        <Text className="font-bold text-white">Error getting pixels</Text>
      </View>
    );
  }

  return <ViewPin pixel={pixel} />;
};

export default ViewPhoto;

const ViewPin = ({ pixel }: { pixel: GetSinglePhotoResponse }) => {
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { loading, img, setLoading, handleForcedHD } = useImageDefinition({
    urls: pixel.urls,
  });
  const { isBookmarked } = useBookmark();

  const [showBookmarkModal, toggleBookmarkModal] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: headerScrolled ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [headerScrolled]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[constants.OPAQUE, constants.TRANSPARENT]}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0 }}
      />
      <SafeAreaView style={{ flex: 1 }}>
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
          <Text
            numberOfLines={2}
            ellipsizeMode="clip"
            className="flex-1 text-center font-bold text-white">
            {pixel.description ?? pixel.alt_description}
          </Text>
          <TouchableOpacity
            className={'h-10 w-10 items-center justify-center rounded-full bg-[#11111177]'}>
            <Feather name="search" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
        <View style={{ paddingHorizontal: 16, marginTop: insets.top + 30, flex: 1 }}>
          <ScrollView
            scrollEventThrottle={16}
            onScroll={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              setHeaderScrolled(offsetY > 40);
            }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 20 }}>
            <OptimizedImage
              containerStyle={{
                aspectRatio: pixel ? pixel.width / pixel.height : 1,
              }}
              img={img}
              setLoading={setLoading}
              loading={loading}
              showHD={img !== pixel.urls.raw}
              handleForceHD={handleForcedHD}
            />

            <View className="flex-row items-center justify-center gap-2">
              <Image
                source={{ uri: pixel.user.profile_image.medium }}
                contentFit="cover"
                cachePolicy={'disk'}
                style={{ width: 30, height: 30, borderRadius: 25 }}
              />
              <Text className="font-medium text-white">{pixel.user?.name}</Text>
            </View>
            <View className="flex-row items-center justify-center gap-6">
              <TouchableOpacity
                style={{ width: 40, height: 40, borderRadius: 25 }}
                onPress={() => toggleBookmarkModal(true)}
                disabled={loading}
                className={'items-center justify-center rounded-full bg-black/60'}>
                <FontAwesome
                  name={isBookmarked(pixel.id) ? 'bookmark' : 'bookmark-o'}
                  size={18}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 40, height: 40, borderRadius: 25 }}
                onPress={handleForcedHD}
                disabled={loading}
                className={'items-center justify-center rounded-full bg-black/60'}>
                <FontAwesome6 name="share" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="mt-4 text-2xl font-bold text-white">Similar Pixels</Text>
            <SearchView query={helpers.generateSimilarQuery(pixel)} edges={[]} isTransparent />
          </ScrollView>
        </View>
        <BookmarkModal
          isVisible={showBookmarkModal}
          onClose={() => toggleBookmarkModal(false)}
          item={pixel}
          img={img}
        />
      </SafeAreaView>
    </View>
  );
};
