import { EVENTS } from '@/utils/constants';
import useSocket from '@/context/chat-socket';
import { router } from 'expo-router';
import { ChatData } from '@/types/slices/user';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { NewMessage } from '@/types/chat-socket';
import useAuth from '@/context/useAuth';

const useChat = ({ setChats }: { setChats?: Dispatch<SetStateAction<ChatData[]>> }) => {
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !setChats) return;

    const handleNewMessage = (message: NewMessage) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id != message.chatId) return c;

          const updatedChat: ChatData = {
            ...c,
            messages: [message],
          };
          return updatedChat;
        });
      });
    };

    socket.on(EVENTS.ON.NEW_MESSAGE, handleNewMessage);

    return () => {
      socket.off(EVENTS.ON.NEW_MESSAGE, handleNewMessage);
    };
  }, [socket, setChats]);

  const createRoom = (selectedUser: { id: number; name: string }) => {
    if (!socket) return;
    socket.emit(
      EVENTS.EMIT.CREATE_ROOM,
      {
        receiverId: selectedUser.id,
        name: selectedUser.name,
      },
      (room: any) => {
        router.dismiss();
        setTimeout(() => {
          router.push({
            pathname: '/message',
            params: { id: room.id, name: selectedUser.name },
          });
        }, 50);
      }
    );
  };

  const joinRoom = ({ room }: { room: number }) => {
    if (!socket || !user) return;
    socket.emit(EVENTS.EMIT.JOIN_ROOM, { room, name: user.email || user.phone });
  };

  return { createRoom, joinRoom };
};

export default useChat;
