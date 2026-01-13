import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import React, { Dispatch, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NewMessage } from '@/types/chat-socket';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReplySection from './reply-section';

export interface MessageFooterRef {
  focusInput: () => void;
  isFocused: () => boolean;
}

interface MessageFooterProps {
  sendMessage: ({}: { message: string; replyTo?: NewMessage }) => void;
  editMessage: ({}: { message: string; messageId: number }) => void;
  setText: Dispatch<React.SetStateAction<string>>;
  text: string;
  messageToReply: NewMessage | null;
  setMessageToReply: Dispatch<NewMessage | null>;
  messageToEdit: NewMessage | null;
  setMessageToEdit: Dispatch<NewMessage | null>;
  name: string;
  setFocus: Dispatch<boolean>;
  startTyping: () => void;
  stopTyping: () => void;
}

const MessageFooter = forwardRef<MessageFooterRef, MessageFooterProps>(
  (
    {
      sendMessage,
      editMessage,
      setText,
      text,
      messageToReply,
      setMessageToReply,
      name,
      messageToEdit,
      setMessageToEdit,
      setFocus,
      startTyping,
      stopTyping,
    },
    ref
  ) => {
    const inputRef = useRef<TextInput>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        inputRef.current?.focus();
      },
      isFocused: () => inputRef.current?.isFocused() || false,
    }));

    useEffect(() => {
      if (text.trim()) {
        if (!isTypingRef.current) {
          startTyping();
          isTypingRef.current = true;
        }

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          stopTyping();
          isTypingRef.current = false;
        }, 3000);
      } else {
        if (isTypingRef.current) {
          stopTyping();
          isTypingRef.current = false;
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }

      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, [text]);

    useEffect(() => {
      return () => {
        stopTyping();
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);

    return (
      <View className="z-10 w-full  gap-4 border-t border-t-[#222] p-5 pb-0">
        {messageToReply && (
          <ReplySection
            messageToReply={messageToReply}
            name={name}
            setMessageToReply={setMessageToReply}
          />
        )}
        <View className="w-full flex-row items-end gap-4">
          <TouchableOpacity className="mb-2">
            <FontAwesome name="microphone" size={16} color="white" />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            numberOfLines={4}
            multiline
            onChangeText={(e) => setText(e)}
            value={text}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            autoCapitalize="none"
            className="flex-1 rounded-[20px] bg-white/10 p-2 px-4 font-medium text-white"
          />
          {messageToEdit && (
            <TouchableOpacity
              className="mb-0.5"
              onPress={() => {
                setText('');
                setMessageToEdit(null);
              }}>
              <Ionicons name="close-sharp" size={24} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="mb-2"
            onPress={() => {
              if (text.trim()) {
                if (messageToEdit) {
                  editMessage({ message: text, messageId: messageToEdit.id });
                  setText('');
                  setMessageToEdit(null);
                } else {
                  sendMessage({ message: text, replyTo: messageToReply || undefined });
                  setText('');
                  setMessageToReply(null);
                }
              }
            }}>
            <FontAwesome name="send" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

MessageFooter.displayName = 'MessageFooter';

export default MessageFooter;
