import { Dimensions, View, TouchableOpacity, Text } from 'react-native';
import { runOnJS, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ExploreData } from '@/types/slices/search';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import useImageDefinition from '@/hooks/useImageDefinition';
import OptimizedImage from '@/components/shared/image';
import { useState } from 'react';
import BookmarkModal from '../shared/bookmark-modal';
import { useBookmark } from '@/hooks/useBookmark';

const ExploreItem = ({
  scrollRef,
  handleScale,
  pixel,
}: {
  scrollRef: any;
  handleScale: (val: number) => void;
  pixel: ExploreData;
}) => {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

  const translateX = useSharedValue(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loading, img, setLoading, handleForcedHD } = useImageDefinition({
    urls: pixel.urls,
  });
  const { isBookmarked } = useBookmark();

  const [showBookmarkModal, toggleBookmarkModal] = useState(false);

  const onSwipedRight = () => {
    router.push({ pathname: '/photo', params: { id: pixel.id } });
    handleScale(0);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-50, 50])
    .onBegin(() => {
      translateX.value = 0;
    })
    .onUpdate((event) => {
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        translateX.value = event.translationX;
        const progress = Math.min(event.translationX / SWIPE_THRESHOLD, 1);
        const scaleValue = 0.8 + progress * 1.7;
        runOnJS(handleScale)(scaleValue);
      } else {
        runOnJS(handleScale)(0);
      }
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH, {}, () => {
          runOnJS(onSwipedRight)();
        });
      }
      translateX.value = withSpring(0);
    })
    .simultaneousWithExternalGesture(scrollRef);

  return (
    <GestureDetector gesture={panGesture}>
      <OptimizedImage
        containerStyle={{
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
          borderRadius: 0,
        }}
        img={img}
        setLoading={setLoading}
        loading={loading}
        showHD={img !== pixel.urls.raw}
        handleForceHD={handleForcedHD}
        hdStyle={{
          left: 16,
          right: 'auto',
          bottom: insets.bottom + 20,
        }}>
        <View
          className="absolute items-center gap-6"
          style={{ bottom: insets.bottom + 20, right: insets.right + 16 }}>
          <Image
            source={{ uri: pixel.user.profile_image.medium }}
            contentFit="cover"
            cachePolicy={'disk'}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            onLoad={() => setLoading(false)}
          />
          <TouchableOpacity
            onPress={handleForcedHD}
            disabled={loading}
            className={'items-center justify-center gap-0.5'}>
            <FontAwesome name="heart" size={32} color={pixel.liked_by_user ? 'red' : 'white'} />
            <Text className="text-sm font-medium text-white">{pixel.likes.toLocaleString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 50, height: 50, borderRadius: 25 }}
            onPress={() => toggleBookmarkModal(true)}
            disabled={loading}
            className={'items-center justify-center rounded-full bg-black/80'}>
            <FontAwesome
              name={isBookmarked(pixel.id) ? 'bookmark' : 'bookmark-o'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 50, height: 50, borderRadius: 25 }}
            onPress={handleForcedHD}
            disabled={loading}
            className={'items-center justify-center rounded-full bg-black/80'}>
            <FontAwesome6 name="share" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <BookmarkModal
          isVisible={showBookmarkModal}
          onClose={() => toggleBookmarkModal(false)}
          item={pixel}
          img={img}
        />
      </OptimizedImage>
    </GestureDetector>
  );
};

export default ExploreItem;
