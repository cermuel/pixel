import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { NewMessage } from '@/types/chat-socket';

const SenderMessage = ({
  message,
  showTimestamp,
  currentTime,
}: {
  message: NewMessage;
  showTimestamp: boolean;
  currentTime: string;
}) => {
  return (
    <View className="gap-1">
      <Pressable className="ml-auto max-w-[220px] rounded-l-xl rounded-t-xl bg-[#333] p-4">
        <Text className="text-sm text-white">{message.message}</Text>
      </Pressable>
      {/* {showTimestamp && ( */}
      <Text className="ml-auto text-[10px] font-medium text-white">{currentTime}</Text>
      {/* )} */}
    </View>
  );
};

export default SenderMessage;
