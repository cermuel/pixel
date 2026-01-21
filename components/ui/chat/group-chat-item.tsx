import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { Groupchat } from '@/types/slices/user';
import GroupChatAvatar from './groupchat-avatar';
import { helpers } from '@/utils/helpers';
import useAuth from '@/context/useAuth';

const GroupChatItem = ({
  item,
  joinRoom,
}: {
  item: Groupchat;
  joinRoom: ({}: { room: number }) => void;
}) => {
  useEffect(() => {
    joinRoom({ room: item.id });
  }, [item]);

  const { user } = useAuth();
  const sender = item.groupMembers.find((m) => m.userId == item?.messages[0]?.senderId)?.user;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/groupchat-message',
          params: {
            id: item.id,
            name: item.name,
            members: JSON.stringify(item.groupMembers),
            groupchat: JSON.stringify(item),
          },
        });
      }}
      style={{ height: 50 }}
      className="flex-row items-center gap-4">
      <GroupChatAvatar
        names={item.groupMembers.map((m) => m.user.name)}
        width={35}
        containerWidth={45}
      />
      <View className="h-full justify-center">
        <Text className="text-base font-bold text-white">{item.name}</Text>
        {item.isTyping ? (
          <Text className="text-sm text-white">{item.typingUser} is typing...</Text>
        ) : (
          <Text className="text-sm text-white">
            {(item?.messages[0]?.isDeleted
              ? 'This message was deleted'
              : `${sender?.id == user?.userId ? 'You' : sender?.name}: ${item?.messages[0]?.message.trim()}`) ||
              'Click to start a chat'}
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

export default GroupChatItem;
