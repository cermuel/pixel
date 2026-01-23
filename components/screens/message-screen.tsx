import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  Text,
  Pressable,
} from 'react-native';
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
import { BottomSheet } from '../ui/bottom-sheet';
import useAuth from '@/context/useAuth';
import useChat from '@/hooks/useChat';

const MessageScreenComponent = () => {
  const { user } = useAuth();
  const footerRef = useRef<MessageFooterRef>(null);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<any>(null);
  const { id, name } = useLocalSearchParams();

  const scrollToTop = (isAnimated = false) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: isAnimated });
    }
  };

  const { joinRoom } = useChat({});
  const {
    messages,
    sendMessage,
    addReaction,
    removeReaction,
    startTyping,
    stopTyping,
    typing,
    editMessage,
    deleteMessage,
  } = useMessages({
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
    if (id) joinRoom({ room: Number(id) });
  }, [id]);

  useEffect(() => {
    scrollToTop();
  }, [messages]);

  useEffect(() => {
    if ((messageToReply || messageToEdit) && footerRef) footerRef.current?.focusInput();
    if (messageToEdit) setText(messageToEdit.message);
  }, [messageToReply, messageToEdit]);

  if (!user)
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-[#141718]">
        <Text className="text-2xl font-bold text-white">You are not logged in!</Text>
        <View className="flex-row items-center gap-4">
          <Pressable className="w-max rounded-md bg-white px-6 py-2.5">
            <Text className="text-lg font-bold text-black ">Login</Text>
          </Pressable>
          <Pressable className="w-max rounded-md bg-[#888] px-6 py-2.5">
            <Text className="text-lg font-bold text-black">Home</Text>
          </Pressable>
        </View>
      </View>
    );

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
          <MessageHeader name={name as string} id={Number(id)} />
          <FlatList
            inverted
            className="flex-1"
            data={reversedMessages}
            contentContainerClassName="gap-4 p-4"
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <>
                  {item.senderId == user.userId ? (
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

          <BottomSheet
            isVisible={messageToDelete !== null}
            onClose={() => setMessageToDelete(null)}
            snapPoints={[0.25]}>
            <Text className="mb-1 text-center text-xl font-bold text-white">Delete Message</Text>
            <Text className="text-center text-sm font-bold text-[#CCC]">
              Are you sure you want to delete this message?
            </Text>
            <Text className="text-center text-sm font-bold text-[#CCC]">
              This action cannot be undone.
            </Text>
            <View className="mt-7 flex-1 flex-row items-center gap-4">
              <Pressable
                onPress={() => setMessageToDelete(null)}
                className="flex-1 items-center justify-center rounded-md bg-white py-2.5">
                <Text className="text-lg font-semibold">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (!messageToDelete) return;
                  deleteMessage({ messageId: messageToDelete.id });
                  setMessageToDelete(null);
                }}
                className="flex-1 items-center justify-center rounded-md bg-[#EC0000] py-2.5">
                <Text className="text-lg font-bold text-white">Delete</Text>
              </Pressable>
            </View>
          </BottomSheet>

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
            editMessage={editMessage}
          />
          <View style={{ height: focus ? 0 : insets.bottom }} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreenComponent;
