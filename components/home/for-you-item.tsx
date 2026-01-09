import { View, TouchableOpacity, Text } from 'react-native';
import { ExploreData } from '@/types/slices/search';
import { useEffect, useRef, useState } from 'react';
import Skeleton from '../shared/skeleton-loader';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { BookmarkItem } from '@/types/hooks/bookmark';

const ForYouItem = ({ pixel }: { pixel: ExploreData | BookmarkItem }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forceHD, setForceHD] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<'small' | 'regular' | 'raw'>('raw');
  const [img, setImg] = useState(pixel?.urls.raw);

  const timers = useRef<number[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];

    if (forceHD) {
      setLoading(true);
      setCurrentQuality('raw');
      setImg(pixel?.urls.raw);
      return;
    }

    setLoading(true);

    const regularTimer = setTimeout(() => {
      if (isMounted.current && loading) {
        setCurrentQuality('regular');
        setImg(pixel?.urls.regular);
      }
    }, 2000);
    timers.current.push(regularTimer);

    const rawTimer = setTimeout(() => {
      if (isMounted.current && loading) {
        setCurrentQuality('small');
        setImg(pixel?.urls.small);
      }
    }, 4000);
    timers.current.push(rawTimer);

    return () => {
      isMounted.current = false;
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current = [];
    };
  }, [pixel, forceHD]);

  useEffect(() => {
    let prefetchMounted = true;

    const prefetchImage = async () => {
      try {
        await Image.prefetch(img);
        if (prefetchMounted && isMounted.current) {
          setLoading(false);
        }
      } catch (error) {
        if (prefetchMounted && isMounted.current) {
          setLoading(false);
        }
      }
    };

    prefetchImage();

    return () => {
      prefetchMounted = false;
    };
  }, [img]);

  const handleForceHD = () => {
    setForceHD(true);
    setLoading(true);
    setCurrentQuality('raw');
    setImg(pixel?.urls.raw);
  };

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/photo', params: { id: pixel.id } })}
      className="relative mb-4 overflow-hidden px-1.5"
      style={{ aspectRatio: pixel.width / pixel.height, width: '100%' }}>
      {loading &&
        (forceHD ? (
          <Skeleton
            style={{
              width: '100%',
              height: 10,
              borderRadius: 10,
              zIndex: 1,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              position: 'absolute',
              left: 5,
            }}
            variant="light"
          />
        ) : (
          <Skeleton
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 10,
              zIndex: 1,
            }}
            variant="dark"
          />
        ))}
      <Image
        source={{ uri: img }}
        contentFit="cover"
        cachePolicy={'disk'}
        style={{ width: '100%', height: '100%', borderRadius: 10 }}
        onLoad={() => {
          if (isMounted.current) {
            setLoading(false);
          }
        }}
        onError={() => {
          if (isMounted.current) {
            setLoading(false);
          }
        }}
      />
      {currentQuality !== 'raw' && !loading && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
          }}
          onPress={handleForceHD}
          className="h-8 w-8 items-center justify-center rounded-full bg-black/80">
          <Text className="text-xs font-bold text-white">HD</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default ForYouItem;
