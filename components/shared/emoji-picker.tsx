import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useMemo, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheet } from '../ui/bottom-sheet';
import { emojiCategories } from '@/utils/emoji';
import emojilib from 'emojilib';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface EmojiPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ isVisible, onClose, onEmojiSelect }: EmojiPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Smileys & People');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const isSearching = searchQuery !== debouncedSearchQuery;
  const categories = Object.keys(emojiCategories);

  const filteredEmojis = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return emojiCategories[selectedCategory as keyof typeof emojiCategories];
    }
    const query = debouncedSearchQuery.toLowerCase();
    const allEmojis: string[] = [];
    Object.values(emojiCategories).forEach((categoryEmojis) => {
      categoryEmojis.forEach((emoji) => {
        const emojiData = emojilib[emoji as keyof typeof emojilib];
        if (emojiData) {
          //@ts-ignore
          const keywords = Array.isArray(emojiData) ? emojiData : emojiData?.keywords || [];
          const matchesSearch = keywords.some((keyword: string) =>
            keyword.toLowerCase().includes(query)
          );
          if (matchesSearch && !allEmojis.includes(emoji)) {
            allEmojis.push(emoji);
          }
        }
      });
    });
    return allEmojis;
  }, [debouncedSearchQuery, selectedCategory]);

  const handleEmojiPress = useCallback(
    (emoji: string) => {
      onEmojiSelect(emoji);
      onClose();
    },
    [onEmojiSelect, onClose]
  );

  const emojiRows = useMemo(() => {
    const rows: string[][] = [];
    const itemsPerRow = 8;
    for (let i = 0; i < filteredEmojis.length; i += itemsPerRow) {
      rows.push(filteredEmojis.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [filteredEmojis]);

  return (
    <BottomSheet isVisible={isVisible} snapPoints={[0.4, 0.9]} onClose={onClose}>
      <View className="mt-auto w-full overflow-hidden">
        <View className="relative mb-4 h-10 flex-row items-center rounded-lg bg-[#222] px-3">
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="ml-2 flex-1 text-base text-white"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {!searchQuery && (
            <View className="absolute left-10 top-0 h-full items-center justify-center">
              <Text className="text-[#CCC]" style={{ pointerEvents: 'none' }}>
                Search emojis...
              </Text>
            </View>
          )}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {!searchQuery && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b border-[#222]">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`mx-1 border-b-2 px-3 py-3 ${
                  selectedCategory === category ? 'border-[#FFA07A]' : 'border-transparent'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    selectedCategory === category ? 'text-white' : 'text-gray-400'
                  }`}>
                  {category.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {isSearching ? (
          <View className="flex-1 items-center justify-center pt-10">
            <ActivityIndicator size="small" color="#FFA07A" />
            <Text className="mt-3 text-sm text-gray-400">Searching...</Text>
          </View>
        ) : filteredEmojis.length === 0 && searchQuery ? (
          <View className="flex-1 items-center justify-center pt-10">
            <Ionicons name="search-outline" size={48} color="#444" />
            <Text className="mt-3 text-base font-medium text-white">No emojis found</Text>
            <Text className="mt-1 text-sm text-gray-400">Try a different search term</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}>
            <View className="py-4">
              {emojiRows.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} className="mb-1 flex-row justify-around px-2">
                  {row.map((emoji, colIndex) => (
                    <TouchableOpacity
                      key={`${rowIndex}-${colIndex}`}
                      onPress={() => handleEmojiPress(emoji)}
                      className="aspect-square w-10 items-center justify-center rounded-lg active:bg-[#222]">
                      <Text className="text-3xl">{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                  {row.length < 8 &&
                    Array(8 - row.length)
                      .fill(null)
                      .map((_, i) => <View key={`empty-${i}`} className="w-10" />)}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </BottomSheet>
  );
};
