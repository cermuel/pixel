import { View, Text } from 'react-native';
import React, { useState } from 'react';
import JoinRoom from './join-room';
import useSocket from '@/context/chat-socket';
import { events } from '@/utils/events';

const NotificationWrapper = () => {
  const { socket } = useSocket();
  const [type, setType] = useState<'joined' | null>(null);
  const [data, setData] = useState<{ name: string; room: string; user: string } | null>(null);

  socket?.on(events.JOINED_ROOM, (data: { name: string; room: string; user: string }) => {
    setType('joined');
    setData(data);
  });
  if (type == 'joined' && data && 'name' in data) return <JoinRoom {...data} />;
};

export default NotificationWrapper;
