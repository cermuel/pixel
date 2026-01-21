export interface NewMessage {
  id: number;
  chatId: number;
  senderId: number;
  replyTo: Omit<NewMessage, 'replyTo' | 'reactions'> | null;
  replyToId: number | null;
  message: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  reactions: Reaction[];
  status?: 'PENDING' | 'SENT' | 'READ' | undefined;
  isDeleted?: boolean;
}

export interface Reaction {
  id: number;
  messageId: number;
  reaction: string;
  userId: number;
}

export interface GroupchatReaction {
  id: number;
  groupchatMessageId: number;
  reaction: string;
  userId: number;
}

export interface GroupchatMessage {
  id: number;
  groupchatId: number;
  senderId: number;
  replyTo: Omit<GroupchatMessage, 'replyTo' | 'reactions'> | null;
  replyToId: number | null;
  message: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  reactions: GroupchatReaction[];
  status?: 'PENDING' | 'SENT' | 'READ' | undefined;
  isDeleted: boolean;
}
