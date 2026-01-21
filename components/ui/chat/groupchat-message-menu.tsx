import useAuth from '@/context/useAuth';
import { GroupchatMessage } from '@/types/chat-socket';
import { constants } from '@/utils/constants';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dispatch, useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import SenderMessage from './sender-message';
import ReceiverMessage from './receiver-message';
import { BlurView } from 'expo-blur';
import Feather from '@expo/vector-icons/Feather';
import GroupchatSenderMessage from './groupchat-sender-message';
import GroupchatReceiverMessage from './groupchat-receiver-message';
import { GroupMember } from '@/types/slices/user';

export const GroupchatMessageMenu = ({
  visible,
  message,
  position,
  onClose,
  addReaction,
  name,
  setMessageToReply,
  setMessageToEdit,
  setMessageToDelete,
  toggleEmojiModal,
  members,
}: {
  visible: boolean;
  message: GroupchatMessage | null;
  position: { x: number; y: number; width: number; height: number } | null;
  onClose: () => void;
  addReaction: ({}: { messageId: number; reaction: string }) => void;
  removeReaction: ({}: { id: number }) => void;
  setMessageToReply: Dispatch<GroupchatMessage | null>;
  setMessageToEdit: Dispatch<GroupchatMessage | null>;
  setMessageToDelete: Dispatch<GroupchatMessage | null>;
  name: string;
  toggleEmojiModal: Dispatch<boolean>;
  members: GroupMember[];
}) => {
  const { user } = useAuth();
  const menuOpacity = useSharedValue(0);
  const menuScale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      menuOpacity.value = withTiming(1, { duration: 200 });
      menuScale.value = withTiming(1, { duration: 200 });
    } else {
      menuOpacity.value = withTiming(0, { duration: 150 });
      menuScale.value = withTiming(0.8, { duration: 150 });
    }
  }, [visible]);

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    transform: [{ scale: menuScale.value }],
  }));

  if (!visible || !position || !message) return null;

  const menuHeight = 250;
  const messageCenter = position.y + position.height / 2;

  let topPosition = messageCenter - menuHeight / 2;

  if (topPosition < 20) {
    topPosition = position.y;
  } else if (topPosition + menuHeight > Dimensions.get('window').height - 20) {
    topPosition = position.y + position.height - menuHeight;
  }

  const handleReaction = (reaction: string) => {
    addReaction({ messageId: message.id, reaction });
    onClose();
  };

  const handleReply = () => {
    setMessageToReply(message);
    onClose();
  };

  const handleCopy = () => {};

  const handleDelete = () => {
    setMessageToDelete(message);
    onClose();
  };

  const handleEdit = () => {
    setMessageToEdit(message);
    onClose();
  };

  return (
    <>
      <Pressable
        onPress={onClose}
        className="absolute inset-0 z-40 h-full w-full "
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <BlurView intensity={30} tint="dark" className="absolute inset-0" />

      <Animated.View
        style={[
          menuAnimatedStyle,
          {
            position: 'absolute',
            left: 16,
            top: topPosition,
            right: 16,
            zIndex: 50,
          },
        ]}>
        <View
          className={`${user?.userId == message.senderId ? 'ml-auto' : 'mr-auto'} mb-3 flex-row  justify-center gap-1.5 rounded-full bg-[#1C1C1E] p-2 shadow-lg`}>
          {constants.DEFAULT_EMOJIS.map((reaction, index) => (
            <Pressable
              key={index}
              onPress={() => handleReaction(reaction)}
              className="h-11 w-11 items-center justify-center rounded-full active:bg-[#2C2C2E]">
              <Text className="text-4xl">{reaction}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => toggleEmojiModal(true)}
            className="h-10 w-10 items-center justify-center rounded-full bg-[#2C2C2E]">
            <Ionicons name="add-sharp" size={20} color={'white'} />
          </Pressable>
        </View>

        {user &&
          (user.userId == message.senderId ? (
            <GroupchatSenderMessage message={message} members={members} isPreview />
          ) : (
            <GroupchatReceiverMessage message={message} isPreview members={members} />
          ))}

        <View
          className={`${user?.userId == message.senderId ? 'ml-auto' : 'mr-auto'} mt-3 w-52 overflow-hidden rounded-lg border border-[#2C2C2E] bg-[#1C1C1E] shadow-lg`}>
          <Pressable
            onPress={handleReply}
            className="flex-row items-center gap-3 border-b border-[#2C2C2E] px-4 py-3 active:bg-[#2C2C2E]">
            <FontAwesome6 name="reply" size={17} color="#AAA" />
            <Text className="text-lg text-white">Reply</Text>
          </Pressable>

          <Pressable
            onPress={handleCopy}
            className="flex-row items-center gap-3 border-b border-[#2C2C2E] px-4 py-3 active:bg-[#2C2C2E]">
            <Ionicons name="copy-outline" size={17} color="#AAA" />
            <Text className="text-lg text-white">Copy</Text>
          </Pressable>

          {message.senderId == user?.userId && (
            <>
              <Pressable
                onPress={handleEdit}
                className="flex-row items-center gap-3 border-b border-[#2C2C2E] px-4 py-3 active:bg-[#2C2C2E]">
                <Feather name="edit-3" size={18} color="#AAA" />
                <Text className="text-lg text-white">Edit</Text>
              </Pressable>

              <Pressable
                onPress={handleDelete}
                className="flex-row items-center gap-3 px-4 py-3 active:bg-[#2C2C2E]">
                <Ionicons name="trash-outline" size={17} color="#FF453A" />
                <Text className="text-lg text-[#FF453A]">Delete</Text>
              </Pressable>
            </>
          )}
        </View>
      </Animated.View>
    </>
  );
};

export default GroupchatMessageMenu;
