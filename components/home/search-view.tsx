import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useLazySearchQuery } from '@/services/pinterest/pinterestSlice';
import ForYouItem from './for-you-item';
import { Edges, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchResult } from '@/types/slices/search';

interface SearchViewInterface {
  handleLoadMore: () => void;
  pixels: SearchResult[];
  isFetching: boolean;
}

const SearchViewProvider = createContext<SearchViewInterface | undefined>(undefined);

const useSearchView = () => {
  const context = useContext(SearchViewProvider);

  if (!context) {
    throw new Error('Must be used in a SearchViewProvider');
  } else {
    return context;
  }
};

const SearchView = ({
  query = 'Vacation',
  edges = ['bottom', 'left', 'right'],
  isTransparent = false,
  children,
}: {
  query?: string;
  edges?: Edges;
  isTransparent?: boolean;
  children?: ReactNode;
}) => {
  const insets = useSafeAreaInsets();
  const [pixels, setPixels] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [trigger, { data, isLoading, isFetching }] = useLazySearchQuery({
    refetchOnFocus: false,
  });

  useEffect(() => {
    setPixels([]);
    setPage(1);
    trigger({ page: 1, per_page: 10, query, content_filter: 'high' });
  }, [query]);

  useEffect(() => {
    if (data) {
      setPixels((prevPixels) => {
        const existingIds = new Set(prevPixels.map((p) => p.id));
        const newPixels = data.results?.filter((pixel) => !existingIds.has(pixel.id));
        return [...prevPixels, ...newPixels];
      });
    }
  }, [data]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    trigger({ page: nextPage, per_page: 10, query, content_filter: 'high' });
  };

  return (
    <SearchViewProvider.Provider value={{ handleLoadMore, isFetching, pixels }}>
      {isLoading ? (
        <View className={`flex-1 items-center justify-center ${!isTransparent && 'bg-yellow-950'}`}>
          <ActivityIndicator color={'white'} size={26} />
        </View>
      ) : (
        <SafeAreaView
          className={`flex-1 ${!isTransparent && 'bg-[#111]'}`}
          edges={edges}
          style={{ paddingHorizontal: isTransparent ? 0 : 16 }}>
          <FlashList
            ListEmptyComponent={
              <View className="items-center justify-center py-5">
                <Text className="font-semibold text-white">No Images Found!</Text>
              </View>
            }
            data={pixels}
            renderItem={({ item }) => <ForYouItem pixel={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            style={{ paddingTop: isTransparent ? 0 : insets.top + 80 }}
            masonry
            ListFooterComponent={
              <>
                {typeof children === 'string' || typeof children === 'number' ? (
                  <Text>{children}</Text>
                ) : (
                  children
                )}
              </>
            }
          />
        </SafeAreaView>
      )}
    </SearchViewProvider.Provider>
  );
};

export default SearchView;

SearchView.Footer = () => {
  const { isFetching, pixels, handleLoadMore } = useSearchView();
  return (
    <>
      {!isFetching && pixels.length > 0 && (
        <View className="items-center pt-4">
          <TouchableOpacity className="rounded-full bg-white px-10 py-3.5" onPress={handleLoadMore}>
            <Text className="font-bold text-yellow-950">Get more</Text>
          </TouchableOpacity>
        </View>
      )}
      {isFetching && (
        <View className="items-center pt-4">
          <TouchableOpacity className="rounded-full bg-white px-10 py-3.5" disabled>
            <ActivityIndicator color={'#222'} size={20} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
