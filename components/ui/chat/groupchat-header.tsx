import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Groupchat, GroupMember } from '@/types/slices/user';
import GroupChatAvatar from './groupchat-avatar';
import { Image } from 'expo-image';

const GroupchatHeader = ({
  name,
  members,
  groupchat,
}: {
  name: string;
  members: GroupMember[];
  groupchat: Groupchat;
}) => {
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

        {groupchat.photo ? (
          <Image
            source={{ uri: groupchat.photo }}
            style={{ width: 45, height: 45, borderRadius: 45 }}
          />
        ) : (
          <GroupChatAvatar names={members.map((m) => m.user.name)} width={35} containerWidth={45} />
        )}

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/groupchat-details',
              params: {
                groupchat: JSON.stringify(groupchat),
              },
            });
          }}
          className="flex-1">
          <Text numberOfLines={1} ellipsizeMode="tail" className="text-2xl font-bold text-white">
            {name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" className="font-medium text-[#CCC]">
            {members.map((m) => m.user.name).join(', ')}
          </Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

export default GroupchatHeader;
