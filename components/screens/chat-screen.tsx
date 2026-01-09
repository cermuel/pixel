import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useAuth from '@/context/useAuth';
import { useChatsQuery, useProfileQuery } from '@/services/user/userSlice';
import { useDebounce } from '@/hooks/useDebounce';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import ChatSkeleton from '../ui/chat/chat-skeleton';
import Ionicons from '@expo/vector-icons/Ionicons';
import ChatItem from '../ui/chat/chat-item';

const ChatScreenComponent = () => {
  const [query, setQuery] = useState('');

  const { setIsAuth, setUser, setToken } = useAuth();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useProfileQuery({});
  const {
    data: usersData,
    isLoading: loadingChats,
    isFetching,
    error,
    refetch,
  } = useChatsQuery({ query: useDebounce(query, 500) });
  const [refreshing, setRefreshing] = useState(false);

  const logout = () => {
    router.replace('/home');
    setIsAuth(false);
    setUser(null);
    setToken(null);
  };

  const user = data?.data;

  const onRefresh = async () => {
    await refetch();
  };

  useEffect(() => {
    setRefreshing(isFetching);
  }, [isFetching]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#111]">
        <ActivityIndicator size={22} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} className="flex-1">
      <View className="flex-1 bg-[#141718]">
        <View
          style={{ paddingTop: insets.top + 20, padding: 24 }}
          className="z-10 w-full flex-row items-center justify-between">
          <>
            <TouchableOpacity
              onPress={() => {
                router.replace('/profile');
              }}
              className={
                'h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#11111177]'
              }>
              <SvgUri
                uri={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user?.name || 'Guest'}`}
                width={35}
                height={35}
                style={{ borderRadius: 30, overflow: 'hidden' }}
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">Chat</Text>
            <TouchableOpacity
              onPress={logout}
              className={'h-10 w-10 items-center justify-center rounded-full'}>
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        </View>
        <View className="flex-1 border-white p-6 pt-0">
          <View className="flex-row gap-4">
            <View className="flex-1 flex-row items-center gap-2 rounded-lg bg-black/30 p-2.5">
              <EvilIcons name="search" size={20} color="white" />
              <TextInput
                className="flex-1 text-white"
                placeholderTextColor={'#CCC'}
                placeholder="Search chats..."
                onChangeText={(text) => setQuery(text)}
              />
            </View>
            <Pressable
              onPress={() => router.push('/new-chat')}
              className="h-9 w-9 items-center justify-center rounded-full bg-white">
              <Ionicons name="add-sharp" color={'black'} size={18} />
            </Pressable>
          </View>

          <View className="mt-6 flex-1">
            {loadingChats ? (
              <ChatSkeleton />
            ) : usersData ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#fff"
                    colors={['#ffffff', '#cccccc']}
                    progressBackgroundColor="#141718"
                  />
                }
                className="flex-1"
                data={usersData.data}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <View>
                    <Text className="text-center font-medium text-[#DDD]">No users found</Text>
                  </View>
                }
                renderItem={({ item }) => {
                  const receiver = item.receiverId !== user?.id ? item.receiver : item.sender;
                  return <ChatItem item={item} receiver={receiver} />;
                }}
              />
            ) : error ? (
              <Pressable onPress={async () => await refetch()}>
                <Text className="text-center font-medium text-[#DDD]">
                  Error fetching users! Click to try again
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreenComponent;
