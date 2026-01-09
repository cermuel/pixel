import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const MessageFooter = ({
  sendMessage,
}: {
  sendMessage: ({ message }: { message: string }) => void;
}) => {
  const [text, setText] = useState<string>('');
  return (
    <View className="z-10 w-full flex-row items-center  gap-4 border-t border-t-[#222] p-5 pb-0">
      <TouchableOpacity>
        <FontAwesome name="microphone" size={16} color="white" />
      </TouchableOpacity>
      <TextInput
        onChangeText={(e) => setText(e)}
        value={text}
        autoCapitalize="none"
        className="flex-1 rounded-full bg-white/10 p-2 px-4 font-medium text-white"
      />
      <TouchableOpacity
        onPress={() => {
          if (text.trim()) {
            sendMessage({ message: text });
            setText('');
          }
        }}>
        <FontAwesome name="send" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageFooter;
