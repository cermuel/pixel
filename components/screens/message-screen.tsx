import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { helpers } from '@/utils/helpers';
import SenderMessage from '../ui/chat/sender-message';
import ReceiverMessage from '../ui/chat/receiver-message';
import MessageHeader from '../ui/chat/message-header';
import MessageFooter, { MessageFooterRef } from '../ui/chat/message-footer';
import useMessages from '@/hooks/useMessages';
import { NewMessage } from '@/types/chat-socket';

const MessageScreenComponent = () => {
  const footerRef = useRef<MessageFooterRef>(null);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<any>(null);
  const { id, receiverId, name } = useLocalSearchParams();

  const scrollToTop = (isAnimated = false) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: isAnimated });
    }
  };

  const { messages, sendMessage } = useMessages({ room: id as string });
  const reversedMessages = [...messages].reverse();

  const [text, setText] = useState<string>('');
  const [messageToReply, setMessageToReply] = useState<NewMessage | null>(null);

  useEffect(() => {
    scrollToTop();
  }, [messages]);

  useEffect(() => {
    if (messageToReply && footerRef) footerRef.current?.focusInput();
  }, [messageToReply]);

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
                      handleSwipe={() => setMessageToReply(item)}
                      name={name as string}
                    />
                  ) : (
                    <ReceiverMessage
                      message={item}
                      showTimestamp={showTimestamp}
                      currentTime={currentTime}
                      handleSwipe={() => setMessageToReply(item)}
                      name={name as string}
                    />
                  )}
                </>
              );
            }}
          />

          <MessageFooter
            messageToReply={messageToReply}
            setMessageToReply={setMessageToReply}
            ref={footerRef}
            sendMessage={sendMessage}
            setText={setText}
            text={text}
            name={name as string}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreenComponent;
