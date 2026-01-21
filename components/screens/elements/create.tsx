import { View, Text, Pressable, TextInput, FlatList } from 'react-native';
import React, { Dispatch, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';
import { UserData } from '@/types/slices/user';
import GroupChatAvatar from '@/components/ui/chat/groupchat-avatar';
import Avatar from '@/components/ui/chat/avatar';

const Create = ({
  setUser,
  users,
  name,
  setName,
}: {
  setUser: Dispatch<UserData[]>;
  users: UserData[];
  name: string;
  setName: Dispatch<string>;
}) => {
  const flatListRef = useRef<FlatList | null>(null);

  return (
    <View className="flex-1 border-white p-6 pt-0">
      <View className="mb-6 w-full flex-row items-center gap-4 rounded-xl bg-[#252525] px-4 py-2.5">
        <GroupChatAvatar
          width={40}
          containerWidth={55}
          names={users.slice(0, 3).map((u) => u.name)}
        />
        <TextInput
          placeholder="Enter group name"
          className="flex-1 border-b border-b-[#999]  pb-1 font-medium text-[#EEE]"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>

      <Text className="text-sm font-medium text-[#DDD]">MEMBERS: {users.length}</Text>
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
  );
};

export default Create;
