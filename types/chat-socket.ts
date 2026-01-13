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
