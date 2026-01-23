import { GC_EVENTS } from '@/utils/constants';
import useSocket from '@/context/chat-socket';
import { Groupchat, GroupMember } from '@/types/slices/user';
import { Dispatch, SetStateAction, useEffect } from 'react';
import useAuth from '@/context/useAuth';
import { GroupchatMessage } from '@/types/chat-socket';

const useGroupChat = ({ setChats }: { setChats?: Dispatch<SetStateAction<Groupchat[]>> }) => {
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !setChats) return;

    const handleNewMessage = (message: GroupchatMessage) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id != message.groupchatId) return c;

          const updatedChat: Groupchat = {
            ...c,
            messages: [message],
          };
          return updatedChat;
        });
      });
    };

    const handleTyping = (typingData: { name: string; userId: number; roomId: number }) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id != typingData.roomId) return c;

          const updatedChat: Groupchat = {
            ...c,
            isTyping: true,
            typingUser: typingData.name,
          };

          return updatedChat;
        });
      });
    };

    const handleTypingStopped = (typingData: { name: string; userId: number; roomId: number }) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id != typingData.roomId) return c;

          const updatedChat: Groupchat = {
            ...c,
            isTyping: false,
            typingUser: undefined,
          };
          return updatedChat;
        });
      });
    };

    const handleMessageDeleted = (message: GroupchatMessage) => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== message.groupchatId) return c;
          return {
            ...c,
            messages:
              c.messages.length > 0
                ? [{ ...c.messages[0], message: 'This message was deleted' }]
                : [],
          };
          // return message;
        })
      );
    };

    const handleAdmin = (member: GroupMember) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id != member.groupchatId) return c;

          const updatedMembers = c.groupMembers.filter((m) => m.userId !== member.userId);

          const updatedChat: Groupchat = {
            ...c,
            groupMembers: [...updatedMembers, member],
          };
          return updatedChat;
        });
      });
    };

    const handleMember = (data: { member: GroupMember; status: 'ADDED' | 'REMOVED' }) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id !== data.member.groupchatId) return c;

          let updatedMembers: GroupMember[];

          if (data.status === 'ADDED') {
            const memberExists = c.groupMembers.some((m) => m.userId === data.member.userId);
            updatedMembers = memberExists ? c.groupMembers : [...c.groupMembers, data.member];
          } else {
            updatedMembers = c.groupMembers.filter((m) => m.userId !== data.member.userId);
          }

          return {
            ...c,
            groupMembers: updatedMembers,
          };
        });
      });
    };

    const handleGroupchatEdited = (groupchat: Groupchat) => {
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id != groupchat.id) return c;

          const updatedChat: Groupchat = {
            ...c,
            name: groupchat.name || c.name,
            photo: groupchat.photo || c.photo,
            updatedAt: groupchat.updatedAt || c.updatedAt,
          };

          return updatedChat;
        });
      });
    };

    socket.on(GC_EVENTS.ON.NEW_MESSAGE, handleNewMessage);
    socket.on(GC_EVENTS.ON.USER_TYPING, handleTyping);
    socket.on(GC_EVENTS.ON.USER_STOPPED_TYPING, handleTypingStopped);
    socket.on(GC_EVENTS.ON.MESSAGE_DELETED, handleMessageDeleted);
    socket.on(GC_EVENTS.ON.GC_ADMIN_UPDATED, handleAdmin);
    socket.on(GC_EVENTS.ON.GC_MEMBER_UPDATED, handleMember);
    socket.on(GC_EVENTS.ON.GC_GROUPCHAT_EDITED, handleGroupchatEdited);
    return () => {
      socket.off(GC_EVENTS.ON.NEW_MESSAGE, handleNewMessage);
      socket.off(GC_EVENTS.ON.USER_TYPING, handleTyping);
      socket.off(GC_EVENTS.ON.USER_STOPPED_TYPING, handleTypingStopped);
      socket.off(GC_EVENTS.ON.MESSAGE_DELETED, handleMessageDeleted);
      socket.off(GC_EVENTS.ON.GC_ADMIN_UPDATED, handleAdmin);
      socket.off(GC_EVENTS.ON.GC_MEMBER_UPDATED, handleMember);
      socket.off(GC_EVENTS.ON.GC_GROUPCHAT_EDITED, handleGroupchatEdited);
    };
  }, [socket, setChats]);

  const joinRoom = ({ room }: { room: number }) => {
    if (!socket || !user) return;
    socket.emit(GC_EVENTS.EMIT.JOIN_ROOM, { room, name: user.name || user.phone });
  };

  const makeAdmin = (
    { roomId, userId }: { roomId: number; userId: number },
    callback: (member: GroupMember | null) => void
  ): void => {
    if (!socket) {
      callback(null);
      return;
    }
    socket.emit(GC_EVENTS.EMIT.GC_MAKE_ADMIN, { roomId, userId }, (member: GroupMember) => {
      callback(member);
    });
  };

  const removeAdmin = (
    { roomId, userId }: { roomId: number; userId: number },
    callback: (member: GroupMember | null) => void
  ): void => {
    if (!socket) {
      callback(null);
      return;
    }

    socket.emit(GC_EVENTS.EMIT.GC_REMOVE_ADMIN, { roomId, userId }, (member: GroupMember) => {
      callback(member);
    });
  };

  const addMember = (
    { roomId, userId }: { roomId: number; userId: number },
    callback: (member: { member: GroupMember; status: 'ADDED' | 'REMOVED' } | null) => void
  ): void => {
    if (!socket) {
      callback(null);
      return;
    }
    socket.emit(
      GC_EVENTS.EMIT.GC_ADD_MEMBER,
      { roomId, userId },
      (data: { member: GroupMember; status: 'ADDED' | 'REMOVED' }) => {
        callback(data);
      }
    );
  };
  const removeMember = (
    { roomId, userId }: { roomId: number; userId: number },
    callback: (member: { member: GroupMember; status: 'ADDED' | 'REMOVED' } | null) => void
  ): void => {
    if (!socket) {
      callback(null);
      return;
    }
    socket.emit(
      GC_EVENTS.EMIT.GC_REMOVE_MEMBER,
      { roomId, userId },
      (data: { member: GroupMember; status: 'ADDED' | 'REMOVED' }) => {
        callback(data);
      }
    );
  };

  const editRoom = (
    { roomId, name, photo }: { roomId: number; name: string; photo?: string },
    callback: (groupchat: Groupchat | null) => void
  ): void => {
    if (!socket) {
      callback(null);
      return;
    }

    socket.emit(GC_EVENTS.EMIT.GC_EDIT_GROUPCHAT, { roomId, name, photo }, (data: Groupchat) => {
      callback(data);
    });
  };

  return { joinRoom, editRoom, makeAdmin, removeAdmin, addMember, removeMember };
};

export default useGroupChat;
