import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ActionButton } from '@/constants/groupchat';
import { Ionicons } from '@expo/vector-icons';

const GroupchatActionButtons = ({
  button,
  handleAction,
}: {
  button: ActionButton;
  handleAction: (button: ActionButton) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => handleAction(button)}
      className="mt-4 w-[23%] shrink-0 items-center justify-center gap-1 rounded-xl bg-[#212121] p-4">
      <Ionicons name={button.icon} size={button.size} color="#ca8a04" />
      <Text className="text-sm font-medium text-white">{button.label}</Text>
    </TouchableOpacity>
  );
};

export default GroupchatActionButtons;
