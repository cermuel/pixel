import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SvgUri } from 'react-native-svg';

const MessageHeader = ({ name }: { name: string }) => {
  return (
    <View
      style={{ padding: 16 }}
      className=" z-10 w-full flex-row items-center gap-4 border-b border-b-[#222]">
      <>
        <Pressable
          onPress={() => {
            router.back();
          }}>
          <Ionicons name="chevron-back" size={20} color={'white'} />
        </Pressable>
        <SvgUri
          uri={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${name || 'Guest'}`}
          width={35}
          height={35}
          style={{ borderRadius: 30, overflow: 'hidden' }}
        />
        <Text className="text-2xl font-bold text-white">{name}</Text>
      </>
    </View>
  );
};

export default MessageHeader;
