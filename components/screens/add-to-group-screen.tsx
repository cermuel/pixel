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
import { router, useLocalSearchParams } from 'expo-router';
import { useSingleGroupQuery, useUsersQuery } from '@/services/user/userSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { Groupchat, UserData } from '@/types/slices/user';
import Ionicons from '@expo/vector-icons/Ionicons';
import useSocket from '@/context/chat-socket';
import useChat from '@/hooks/useChat';
import ChatSkeleton from '../ui/chat/chat-skeleton';
import Avatar from '../ui/chat/avatar';
import useGroupChat from '@/hooks/useGroupchat';

const AddToGroupComponent = () => {
  const { groupchat: groupchatString } = useLocalSearchParams();
  const { socket } = useSocket();
  const { addMember } = useGroupChat({});

  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedUser, setUser] = useState<UserData | null>(null);
  const [groupchat, setGroupchat] = useState<Groupchat>(JSON.parse(groupchatString as string));

  const {
    data: usersData,
    isLoading: loadingChats,
    isFetching,
    error,
  } = useUsersQuery({ query: useDebounce(query, 500) });
  const {
    data: currentGroup,
    isLoading: loadingGroup,
    isFetching: fetchingGroup,
  } = useSingleGroupQuery({ id: groupchat.id });

  const handleAdd = () => {
    if (!selectedUser || !socket) return;

    setSubmitting(true);

    addMember({ roomId: groupchat.id, userId: selectedUser.id }, (data) => {
      if (data?.status == 'ADDED') {
        setGroupchat({ ...groupchat, groupMembers: [...groupchat.groupMembers, data.member] });
        router.dismiss();
        setTimeout(() => {
          router.push({
            pathname: '/groupchat-message',
            params: {
              id: groupchat.id,
              name: groupchat.name,
              members: JSON.stringify(groupchat.groupMembers),
              groupchat: JSON.stringify(groupchat),
            },
          });
        }, 50);
      }
    });
  };

  const users = usersData?.data.filter((user) => {
    return !currentGroup?.data?.groupMembers?.some((member) => member.user.id === user.id);
  });

  const fetchingUsers = isFetching || loadingChats || loadingGroup || fetchingGroup;

  return (
    <View className="flex-1 bg-[#141718]">
      <View
        style={{ paddingTop: 20, padding: 24 }}
        className="z-10 w-full flex-row items-center justify-between">
        <>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-lg font-medium text-white">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">New Chat</Text>

          {submitting ? (
            <View className="w-20 items-center justify-center">
              <ActivityIndicator size={16} color={'#ca8a04'} />
            </View>
          ) : (
            <Text
              className="text-lg font-bold text-yellow-600 disabled:text-[#555]"
              onPress={handleAdd}
              disabled={!selectedUser || submitting}>
              Add
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

        <View className="mt-5 flex-1">
          {fetchingUsers ? (
            <ChatSkeleton />
          ) : users ? (
            <FlatList
              className="flex-1"
              data={users}
              keyExtractor={(item) => item.id.toString()}
              contentContainerClassName="bg-[#252525] rounded-xl overflow-hidden"
              ListEmptyComponent={
                <View className="py-4">
                  <Text className="text-center font-medium text-[#DDD]">No users found</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View className="flex-row items-center gap-4 px-4 py-2">
                  <Avatar name={item?.name || 'Guest'} size={40} />
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

export default AddToGroupComponent;
