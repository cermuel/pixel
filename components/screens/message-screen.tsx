import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { helpers } from '@/utils/helpers';
import SenderMessage from '../ui/chat/sender-message';
import ReceiverMessage from '../ui/chat/receiver-message';
import useChat from '@/hooks/useChat';
import MessageHeader from '../ui/chat/message-header';
import MessageFooter from '../ui/chat/message-footer';

const MessageScreenComponent = () => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<any>(null);
  const { id, receiverId, name } = useLocalSearchParams();

  const scrollToTop = (isAnimated = false) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: isAnimated });
    }
  };

  const { messages, sendMessage } = useChat({ room: id as string, name: name as string });
  const reversedMessages = [...messages].reverse();

  useEffect(() => {
    scrollToTop();
  }, [messages]);

  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
        paddingLeft: insets.left,
      }}
      edges={[]}
      className="flex-1 bg-[#141718]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top / 2}>
        <View className="relative flex-1">
          <MessageHeader name={name as string} />
          <FlatList
            inverted
            className="flex-1"
            data={reversedMessages}
            contentContainerClassName="gap-4 p-4"
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              const currentTime = helpers.formatChatTime(item.createdAt);
              const nextItem = messages[index + 1];

              const showTimestamp =
                !nextItem ||
                helpers.formatChatTime(nextItem.createdAt) !== currentTime ||
                nextItem.senderId !== item.senderId;

              return (
                <>
                  {item.senderId !== Number(receiverId) ? (
                    <SenderMessage
                      message={item}
                      showTimestamp={showTimestamp}
                      currentTime={currentTime}
                    />
                  ) : (
                    <ReceiverMessage
                      message={item}
                      showTimestamp={showTimestamp}
                      currentTime={currentTime}
                    />
                  )}
                </>
              );
            }}
          />

          <MessageFooter sendMessage={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreenComponent;
