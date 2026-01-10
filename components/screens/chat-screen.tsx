import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  FlatList,
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
import { ChatData } from '@/types/slices/user';
import useChat from '@/hooks/useChat';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

const ChatScreenComponent = () => {
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [chats, setChats] = useState<ChatData[]>([]);

  const { setIsAuth, setUser, setToken } = useAuth();
  const { joinRoom } = useChat({ setChats });
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useProfileQuery({});
  const {
    data: usersData,
    isLoading: loadingChats,
    isFetching,
    error,
    refetch,
  } = useChatsQuery({ query: useDebounce(query, 500) });

  const user = data?.data;

  const onRefresh = async () => {
    await refetch();
  };

  const logout = () => {
    router.replace('/home');
    setIsAuth(false);
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (usersData) setChats(usersData.data);
  }, [usersData]);

  useEffect(() => {
    setRefreshing(isFetching);
  }, [isFetching]);

  const sortedChats = [...(chats || [])].sort(
    (a, b) =>
      new Date(b?.messages[0]?.updatedAt || b?.messages[0]?.createdAt || 0).getTime() -
      new Date(a?.messages[0]?.updatedAt || a?.messages[0]?.createdAt || 0).getTime()
  );
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
              <View className="relative flex-1">
                <TextInput
                  className="flex-1 text-white"
                  onChangeText={(text) => setQuery(text)}
                  value={query}
                  style={{ padding: 0 }}
                />
                {!query && (
                  <Text
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-[#CCC]"
                    style={{ pointerEvents: 'none' }}>
                    Search chats...
                  </Text>
                )}
              </View>
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
                contentContainerClassName="gap-3"
                data={sortedChats}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <View>
                    <Text className="text-center font-medium text-[#DDD]">No users found</Text>
                  </View>
                }
                renderItem={({ item, index }) => {
                  const receiver = item.receiverId !== user?.id ? item.receiver : item.sender;
                  return (
                    <Animated.View
                      entering={FadeInDown.delay(index * 50).springify()}
                      layout={Layout.springify()}>
                      <ChatItem item={item} receiver={receiver} joinRoom={joinRoom} />
                    </Animated.View>
                  );
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
