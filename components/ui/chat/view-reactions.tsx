import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import React, { Dispatch, ReactNode, useEffect, useState } from 'react';
import { NewMessage } from '@/types/chat-socket';
import { BottomSheet } from '../bottom-sheet';
import { SvgUri } from 'react-native-svg';
import useAuth from '@/context/useAuth';
import { helpers } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ViewReactionProps {
  isVisible: boolean;
  onClose: () => void;
  message: NewMessage;
  messages: NewMessage[];
  addReaction: ({}: { messageId: number; reaction: string }) => void;
  removeReaction: ({}: { id: number }) => void;
  name: string;
  toggleEmojiModal: () => void;
}

const ViewReactions = ({
  isVisible,
  onClose,
  message: defaultMessage,
  messages,
  addReaction,
  removeReaction,
  name,
  toggleEmojiModal,
}: ViewReactionProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState(defaultMessage);

  const groupedReactions = helpers.groupReactions(message.reactions || []);

  useEffect(() => {
    if (!messages) return;
    const updatedMessage = messages.find((m) => m.id == message.id);
    if (updatedMessage) setMessage(updatedMessage);
  }, [messages]);

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} snapPoints={[0.45]}>
      <Text className="text-center font-bold text-white">
        {message.reactions?.length} Reactions
      </Text>
      <ScrollView
        contentContainerClassName="gap-4 py-4 w-full"
        horizontal
        showsHorizontalScrollIndicator={false}>
        <Pressable
          onPress={toggleEmojiModal}
          className="h-10 w-[22%] items-center justify-center rounded-full border bg-[#2C2C2E] py-0.5">
          <Ionicons name="add-sharp" size={20} color={'white'} />
        </Pressable>
        {groupedReactions.map((reaction) => {
          const isMyReaction = reaction.userIds.some((r) => r == user?.userId);
          const myReaction = message.reactions.find((r) => r.userId == user?.userId);

          return (
            <Pressable
              onPress={() => {
                if (isMyReaction && myReaction) removeReaction({ id: myReaction.id });
                else {
                  addReaction({ messageId: message.id, reaction: reaction.emoji });
                }
              }}
              key={reaction.emoji}
              className={`w-[22%] items-center rounded-full border py-0.5 ${isMyReaction ? 'border-[#FF6B9DBA] bg-[#FF6B9D9A]' : 'border-[#333]  bg-[#222]'}`}>
              <View className="flex-row items-center ">
                <Text className="text-2xl"> {reaction.emoji} </Text>
                <Text className="text-sm font-extrabold text-[#DDD]">{reaction.count}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView contentContainerClassName="gap-4" showsVerticalScrollIndicator={false}>
        {message.reactions?.map((reaction) => {
          const username = reaction.userId == user?.userId ? user.name : name;

          const Wrapper = ({ children }: { children: ReactNode }) => (
            <>
              {reaction.userId == user?.userId ? (
                <TouchableOpacity
                  onPress={() => removeReaction({ id: reaction.id })}
                  className="flex-row items-center gap-4"
                  style={{ height: 40 }}>
                  {children}
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center gap-4" style={{ height: 40 }}>
                  {children}
                </View>
              )}
            </>
          );

          return (
            <Wrapper key={reaction.id}>
              <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden' }}>
                <SvgUri
                  uri={`https://api.dicebear.com/9.x/big-ears/svg?seed=${username}`}
                  width={40}
                  height={40}
                />
              </View>

              <View className="h-full flex-1 justify-center">
                <Text className="text-base font-bold text-white">{username}</Text>
                {reaction.userId == user?.userId && (
                  <Text className="text-xs text-[#CCC]">{'Tap to remove'}</Text>
                )}
              </View>

              <Text className="ml-auto text-2xl font-semibold">{reaction.reaction}</Text>
            </Wrapper>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
};

export default ViewReactions;
