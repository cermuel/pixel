import { useEffect, useState } from 'react';
import { EVENTS } from '@/utils/constants';
import useSocket from '@/context/chat-socket';
import { NewMessage, Reaction } from '@/types/chat-socket';
import useAuth from '@/context/useAuth';

const useMessages = ({ room: roomString }: { room: string }) => {
  const { user } = useAuth();
  const room = Number(roomString);
  const { socket } = useSocket();
  const [messages, setMessages] = useState<NewMessage[]>([]);
  const [typing, setTyping] = useState<{ name: string; userId: number; room: number } | null>(null);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit(EVENTS.EMIT.JOIN_ROOM, { room, name: user.email || user.phone });
  }, [room, user]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleMessages = ({ messages: initMessages }: any) => {
      setMessages(initMessages);

      const unreadMessageIds = initMessages
        .filter((msg: NewMessage) => msg.senderId !== user.userId && msg.status !== 'READ')
        .map((msg: NewMessage) => msg.id);

      if (unreadMessageIds.length > 0) {
        socket.emit(EVENTS.EMIT.MARK_AS_READ, { messageIds: unreadMessageIds, roomId: room });
      }
    };

    const handleNewMessage = (message: NewMessage) => {
      setMessages((prev) => {
        const optimisticIndex = prev.findIndex(
          (m) =>
            (m.id as any).toString().startsWith('temp-') &&
            m.message === message.message &&
            m.senderId === message.senderId &&
            m.status === 'PENDING'
        );

        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = {
            ...message,
            reactions: message.reactions || [],
            status: 'SENT',
          };
          return updated;
        }

        if (prev.some((m) => m.id === message.id)) return prev;

        if (message.senderId !== user.userId) {
          socket.emit(EVENTS.EMIT.MARK_AS_READ, { messageIds: [message.id], roomId: room });
        }

        return [...prev, message];
      });
    };

    const handleMessagesRead = ({ messageIds }: { messageIds: number[] }) => {
      setMessages((prev) =>
        prev.map((m) => (messageIds.includes(m.id as number) ? { ...m, status: 'READ' } : m))
      );
    };

    const handleReactionAdded = (reaction: Reaction) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === reaction.messageId
            ? {
                ...m,
                reactions: [...(m.reactions || []).filter((r) => r.id !== reaction.id), reaction],
              }
            : m
        )
      );
    };

    const handleReactionRemoved = (reaction: Reaction) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === reaction.messageId
            ? {
                ...m,
                reactions: m.reactions?.filter((r) => r.id !== reaction.id) || [],
              }
            : m
        )
      );
    };

    const handleTyping = (typingData: { name: string; userId: number; room: number }) => {
      setTyping(typingData);
    };
    const handleTypingStopped = (typingData: { name: string; userId: number; room: number }) => {
      setTyping(null);
    };

    socket.on(EVENTS.ON.MESSAGES, handleMessages);
    socket.on(EVENTS.ON.NEW_MESSAGE, handleNewMessage);
    socket.on(EVENTS.ON.MESSAGES_READ, handleMessagesRead);
    socket.on(EVENTS.ON.MESSAGE_REACTED, handleReactionAdded);
    socket.on(EVENTS.ON.MESSAGE_UNREACTED, handleReactionRemoved);
    socket.on(EVENTS.ON.USER_TYPING, handleTyping);
    socket.on(EVENTS.ON.USER_STOPPED_TYPING, handleTypingStopped);

    return () => {
      socket.off(EVENTS.ON.MESSAGES, handleMessages);
      socket.off(EVENTS.ON.NEW_MESSAGE, handleNewMessage);
      socket.off(EVENTS.ON.MESSAGES_READ, handleMessagesRead);
      socket.off(EVENTS.ON.MESSAGE_REACTED, handleReactionAdded);
      socket.off(EVENTS.ON.MESSAGE_UNREACTED, handleReactionRemoved);
      socket.off(EVENTS.ON.USER_TYPING, handleTyping);
      socket.off(EVENTS.ON.USER_STOPPED_TYPING, handleTypingStopped);
    };
  }, [socket, user]);

  const sendMessage = ({ message, replyToId }: { message: string; replyToId?: number }) => {
    if (!socket || !user) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;

    const optimisticMessage = {
      id: tempId as any as number,
      message,
      senderId: user.userId,
      chatId: room,
      replyTo: null,
      replyToId: replyToId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      reactions: [],
      status: 'PENDING' as const,
    } as NewMessage;

    setMessages((prev) => [...prev, optimisticMessage]);

    const messageToSend = {
      roomId: room,
      message,
      replyToId,
    };

    socket.emit(EVENTS.EMIT.SEND_MESSAGE, messageToSend, () => {});
  };

  const addReaction = ({ messageId, reaction }: { messageId: number; reaction: string }) => {
    if (!socket) return;
    socket.emit(EVENTS.EMIT.REACT_TO_MESSAGE, { messageId, reaction, roomId: room }, () => {});
  };
  const removeReaction = ({ id }: { id: number }) => {
    if (!socket) return;
    socket.emit(EVENTS.EMIT.UNREACT_TO_MESSAGE, { id, roomId: room }, () => {});
  };
  const startTyping = () => {
    if (!socket) return;
    socket.emit(EVENTS.EMIT.TYPING, { roomId: room }, () => {});
  };
  const stopTyping = () => {
    if (!socket) return;
    socket.emit(EVENTS.EMIT.STOP_TYPING, { roomId: room }, () => {});
  };

  return { messages, sendMessage, addReaction, removeReaction, startTyping, stopTyping, typing };
};

export default useMessages;
