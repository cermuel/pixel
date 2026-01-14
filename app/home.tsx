import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import ExploreView from '@/components/home/explore-view';
import Animated from 'react-native-reanimated';
import ForYouView from '@/components/home/for-you-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDebounce } from '@/hooks/useDebounce';
import SearchView from '@/components/home/search-view';
import { SvgUri } from 'react-native-svg';
import { useRouter } from 'expo-router';
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type Tab = 'Explore' | 'For You';
const tabs: Tab[] = ['Explore', 'For You'];
const Home = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedTab, toggleTab] = useState<Tab>('Explore');
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 500);

  return (
    <SafeAreaView edges={[]} className="flex-1">
      <View
        className="absolute z-10 w-full flex-row items-center justify-between"
        style={{ padding: 24, paddingTop: insets.top + 20 }}>
        {!isSearching ? (
          <>
            <AnimatedTouchableOpacity
              onPress={() => {
                router.push('/profile');
              }}
              className={
                'h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#11111177]'
              }>
              <SvgUri
                uri={'https://api.dicebear.com/9.x/big-ears/svg?seed=Samuel'}
                width={35}
                height={35}
                style={{ borderRadius: 30, overflow: 'hidden' }}
              />
            </AnimatedTouchableOpacity>
            <View className="flex-row items-center gap-1">
              {tabs.map((tab) => (
                <AnimatedTouchableOpacity
                  className={`rounded-full px-4 py-3 ${tab == selectedTab ? 'bg-white' : 'bg-transparent'}`}
                  key={tab}
                  onPress={() => toggleTab(tab)}>
                  <Text
                    className={` text-[15px] font-bold ${tab == selectedTab ? 'text-black' : 'text-white'}`}>
                    {tab}
                  </Text>
                </AnimatedTouchableOpacity>
              ))}
            </View>
            <AnimatedTouchableOpacity
              onPress={() => setIsSearching(true)}
              className={'h-10 w-10 items-center justify-center rounded-full bg-[#11111177]'}>
              <Feather name="search" size={20} color="white" />
            </AnimatedTouchableOpacity>
          </>
        ) : (
          <>
            <AnimatedTouchableOpacity
              onPress={() => setIsSearching(false)}
              className={'h-10 w-10 items-center justify-center rounded-full bg-white/80'}>
              <Ionicons name="chevron-back-outline" size={20} color="#111111" />
            </AnimatedTouchableOpacity>

            <View className="mx-4 h-10 flex-1 items-center justify-center rounded-full bg-white/80">
              <TextInput
                className="h-full w-full px-4 text-black"
                value={query}
                onChangeText={setQuery}
                placeholder="Search images, ideas..."
                placeholderTextColor={'#666'}
                textAlignVertical="center"
              />
            </View>
          </>
        )}
      </View>

      {isSearching ? (
        <SearchView query={debouncedQuery}>
          <SearchView.Footer />
        </SearchView>
      ) : (
        <>
          {selectedTab == 'Explore' && <ExploreView />}
          {selectedTab == 'For You' && <ForYouView />}
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
