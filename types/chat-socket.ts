export interface NewMessage {
  id: number;
  chatId: number;
  senderId: number;
  replyToId: number | null;
  message: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  reactions: string[];
  status?: 'PENDING' | 'SENT' | 'READ' | undefined;
}
