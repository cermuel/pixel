import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useLazyExploreQuery } from '@/services/pinterest/pinterestSlice';
import ForYouItem from './for-you-item';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExploreData, SearchParams } from '@/types/slices/search';

const ForYouView = () => {
  const insets = useSafeAreaInsets();
  const [pixels, setPixels] = useState<ExploreData[]>([]);
  const [params] = useState<Omit<SearchParams, 'query'>>({ page: 1, per_page: 10 });

  const [trigger, { data, isLoading, isFetching, error }] = useLazyExploreQuery({
    refetchOnFocus: false,
  });

  useEffect(() => {
    trigger({ ...params });
  }, []);

  useEffect(() => {
    if (data) {
      setPixels((prevPixels) => {
        const existingIds = new Set(prevPixels.map((p) => p.id));
        const newPixels = data?.filter((pixel) => !existingIds.has(pixel.id));
        return [...prevPixels, ...newPixels];
      });
    }
  }, [data]);

  return (
    <>
      {isLoading ? (
        <View className="flex-1 items-center justify-center bg-yellow-950">
          <ActivityIndicator color={'white'} size={26} />
        </View>
      ) : (
        <SafeAreaView
          className="flex-1 bg-[#111]"
          edges={['bottom', 'left', 'right']}
          style={{ paddingHorizontal: 16 }}>
          <FlashList
            data={pixels}
            renderItem={({ item }) => <ForYouItem pixel={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            style={{ paddingTop: insets.top + 80 }}
            masonry
            ListFooterComponent={
              <>
                {data && (
                  <View className="items-center pt-4">
                    <TouchableOpacity
                      className="rounded-full bg-white px-10 py-3.5"
                      disabled={isLoading || isFetching}
                      onPress={() => {
                        trigger({ ...params, page: params.page + 1 });
                      }}>
                      <Text className="font-bold text-yellow-950">Get more</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {(isLoading || isFetching) && (
                  <View className="items-center pt-4">
                    <TouchableOpacity className="rounded-full bg-white px-10 py-3.5" disabled>
                      <ActivityIndicator color={'#222'} size={20} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            }
          />
        </SafeAreaView>
      )}
    </>
  );
};

export default ForYouView;
