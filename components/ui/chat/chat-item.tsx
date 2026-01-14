import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { helpers } from '@/utils/helpers';
import { ChatData } from '@/types/slices/user';
import Avatar from './avatar';

const ChatItem = ({
  item,
  receiver,
  joinRoom,
}: {
  item: ChatData;
  receiver: ChatData['receiver'];
  joinRoom: ({}: { room: number }) => void;
}) => {
  useEffect(() => {
    joinRoom({ room: item.id });
  }, [item]);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/message',
          params: {
            id: item.id,
            name: receiver.name,
          },
        });
      }}
      style={{ height: 50 }}
      className="flex-row items-center gap-4">
      <Avatar name={receiver.name} size={45} />
      <View className="h-full justify-center">
        <Text className="text-base font-bold text-white">{receiver.name}</Text>
        {item.isTyping ? (
          <Text className="text-sm text-white">{item.typingUser} is typing...</Text>
        ) : (
          <Text className="text-sm text-white">
            {(item?.messages[0]?.isDeleted
              ? 'This message was deleted'
              : item?.messages[0]?.message.trim()) || 'Click to start a chat'}
          </Text>
        )}
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
