import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import React, { Dispatch, useRef, forwardRef, useImperativeHandle } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NewMessage } from '@/types/chat-socket';
import useAuth from '@/context/useAuth';
import { helpers } from '@/utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReplySection from './reply-section';

export interface MessageFooterRef {
  focusInput: () => void;
}

interface MessageFooterProps {
  sendMessage: ({ message, replyToId }: { message: string; replyToId?: number }) => void;
  setText: Dispatch<React.SetStateAction<string>>;
  text: string;
  messageToReply: NewMessage | null;
  setMessageToReply: Dispatch<NewMessage | null>;
  name: string;
}

const MessageFooter = forwardRef<MessageFooterRef, MessageFooterProps>(
  ({ sendMessage, setText, text, messageToReply, setMessageToReply, name }, ref) => {
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        inputRef.current?.focus();
      },
    }));

    return (
      <View className="z-10 w-full  gap-4 border-t border-t-[#222] p-5 pb-0">
        {messageToReply && (
          <ReplySection
            messageToReply={messageToReply}
            name={name}
            setMessageToReply={setMessageToReply}
          />
        )}
        <View className="w-full flex-row items-center gap-4">
          <TouchableOpacity>
            <FontAwesome name="microphone" size={16} color="white" />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            onChangeText={(e) => setText(e)}
            value={text}
            autoCapitalize="none"
            className="flex-1 rounded-full bg-white/10 p-2 px-4 font-medium text-white"
          />
          <TouchableOpacity
            onPress={() => {
              if (text.trim()) {
                sendMessage({ message: text, replyToId: messageToReply?.id });
                setText('');
                setMessageToReply(null);
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
