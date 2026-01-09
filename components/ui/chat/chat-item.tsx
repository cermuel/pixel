import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { helpers } from '@/utils/helpers';
import { ChatData } from '@/types/slices/user';

const ChatItem = ({ item, receiver }: { item: ChatData; receiver: ChatData['receiver'] }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/message',
          params: {
            id: item.id,
            receiverId: receiver.id,
            name: receiver.name,
          },
        });
      }}
      className="flex-row items-center gap-4">
      <View style={{ width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
        <SvgUri
          uri={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${receiver.name || 'Guest'}`}
          width={50}
          height={50}
          style={{ borderRadius: 30, overflow: 'hidden' }}
        />
      </View>
      <View className="">
        <Text className="text-base font-bold text-white">{receiver.name}</Text>
        <Text className="text-sm text-white">
          {item?.messages[0]?.message || 'Click to start a chat'}
        </Text>
      </View>
      <Text className="ml-auto text-xs font-semibold text-white">
        {item.messages?.[0]
          ? helpers.formatChatTime(
              item.messages?.[0]?.updatedAt || item.messages?.[0]?.createdAt,
              true
            )
          : null}
      </Text>
    </TouchableOpacity>
  );
};

export default ChatItem;
