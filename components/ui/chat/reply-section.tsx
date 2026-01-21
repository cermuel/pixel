import { View, Text, Pressable } from 'react-native';
import React, { Dispatch } from 'react';
import { GroupchatMessage, NewMessage } from '@/types/chat-socket';
import { helpers } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import useAuth from '@/context/useAuth';

const ReplySection = ({
  messageToReply,
  setMessageToReply,
  name,
  mode = 'SEND',
}: {
  messageToReply: Partial<NewMessage | GroupchatMessage>;
  setMessageToReply?: Dispatch<NewMessage | GroupchatMessage | null>;
  name: string;
  mode?: 'SENDER' | 'RECEIVER' | 'SEND';
}) => {
  const { user } = useAuth();
  return (
    <View className="w-full flex-row items-center gap-2.5">
      <View
        className={`flex-1 rounded-lg border p-1.5 ${mode == 'SEND' ? 'border-[#333] bg-[#252525]' : mode == 'RECEIVER' ? 'border-[#373A3C] bg-[#323538]' : 'border-[#282B2D] bg-[#222527]'}`}>
        <View className="flex-row justify-between">
          {messageToReply.senderId == user?.userId ? (
            <Text className="text-[12px] font-semibold text-[#FF6B9D]">You</Text>
          ) : (
            <Text className="text-[12px] font-semibold text-[#A8E6CF]">{name}</Text>
          )}
          <Text className="text-[10px] font-medium text-[#AAA]">
            {helpers.formatChatTime(messageToReply?.updatedAt || messageToReply?.createdAt || '0')}
          </Text>
        </View>
        <View className="mt-0.5 flex-row gap-0.5 pl-0.5">
          <View
            className="h-full rounded-full"
            style={{
              width: 2,
              backgroundColor: messageToReply.senderId == user?.userId ? '#FF6B9D' : '#A8E6CF',
            }}></View>
          <Text className="p-1 font-medium text-white" numberOfLines={4} ellipsizeMode="tail">
            {messageToReply.message}
          </Text>
        </View>
      </View>
      {setMessageToReply && (
        <Pressable
          onPress={() => setMessageToReply(null)}
          className="h-8 w-8 items-center justify-center rounded-full bg-[#333]">
          <Ionicons name="close-sharp" size={15} color={'white'} />
        </Pressable>
      )}
    </View>
  );
};

export default ReplySection;
