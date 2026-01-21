import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useChatsQuery, useGroupsQuery, useProfileQuery } from '@/services/user/userSlice';
import { useDebounce } from '@/hooks/useDebounce';
import ChatSkeleton from '../ui/chat/chat-skeleton';
import ChatItem from '../ui/chat/chat-item';
import { ChatData, Groupchat } from '@/types/slices/user';
import useChat from '@/hooks/useChat';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import ChatHeader from '../ui/chat/chat-header';
import ChatSearch from '../ui/chat/chat-search';
import GroupChatItem from '../ui/chat/group-chat-item';
import useGroupChat from '@/hooks/useGroupchat';

export type SCREEN_TYPE = 'Chats' | 'Groups';

const screens: SCREEN_TYPE[] = ['Chats', 'Groups'];

const ChatScreenComponent = () => {
  const [screen, setScreen] = useState<SCREEN_TYPE>('Chats');
  const [query, setQuery] = useState('');
  const [gcQuery, setGcQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [chats, setChats] = useState<ChatData[]>([]);
  const [groups, setGroups] = useState<Groupchat[]>([]);

  const { joinRoom } = useChat({ setChats });
  const { joinRoom: joinGroup } = useGroupChat({ setChats: setGroups });
  const { data, isLoading } = useProfileQuery({});
  const {
    data: usersData,
    isLoading: loadingChats,
    isFetching,
    error,
    refetch,
  } = useChatsQuery({ query: useDebounce(query, 500) });
  const {
    data: groupsData,
    isLoading: loadingGC,
    isFetching: fetchingGC,
    error: gcError,
    refetch: gcRefetch,
  } = useGroupsQuery({ query: useDebounce(gcQuery, 500) });

  const user = data?.data;

  const onRefresh = async () => {
    if (screen == 'Chats') {
      await refetch();
    } else {
      await gcRefetch();
    }
  };

  useEffect(() => {
    if (usersData) setChats(usersData.data);
  }, [usersData]);
  useEffect(() => {
    if (groupsData) setGroups(groupsData.data.groupchats);
  }, [groupsData]);

  useEffect(() => {
    setRefreshing(isFetching || fetchingGC);
  }, [isFetching, fetchingGC]);

  const sortedChats = [...(chats || [])].sort(
    (a, b) =>
      new Date(b?.messages[0]?.updatedAt || b?.messages[0]?.createdAt || 0).getTime() -
      new Date(a?.messages[0]?.updatedAt || a?.messages[0]?.createdAt || 0).getTime()
  );
  const sortedGC = [...(groups || [])].sort(
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
        <ChatHeader screen={screen} setScreen={setScreen} />
        <View className="flex-1 border-white pt-0">
          <ChatSearch
            screen={screen}
            setScreen={setScreen}
            screens={screens}
            query={screen == 'Chats' ? query : gcQuery}
            setQuery={screen == 'Chats' ? setQuery : setGcQuery}
          />

          <View className="flex-1 px-6">
            {loadingChats || loadingGC ? (
              <ChatSkeleton />
            ) : error || gcError ? (
              <TouchableOpacity
                onPress={async () => {
                  if (screen == 'Chats') {
                    await refetch();
                  } else {
                    await gcRefetch();
                  }
                }}>
                <Text className="text-center font-semibold text-[#DDD]">
                  Error fetching users! Click to try again
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {screen == 'Chats' && usersData ? (
                  <FlatList
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="transparent"
                        colors={['transparent']}
                        progressBackgroundColor="transparent"
                      />
                    }
                    ListHeaderComponent={
                      refreshing ? (
                        <View
                          style={{
                            marginTop: -40,
                            paddingBottom: 20,
                            alignItems: 'center',
                            backgroundColor: '#141718',
                          }}>
                          <ActivityIndicator color="#ca8a04" />
                        </View>
                      ) : null
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
                ) : (
                  <FlatList
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="transparent"
                        colors={['transparent']}
                        progressBackgroundColor="transparent"
                      />
                    }
                    ListHeaderComponent={
                      refreshing ? (
                        <View
                          style={{
                            marginTop: -40,
                            paddingBottom: 20,
                            alignItems: 'center',
                            backgroundColor: '#141718',
                          }}>
                          <ActivityIndicator color="#ca8a04" />
                        </View>
                      ) : null
                    }
                    className="flex-1"
                    contentContainerClassName="gap-3"
                    data={sortedGC}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={
                      <View>
                        <Text className="text-center font-medium text-[#DDD]">
                          No groupchats found
                        </Text>
                      </View>
                    }
                    renderItem={({ item, index }) => {
                      return (
                        <Animated.View
                          entering={FadeInDown.delay(index * 50).springify()}
                          layout={Layout.springify()}>
                          <GroupChatItem item={item} joinRoom={joinGroup} />
                        </Animated.View>
                      );
                    }}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreenComponent;
