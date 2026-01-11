import { View, FlatList, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SenderMessage from '../ui/chat/sender-message';
import ReceiverMessage from '../ui/chat/receiver-message';
import MessageHeader from '../ui/chat/message-header';
import MessageFooter, { MessageFooterRef } from '../ui/chat/message-footer';
import useMessages from '@/hooks/useMessages';
import { NewMessage } from '@/types/chat-socket';
import MessageMenu from '../ui/chat/message-menu';
import ViewReactions from '../ui/chat/view-reactions';
import { EmojiPicker } from '../shared/emoji-picker';
import TypingIndicator from '../ui/chat/typing-indicator';

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

  const { messages, sendMessage, addReaction, removeReaction, startTyping, stopTyping, typing } =
    useMessages({
      room: id as string,
    });
  const reversedMessages = [...messages].reverse();

  const [focus, setFocus] = useState(false);
  const [text, setText] = useState<string>('');
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    message: NewMessage | null;
    position: { x: number; y: number; width: number; height: number } | null;
  }>({
    visible: false,
    message: null,
    position: null,
  });
  const [messageToReply, setMessageToReply] = useState<NewMessage | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<NewMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<NewMessage | null>(null);
  const [messageToView, setMessageToView] = useState<NewMessage | null>(null);
  const [showEmojiModal, toggleEmojiModal] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, [messages]);

  useEffect(() => {
    if ((messageToReply || messageToEdit) && footerRef) footerRef.current?.focusInput();
    if (messageToEdit) setText(messageToEdit.message);
  }, [messageToReply, messageToEdit]);

  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,

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
              return (
                <>
                  {item.senderId !== Number(receiverId) ? (
                    <SenderMessage
                      setMessageToView={setMessageToView}
                      message={item}
                      handleSwipe={() => setMessageToReply(item)}
                      name={name as string}
                      onLongPress={() => {
                        setMenuState({
                          visible: true,
                          message: item,
                          position: {
                            x: 0,
                            y: 0,
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').height,
                          },
                        });
                      }}
                    />
                  ) : (
                    <ReceiverMessage
                      setMessageToView={setMessageToView}
                      message={item}
                      handleSwipe={() => setMessageToReply(item)}
                      name={name as string}
                      onLongPress={() => {
                        setMenuState({
                          visible: true,
                          message: item,
                          position: {
                            x: 0,
                            y: 0,
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').height,
                          },
                        });
                      }}
                    />
                  )}
                </>
              );
            }}
          />
          <MessageMenu
            visible={menuState.visible}
            message={menuState.message}
            position={menuState.position}
            onClose={() => setMenuState({ visible: false, message: null, position: null })}
            addReaction={addReaction}
            removeReaction={removeReaction}
            name={name as string}
            setMessageToReply={setMessageToReply}
            setMessageToEdit={setMessageToEdit}
            setMessageToDelete={setMessageToDelete}
            room=""
            showEmojiModal={showEmojiModal}
            toggleEmojiModal={toggleEmojiModal}
          />

          <EmojiPicker
            isVisible={showEmojiModal}
            onClose={() => toggleEmojiModal(false)}
            onEmojiSelect={(emoji) => {
              if (!menuState.message && !messageToView) return;

              const messageId = menuState.message?.id ?? messageToView!.id;
              addReaction({ messageId, reaction: emoji });
              setMenuState({ visible: false, message: null, position: null });
              toggleEmojiModal(false);
            }}
          />
          {messageToView && (
            <ViewReactions
              isVisible={messageToView !== null}
              message={messageToView}
              messages={messages}
              onClose={() => setMessageToView(null)}
              addReaction={addReaction}
              removeReaction={removeReaction}
              name={name as string}
              toggleEmojiModal={() => {
                setMenuState({
                  visible: false,
                  message: messageToView,
                  position: {
                    x: 0,
                    y: 0,
                    width: Dimensions.get('screen').width,
                    height: Dimensions.get('screen').height,
                  },
                });
                toggleEmojiModal(true);
                setMessageToView(null);
              }}
            />
          )}
          {typing && <TypingIndicator />}

          <MessageFooter
            messageToReply={messageToReply}
            setMessageToReply={setMessageToReply}
            messageToEdit={messageToEdit}
            setMessageToEdit={setMessageToEdit}
            ref={footerRef}
            sendMessage={sendMessage}
            setText={setText}
            text={text}
            name={name as string}
            setFocus={setFocus}
            startTyping={startTyping}
            stopTyping={stopTyping}
          />
          <View style={{ height: focus ? 0 : insets.bottom }} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreenComponent;
