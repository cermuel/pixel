import { useEffect, useState } from 'react';
import { EVENTS } from '@/utils/constants';
import useSocket from '@/context/chat-socket';
import { NewMessage } from '@/types/chat-socket';

const useChat = ({ room: roomString, name }: { room: string; name: string }) => {
  const room = Number(roomString);
  const { socket } = useSocket();
  const [messages, setMessages] = useState<NewMessage[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit(EVENTS.EMIT.JOIN_ROOM, { room, name });
  }, [room, name]);

  useEffect(() => {
    if (!socket) return;

    const handleMessages = ({ messages: initMessages }: any) => {
      setMessages(initMessages);
    };

    const handleNewMessage = (message: NewMessage) => {
      console.log('handled new message');
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.on(EVENTS.ON.MESSAGES, handleMessages);
    socket.on(EVENTS.ON.NEW_MESSAGE, handleNewMessage);

    return () => {
      socket.off(EVENTS.ON.MESSAGES, handleMessages);
      socket.off(EVENTS.ON.NEW_MESSAGE, handleNewMessage);
    };
  }, [socket]);

  const sendMessage = ({ message }: { message: string }) => {
    if (!socket) return;
    const messageToSend = {
      roomId: room,
      message,
    };
    socket.emit(EVENTS.EMIT.SEND_MESSAGE, messageToSend, () => {
      console.log('message sent successdfully');
    });
  };
  return { messages, sendMessage };
};

export default useChat;
