import { View, Text, Pressable, TextInput, FlatList } from 'react-native';
import React, { Dispatch, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useUsersQuery } from '@/services/user/userSlice';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import ChatSkeleton from '@/components/ui/chat/chat-skeleton';
import { UserData } from '@/types/slices/user';
import Avatar from '@/components/ui/chat/avatar';

const Add = ({ setUser, users }: { setUser: Dispatch<UserData[]>; users: UserData[] }) => {
  const [query, setQuery] = useState('');
  const flatListRef = useRef<FlatList | null>(null);
  const {
    data: usersData,
    isLoading: loadingChats,
    isFetching,
    error,
  } = useUsersQuery({ query: useDebounce(query, 500) });

  const fetchingUsers = isFetching || loadingChats;
  return (
    <View className="flex-1 border-white p-6 pt-0">
      <View className="flex-row gap-4">
        <View className="flex-1 flex-row items-center  rounded-lg bg-[#252525] p-4">
          <Text className="text-white">To: </Text>
          <TextInput
            className="flex-1 text-white"
            placeholderTextColor={'#CCC'}
            placeholder="Search name..."
            onChangeText={(text) => setQuery(text)}
            textAlignVertical="center"
          />
        </View>
      </View>

      <View
        style={{ height: users.length > 0 ? 80 : 0, paddingBottom: users.length > 0 ? 10 : 0 }}
        className="my-6 w-full justify-center rounded-xl bg-[#252525] px-4">
        <FlatList
          className="flex-1"
          horizontal
          showsHorizontalScrollIndicator={false}
          data={users}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          ref={flatListRef}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View
              key={index}
              className="relative mr-4 items-center pt-2.5"
              entering={FadeInLeft.springify()}
              exiting={FadeOutLeft.springify()}>
              <Pressable
                onPress={() => setUser(users.filter((u) => u.id != item.id))}
                className="absolute -right-2 top-1 z-10 h-6 w-6 items-center justify-center rounded-full bg-[#888]">
                <Ionicons name="close-sharp" color={'white'} size={15} />
              </Pressable>
              <Avatar size={45} name={item.name} />
              <Text
                className="mt-1 w-12 text-center text-xs text-white"
                ellipsizeMode="tail"
                numberOfLines={1}>
                {item.name}
              </Text>
            </Animated.View>
          )}
        />
      </View>

      <View className=" flex-1">
        {fetchingUsers ? (
          <ChatSkeleton />
        ) : usersData ? (
          <FlatList
            className="flex-1"
            data={usersData?.data}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="bg-[#252525] rounded-xl overflow-hidden"
            ListEmptyComponent={
              <View className="py-4">
                <Text className="text-center font-medium text-[#DDD]">No users found</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View className="flex-row items-center gap-4 px-4 py-2">
                <Avatar size={40} name={item.name} />
                <View>
                  <Text className="text-base font-medium leading-4 text-white">{item.name}</Text>
                  <Text className="text-sm text-[#BBB]">{item.email || item.phone}</Text>
                </View>
                <Pressable
                  className="ml-auto"
                  onPress={() => {
                    if (users.some((u) => u.id == item.id)) {
                      setUser(users.filter((u) => u.id != item.id));
                    } else {
                      setUser([...users, item]);
                    }
                  }}>
                  {users.some((u) => u.id == item.id) ? (
                    <View className="h-5 w-5 items-center justify-center rounded-full border border-yellow-900 bg-yellow-900">
                      <Ionicons name="checkmark-sharp" size={12} color={'white'} />
                    </View>
                  ) : (
                    <View className="h-5 w-5 rounded-full border border-[#888]"></View>
                  )}
                </Pressable>
              </View>
            )}
          />
        ) : error ? (
          <Text className="font-medium text-[#DDD]">Error fetching users! Please try again</Text>
        ) : null}
      </View>
    </View>
  );
};

export default Add;
