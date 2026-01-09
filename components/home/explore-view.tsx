import { View, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import ExploreItem from './explore-item';
import { useInfiniteSearchQuery, useSearchQuery } from '@/services/pinterest/pinterestSlice';
import { SearchParams, SearchResult } from '@/types/slices/search';
import { current } from '@reduxjs/toolkit';

const ExploreView = () => {
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const scrollRef = useRef(null);
  const scale = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const [pixels, setPixels] = useState<SearchResult[]>([]);
  const [params, setParams] = useState<SearchParams>({
    query: 'Vacation',
    page: 1,
    per_page: 5,
    orientation: 'portrait',
  });

  const { data, isLoading, isFetching } = useSearchQuery(params);

  useEffect(() => {
    if (data) {
      setPixels((prevPixels) => {
        const existingIds = new Set(prevPixels.map((p) => p.id));
        const newPixels = data?.results.filter((pixel) => !existingIds.has(pixel.id));
        return [...prevPixels, ...newPixels];
      });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      if (
        pixels.length > 0 &&
        pixels.length - 2 == currentIndex &&
        !isLoading &&
        !isFetching &&
        params.page + 2 < data.total_pages
      ) {
        setParams((prev) => ({ ...prev, page: prev.page + 1 }));
      }
    }
  }, [currentIndex, isLoading, isFetching]);

  const handleScale = (val: number) => {
    scale.setValue(val);

    Animated.timing(scale, {
      toValue: val,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  return (
    <>
      {isLoading ? (
        <View className="flex-1 items-center justify-center bg-yellow-950">
          <ActivityIndicator color={'white'} size={26} />
        </View>
      ) : (
        <FlatList
          ref={scrollRef}
          data={pixels}
          renderItem={({ item }) => (
            <ExploreItem scrollRef={scrollRef} handleScale={handleScale} pixel={item} />
          )}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          onScrollToIndexFailed={() => {}}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      )}
    </>
  );
};

export default ExploreView;
