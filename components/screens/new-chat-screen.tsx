import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SvgUri } from 'react-native-svg';
import { router } from 'expo-router';
import { useUsersQuery } from '@/services/user/userSlice';
import { useDebounce } from '@/hooks/useDebounce';
import ChatSkeleton from '../ui/chat/chat-skeleton';
import { UserData } from '@/types/slices/user';
import Ionicons from '@expo/vector-icons/Ionicons';
import useSocket from '@/context/chat-socket';
import useChat from '@/hooks/useChat';
import { fa } from 'zod/v4/locales';

const NewChatScreenComponent = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setUser] = useState<UserData | null>(null);

  const { socket } = useSocket();
  const { createRoom } = useChat({});
  const {
    data: usersData,
    isLoading: loadingChats,
    isFetching,
    error,
  } = useUsersQuery({ query: useDebounce(query, 500) });

  const fetchingUsers = isFetching || loadingChats;
  const [submitting, setSubmitting] = useState(false);

  const handleMessage = () => {
    if (!selectedUser || !socket) return;

    setSubmitting(true);

    const combinedChats = [...selectedUser.receivedChats, ...selectedUser.sentChats];
    if (combinedChats.length == 0) {
      createRoom(selectedUser);
    } else {
      const chat = combinedChats[0];
      router.dismiss();
      setTimeout(() => {
        router.push({
          pathname: '/message',
          params: { id: chat.id, name: selectedUser.name },
        });
      }, 50);
    }
  };

  return (
    <View className="flex-1 bg-[#141718]">
      <View
        style={{ paddingTop: 20, padding: 24 }}
        className="z-10 w-full flex-row items-center justify-between">
        <>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-lg font-medium text-white">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">New chat</Text>

          {submitting ? (
            <View className="w-20 items-center justify-center">
              <ActivityIndicator size={16} color={'#ca8a04'} />
            </View>
          ) : (
            <Text
              className="text-lg font-bold text-yellow-600 disabled:text-[#555]"
              onPress={handleMessage}
              disabled={!selectedUser || submitting}>
              Message
            </Text>
          )}
        </>
      </View>
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

        <View className="mt-6 flex-1">
          {fetchingUsers ? (
            <ChatSkeleton />
          ) : usersData ? (
            <FlatList
              className="flex-1"
              data={usersData?.data}
              keyExtractor={(item) => item.id.toString()}
              contentContainerClassName="bg-[#252525] rounded-xl overflow-hidden"
              ListEmptyComponent={
                <View>
                  <Text className="text-center font-medium text-[#DDD]">No users found</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View className="flex-row items-center gap-4 px-4 py-2">
                  <View style={{ width: 40, height: 40, borderRadius: 25, overflow: 'hidden' }}>
                    <SvgUri
                      uri={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${item.name || 'Guest'}`}
                      width={40}
                      height={40}
                      style={{ borderRadius: 30, overflow: 'hidden' }}
                    />
                  </View>
                  <View>
                    <Text className="text-base font-medium leading-4 text-white">{item.name}</Text>
                    <Text className="text-sm text-[#BBB]">{item.email || item.phone}</Text>
                  </View>
                  <Pressable
                    className="ml-auto"
                    onPress={() => {
                      if (item == selectedUser) {
                        setUser(null);
                      } else {
                        setUser(item);
                      }
                    }}>
                    {item == selectedUser ? (
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
    </View>
  );
};

export default NewChatScreenComponent;
