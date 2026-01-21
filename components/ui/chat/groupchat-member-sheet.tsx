import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { BottomSheet } from '../bottom-sheet';
import { Groupchat, GroupMember } from '@/types/slices/user';
import { UserActionButton, userActionButtons } from '@/constants/groupchat';
import Avatar from './avatar';
import { Ionicons } from '@expo/vector-icons';
import useGroupChat from '@/hooks/useGroupchat';
import useChat from '@/hooks/useChat';

const GroupchatMemberSheet = ({
  selectedMember,
  setMember,
  member,
  setGroupchat,
  groupchat,
}: {
  selectedMember: GroupMember | null;
  setMember: Dispatch<GroupMember | null>;
  member: GroupMember;
  setGroupchat: Dispatch<SetStateAction<Groupchat>>;
  groupchat: Groupchat;
}) => {
  const { createRoom } = useChat({});
  const { makeAdmin, removeAdmin, removeMember } = useGroupChat({});

  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [handlingUserAction, setHandlingUserAction] = useState(false);

  const handleRemoveMember = () => {
    if (!selectedMember) return;
    setHandlingUserAction(true);
    removeMember({ roomId: groupchat.id, userId: selectedMember.userId }, (data) => {
      if (data?.status == 'REMOVED') {
        setGroupchat({
          ...groupchat,
          groupMembers: groupchat.groupMembers.filter((m) => m.userId !== data.member.userId),
        });
        setHandlingUserAction(false);
        setMember(null);
      }
    });
  };

  const handleMessage = () => {
    if (!selectedMember) return;
    setHandlingUserAction(true);
    createRoom({ id: selectedMember.userId, name: selectedMember.user.name }, () => {
      setHandlingUserAction(false);
    });
  };

  const handleUserActions = (button: UserActionButton) => {
    if (button.action == 'message') {
      handleMessage();
    } else {
    }
  };

  const handleRemoveAdmin = () => {
    if (!selectedMember) return;
    removeAdmin({ roomId: groupchat.id, userId: selectedMember.userId }, (member) => {
      setLoadingAdmin(false);
      setMember(null);
      if (member) {
        setGroupchat((c) => {
          const updatedMembers = c.groupMembers.filter((m) => m.userId !== member.userId);

          const updatedChat: Groupchat = {
            ...c,
            groupMembers: [...updatedMembers, member],
          };
          return updatedChat;
        });
      }
    });
  };

  const handleMakeAdmin = () => {
    if (!selectedMember) return;
    makeAdmin({ roomId: groupchat.id, userId: selectedMember.userId }, (member) => {
      setLoadingAdmin(false);
      setMember(null);
      if (member) {
        setGroupchat((c) => {
          const updatedMembers = c.groupMembers.filter((m) => m.userId !== member.userId);

          const updatedChat: Groupchat = {
            ...c,
            groupMembers: [...updatedMembers, member],
          };
          return updatedChat;
        });
      }
    });
  };

  if (!selectedMember) return null;
  return (
    <BottomSheet
      isVisible={selectedMember !== null}
      onClose={() => setMember(null)}
      snapPoints={[member?.isAdmin ? 0.55 : 0.4]}>
      <View className="items-center">
        <Avatar name={selectedMember.user.name} size={90} />
        <Text className="mt-2 text-3xl font-bold text-white">{selectedMember.user.name}</Text>
        <Text className="text-xl text-[#BBB]">
          {selectedMember.user.email || selectedMember.user.phone}
        </Text>
        <View className="w-full flex-row items-center justify-between">
          {userActionButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleUserActions(button)}
              disabled={handlingUserAction}
              className="mt-4 w-[32%] shrink-0 items-center justify-center gap-1 rounded-xl bg-[#212121] p-4">
              <Ionicons name={button.icon} size={button.size} color="#ca8a04" />
              <Text className="text-sm font-medium text-white">{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {member?.isAdmin && (
          <>
            {selectedMember.isAdmin ? (
              <TouchableOpacity
                disabled={loadingAdmin}
                onPress={() => {
                  handleRemoveAdmin();
                }}
                className="mt-4 w-full flex-row items-center justify-between gap-1 rounded-xl bg-[#212121] p-4 disabled:opacity-60">
                <Text className="text-lg font-medium text-white">Remove admin</Text>
                {loadingAdmin ? (
                  <ActivityIndicator size="small" color="#ca8a04" />
                ) : (
                  <Ionicons name="person-remove-outline" color="white" size={18} />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={loadingAdmin}
                onPress={() => {
                  handleMakeAdmin();
                }}
                className="mt-4 w-full flex-row items-center justify-between gap-1 rounded-xl bg-[#212121] p-4 disabled:opacity-60">
                <Text className="text-lg font-medium text-white">Make group admin</Text>
                {loadingAdmin ? (
                  <ActivityIndicator size="small" color="#ca8a04" />
                ) : (
                  <Ionicons name="person-add-outline" color="white" size={18} />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleRemoveMember}
              className="mt-4 w-full flex-row items-center justify-between gap-1 rounded-xl bg-[#212121] p-4">
              <Text className="text-lg font-medium text-[#EC0000]">Remove from group</Text>
              <Ionicons name="remove-circle-outline" color="#EC0000" size={18} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </BottomSheet>
  );
};

export default GroupchatMemberSheet;
