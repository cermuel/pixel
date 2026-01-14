import { View, Text, Animated, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { useBookmark } from '@/hooks/useBookmark';
import { Image } from 'expo-image';
import { constants } from '@/utils/constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useAuth from '@/context/useAuth';

const ProfileScreen = () => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { bookmarks, collections } = useBookmark();

  const headerOpacity = useRef(new Animated.Value(0)).current;

  const [headerScrolled, setHeaderScrolled] = useState(false);

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
        colors={[constants.TRANSPARENT, constants.OPAQUE]}
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
            onPress={() => router.push('/home')}
            className={'h-10 w-10 items-center justify-center rounded-full bg-[#11111177]'}>
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/auth')}
            className={'h-10 w-10 items-center justify-center rounded-full bg-[#11111177]'}>
            <FontAwesome name="send" size={16} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <View style={{ paddingHorizontal: 5, marginTop: insets.top + 30, flex: 1 }}>
          <ScrollView
            scrollEventThrottle={16}
            onScroll={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              setHeaderScrolled(offsetY > 40);
            }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 10, alignItems: 'center' }}>
            <SvgUri
              uri={`https://api.dicebear.com/9.x/big-ears/svg?seed=${user ? user.name : 'Guest'}`}
              width={100}
              height={100}
              style={{ borderRadius: 50, overflow: 'hidden' }}
            />
            <Text className="w-full flex-1 text-center text-4xl font-bold text-white">
              {user ? user.name : 'Guest'}
            </Text>

            {bookmarks.length > 0 ? (
              <View className="my-10 flex-row flex-wrap items-center justify-center">
                <Text className="w-full text-center text-xl font-bold text-white">
                  Saved Pixels
                </Text>
                <View className="w-1/2 px-2 py-4">
                  <View className="w-full rounded-2xl border border-[#EFEFF133] bg-[#111] p-1">
                    <View className="flex-row flex-wrap ">
                      {bookmarks.slice(0, 4).map((b) => (
                        <TouchableOpacity
                          onPress={() => router.push('/bookmarks')}
                          key={b.id}
                          style={{ aspectRatio: 1, width: '50%', padding: 4 }}>
                          <Image
                            source={{ uri: b.urls.regular }}
                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <Text className="ml-2 mt-2 text-lg font-semibold text-white">All Bookmarks</Text>
                  <Text className="ml-2 mt-0.5 font-medium text-[#888]">
                    {bookmarks.length} Pixels
                  </Text>
                </View>
                {collections.map((c) => (
                  <View className="w-1/2 px-2 py-4" key={c.id}>
                    <View className="w-full rounded-2xl border border-[#EFEFF133] bg-[#111] p-1">
                      <View className="flex-row flex-wrap items-center justify-start">
                        {c.items.slice(0, 4).map((b) => (
                          <TouchableOpacity
                            onPress={() =>
                              router.push({ pathname: '/bookmarks', params: { id: c.id } })
                            }
                            key={b.id}
                            style={{ aspectRatio: 1, width: '50%', padding: 4 }}>
                            <Image
                              source={{ uri: b.urls.regular }}
                              style={{ width: '100%', height: '100%', borderRadius: 10 }}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <Text className="ml-2 mt-2 text-lg font-semibold text-white">{c.title}</Text>
                    <Text className="ml-2 mt-0.5 font-medium text-[#888]">
                      {c.items.length} Pixels
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="my-10 items-center justify-center">
                <Text className="mt-20 w-full text-center text-3xl font-bold text-white">
                  No Bookmarks
                </Text>
                <Text className="mt-1 text-center font-medium text-[#BBB]">
                  Save photos to see your bookmarks
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
