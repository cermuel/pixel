import { View, Text } from 'react-native';
import React from 'react';
import { NewMessage } from '@/types/chat-socket';

const ReceiverMessage = ({
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
      <View className="mr-auto max-w-[220px] rounded-r-xl rounded-t-xl bg-[#1B1E20] p-4">
        <Text className="text-sm text-white">{message.message}</Text>
      </View>
      {/* {showTimestamp && ( */}
      <Text className="mr-auto text-[10px] font-medium text-white">{currentTime}</Text>
      {/* )} */}
    </View>
  );
};

export default ReceiverMessage;
