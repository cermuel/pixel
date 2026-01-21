import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageFooterRef } from '../ui/chat/message-footer';
import { GroupchatMessage } from '@/types/chat-socket';
import { EmojiPicker } from '../shared/emoji-picker';
import TypingIndicator from '../ui/chat/typing-indicator';
import { BottomSheet } from '../ui/bottom-sheet';
import useAuth from '@/context/useAuth';
import { Groupchat, GroupMember } from '@/types/slices/user';
import GroupchatHeader from '../ui/chat/groupchat-header';
import useGroupchatMessages from '@/hooks/useGroupchatMessages';
import GroupchatReceiverMessage from '../ui/chat/groupchat-receiver-message';
import GroupchatSenderMessage from '../ui/chat/groupchat-sender-message';
import GroupchatMessageFooter from '../ui/chat/groupchat-message-footer';
import GroupchatViewReactions from '../ui/chat/groupchat-view-reaction';
import GroupchatMessageMenu from '../ui/chat/groupchat-message-menu';
import { EvilIcons } from '@expo/vector-icons';

const GroupchatMessageScreenComponent = () => {
  const { user } = useAuth();
  const footerRef = useRef<MessageFooterRef>(null);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<any>(null);
  const { id, name, members: membersString, groupchat: groupchatString } = useLocalSearchParams();

  const members: GroupMember[] = JSON.parse(membersString as string);
  const groupchat: Groupchat = JSON.parse(groupchatString as string);

  const scrollToTop = (isAnimated = false) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: isAnimated });
    }
  };

  const {
    messages,
    hasMore,
    typing,
    loadingMore,
    sendMessage,
    addReaction,
    removeReaction,
    startTyping,
    stopTyping,
    editMessage,
    deleteMessage,
    loadMoreMessages,
  } = useGroupchatMessages({
    room: id as string,
  });
  const reversedMessages = [...messages].reverse();

  const [focus, setFocus] = useState(false);
  const [text, setText] = useState<string>('');
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    message: GroupchatMessage | null;
    position: { x: number; y: number; width: number; height: number } | null;
  }>({
    visible: false,
    message: null,
    position: null,
  });
  const [messageToReply, setMessageToReply] = useState<GroupchatMessage | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<GroupchatMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<GroupchatMessage | null>(null);
  const [messageToView, setMessageToView] = useState<GroupchatMessage | null>(null);
  const [showEmojiModal, toggleEmojiModal] = useState(false);
  const [isSearch, toggleSearch] = useState(false);
  const [query, setQuery] = useState('');

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
          {isSearch ? (
            <View className="h-20 flex-row items-center gap-4 px-4">
              <View className="flex-1 flex-row items-center gap-2">
                <EvilIcons name="search" size={24} color="white" />
                <View className="relative flex-1">
                  <TextInput
                    className="flex-1 text-white"
                    onChangeText={(text) => setQuery(text)}
                    value={query}
                    style={{ padding: 0 }}
                  />
                  {!query && (
                    <Text
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-medium text-[#CCC]"
                      style={{ pointerEvents: 'none' }}>
                      Search
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  toggleSearch(false);
                }}>
                <Text className="text-lg font-medium text-white">Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <GroupchatHeader groupchat={groupchat} name={name as string} members={members} />
          )}
          <FlatList
            inverted
            className="flex-1"
            data={reversedMessages}
            contentContainerClassName="gap-4 p-4"
            ListFooterComponent={() =>
              hasMore && (
                <TouchableOpacity
                  onPress={loadMoreMessages}
                  className="mx-auto my-4 w-28 items-center rounded-full bg-[#ca8a04] py-1">
                  {loadingMore ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="my-0.5 font-bold text-white">Load More</Text>
                  )}
                </TouchableOpacity>
              )
            }
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return (
                <>
                  {item.senderId == user.userId ? (
                    <GroupchatSenderMessage
                      setMessageToView={setMessageToView}
                      message={item}
                      handleSwipe={() => setMessageToReply(item)}
                      members={members}
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
                    <GroupchatReceiverMessage
                      setMessageToView={setMessageToView}
                      message={item}
                      handleSwipe={() => setMessageToReply(item)}
                      members={members}
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
          <GroupchatMessageMenu
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
            toggleEmojiModal={toggleEmojiModal}
            members={members}
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
            <GroupchatViewReactions
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

          <GroupchatMessageFooter
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
            members={members}
          />
          <View style={{ height: focus ? 0 : insets.bottom }} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GroupchatMessageScreenComponent;
