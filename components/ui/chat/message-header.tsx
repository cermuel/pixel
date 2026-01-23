import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from './avatar';
import useCall from '@/context/call-socket';

const MessageHeader = ({ name, id }: { name: string; id: number }) => {
  const { callUser } = useCall();
  return (
    <View
      style={{ padding: 16 }}
      className=" z-10 w-full flex-row items-center gap-4 border-b border-b-[#222]">
      <>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}>
          <Ionicons name="chevron-back" size={20} color={'white'} />
        </TouchableOpacity>
        <Avatar name={name || 'Guest'} size={35} />
        <Text className="text-2xl font-bold text-white">{name}</Text>
        <TouchableOpacity
          className="ml-auto"
          onPress={() => {
            callUser(id);
          }}>
          <Ionicons name="call-outline" size={24} color="#ca8a04" />
        </TouchableOpacity>
        <Pressable className="ml-2">
          <Ionicons name="videocam-outline" size={26} color="#ca8a04" />
        </Pressable>
      </>
    </View>
  );
};

export default MessageHeader;
