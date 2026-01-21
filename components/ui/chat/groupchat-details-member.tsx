import { View, Text, TouchableOpacity } from 'react-native';
import React, { Dispatch } from 'react';
import Avatar from './avatar';
import { GroupMember } from '@/types/slices/user';

const GroupchatDetailsMember = ({
  setMember,
  member,
}: {
  member: GroupMember;
  setMember: Dispatch<GroupMember | null>;
}) => {
  return (
    <TouchableOpacity onPress={() => setMember(member)} className="flex-row items-center gap-4 p-2">
      <Avatar size={40} name={member.user.name} />
      <View className="flex-1 flex-row items-center border-b  border-b-[#444] py-1.5">
        <View className="flex-1">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="max-w-[80%] text-lg font-medium leading-4 text-white">
            {member.user.name}
          </Text>
          <Text className="text-sm text-[#BBB]">{member.user.email || member.user.email}</Text>
        </View>
        <Text className="ml-auto text-sm text-[#CCC]">{member.isAdmin ? 'Admin' : null}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroupchatDetailsMember;
