import { useEffect, useState } from 'react';
import { GC_EVENTS } from '@/utils/constants';
import useSocket from '@/context/chat-socket';
import { GroupchatMessage, GroupchatReaction, Reaction } from '@/types/chat-socket';
import useAuth from '@/context/useAuth';

const useGroupchatMessages = ({ room: roomString }: { room: string }) => {
  const { user } = useAuth();
  const room = Number(roomString);
  const { socket } = useSocket();
  const [messages, setMessages] = useState<GroupchatMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [typing, setTyping] = useState<{ name: string; userId: number; room: number } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit(GC_EVENTS.EMIT.JOIN_ROOM, { room, name: user.email || user.phone });
  }, [room, user]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleMessages = ({ messages: initMessages, hasMore: initHasMore }: any) => {
      setMessages(initMessages);
      setHasMore(initHasMore);

      const unreadMessageIds = initMessages
        .filter((msg: GroupchatMessage) => msg.senderId !== user.userId && msg.status !== 'READ')
        .map((msg: GroupchatMessage) => msg.id);

      if (unreadMessageIds.length > 0) {
        socket.emit(GC_EVENTS.EMIT.MARK_AS_READ, { messageIds: unreadMessageIds, roomId: room });
      }
    };

    const handleNewMessage = (message: GroupchatMessage) => {
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
          socket.emit(GC_EVENTS.EMIT.MARK_AS_READ, { messageIds: [message.id], roomId: room });
        }

        return [...prev, message];
      });
    };

    const handleMessagesRead = ({ messageIds }: { messageIds: number[] }) => {
      setMessages((prev) =>
        prev.map((m) => (messageIds.includes(m.id as number) ? { ...m, status: 'READ' } : m))
      );
    };

    const handleReactionAdded = (reaction: GroupchatReaction) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === reaction.groupchatMessageId
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
    const handleTypingStopped = () => {
      setTyping(null);
    };

    const handleMessageEdited = (message: GroupchatMessage) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== message.id) return m;
          return message;
        })
      );
    };
    const handleMessageDeleted = (message: GroupchatMessage) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== message.id) return m;
          return message;
        })
      );
    };

    socket.on(GC_EVENTS.ON.MESSAGES, handleMessages);
    socket.on(GC_EVENTS.ON.NEW_MESSAGE, handleNewMessage);
    socket.on(GC_EVENTS.ON.MESSAGES_READ, handleMessagesRead);
    socket.on(GC_EVENTS.ON.MESSAGE_REACTED, handleReactionAdded);
    socket.on(GC_EVENTS.ON.MESSAGE_UNREACTED, handleReactionRemoved);
    socket.on(GC_EVENTS.ON.USER_TYPING, handleTyping);
    socket.on(GC_EVENTS.ON.USER_STOPPED_TYPING, handleTypingStopped);
    socket.on(GC_EVENTS.ON.MESSAGE_EDITED, handleMessageEdited);
    socket.on(GC_EVENTS.ON.MESSAGE_DELETED, handleMessageDeleted);

    return () => {
      socket.off(GC_EVENTS.ON.MESSAGES, handleMessages);
      socket.off(GC_EVENTS.ON.NEW_MESSAGE, handleNewMessage);
      socket.off(GC_EVENTS.ON.MESSAGES_READ, handleMessagesRead);
      socket.off(GC_EVENTS.ON.MESSAGE_REACTED, handleReactionAdded);
      socket.off(GC_EVENTS.ON.MESSAGE_UNREACTED, handleReactionRemoved);
      socket.off(GC_EVENTS.ON.USER_TYPING, handleTyping);
      socket.off(GC_EVENTS.ON.USER_STOPPED_TYPING, handleTypingStopped);
      socket.off(GC_EVENTS.ON.MESSAGE_EDITED, handleMessageEdited);
      socket.off(GC_EVENTS.ON.MESSAGE_DELETED, handleMessageDeleted);
    };
  }, [socket, user]);

  const sendMessage = ({ message, replyTo }: { message: string; replyTo?: GroupchatMessage }) => {
    if (!socket || !user) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;

    const optimisticMessage = {
      id: tempId as any as number,
      isDeleted: false,
      message,
      senderId: user.userId,
      groupchatId: room,
      replyTo: replyTo,
      replyToId: replyTo?.id || null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      deletedAt: null,
      reactions: [],
      status: 'PENDING' as const,
    } as GroupchatMessage;

    setMessages((prev) => [...prev, optimisticMessage]);

    const messageToSend = {
      roomId: room,
      message: message.trim(),
      replyToId: replyTo?.id,
    };

    socket.emit('GC_SEND_MESSAGE', messageToSend, () => {});
  };

  const editMessage = ({ message, messageId }: { message: string; messageId: number }) => {
    if (!socket) return;
    const messageToSend = {
      roomId: room,
      message: message.trim,
      messageId,
    };

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        return { ...m, status: 'PENDING' };
      })
    );

    socket.emit(GC_EVENTS.EMIT.EDIT_MESSAGE, messageToSend, () => {});
  };

  const deleteMessage = ({ messageId }: { messageId: number }) => {
    if (!socket) return;
    const messageToDelete = {
      roomId: room,
      messageId,
    };

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        return { ...m, isDeleted: true };
      })
    );

    socket.emit(GC_EVENTS.EMIT.DELETE_MESSAGE, messageToDelete, () => {});
  };

  const addReaction = ({ messageId, reaction }: { messageId: number; reaction: string }) => {
    if (!socket) return;
    socket.emit(GC_EVENTS.EMIT.REACT_TO_MESSAGE, { messageId, reaction, roomId: room }, () => {});
  };
  const removeReaction = ({ id }: { id: number }) => {
    if (!socket) return;
    socket.emit(GC_EVENTS.EMIT.UNREACT_TO_MESSAGE, { id, roomId: room }, () => {});
  };
  const startTyping = () => {
    if (!socket) return;
    socket.emit(GC_EVENTS.EMIT.TYPING, { roomId: room }, () => {});
  };
  const stopTyping = () => {
    if (!socket) return;
    socket.emit(GC_EVENTS.EMIT.STOP_TYPING, { roomId: room }, () => {});
  };

  const loadMoreMessages = () => {
    if (!hasMore || loadingMore || messages.length === 0 || !socket) return;

    setLoadingMore(true);

    const oldestMessage = messages[0];

    socket.emit(
      'GC_LOAD_MORE_MESSAGES',
      { roomId: room, cursor: oldestMessage.id },
      (result: { messages: any[]; hasMore: boolean }) => {
        setMessages((prev) => [...result.messages, ...prev]);
        setHasMore(result.hasMore);
        setLoadingMore(false);
      }
    );
  };

  return {
    messages,
    typing,
    hasMore,
    loadingMore,
    sendMessage,
    addReaction,
    removeReaction,
    startTyping,
    stopTyping,
    editMessage,
    deleteMessage,
    loadMoreMessages,
  };
};

export default useGroupchatMessages;
