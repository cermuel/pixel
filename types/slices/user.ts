import { GroupchatMessage, NewMessage } from '../chat-socket';

export interface ProfileResponse {
  message: string;
  data: Data;
}

interface Organization {
  id: number;
  phone: string;
  email: string;
  code: string;
  name: string;
  color: string;
  maxUsers: number;
  address: string;
  isKycRequired: boolean;
  isPaymentRequired: boolean;
  regFee: number;
  logo: string | null;
  createdAt: string;
}

interface Member {
  userId: number;
  organizationId: number;
  memberId: number;
  role: string[];
  walletBalance: number;
  savingsBalance: number;
  status: string;
  kycStatus: string;
  createdAt: string;
  organization: Organization;
}

interface Data {
  0: Member;
  id: number;
  phone: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: string;
}
export interface ChatResponse {
  message: string;
  data: ChatData[];
}

interface Receiver {
  id: number;
  phone: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: string;
}

export interface ChatData {
  id: number;
  senderId: number;
  receiverId: number;
  createdAt: string;
  receiver: Receiver;
  sender: Receiver;
  messages: NewMessage[];
  isTyping?: boolean;
  typingUser?: string;
}

export interface UserResponse {
  message: string;
  data: UserData[];
}

export interface UserData {
  id: number;
  phone: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: string;
  sentChats: { id: number; senderId: number; receiverId: number; createdAt: string }[];
  receivedChats: { id: number; senderId: number; receiverId: number; createdAt: string }[];
}

export interface CreateGroupchatPayload {
  name: string;
  description?: string;
  members: { userId: number; isAdmin: boolean }[];
}

export interface CreateGroupResponse {
  message: string;
  data: CreateGroupData;
}

interface User {
  name: string;
  id: number;
  phone: string;
  email: string;
}

export interface GroupMember {
  id: number;
  isAdmin: boolean;
  userId: number;
  groupchatId: number;
  user: User;
}

interface CreateGroupData {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  groupMembers: GroupMember[];
}

export interface GetGroupResponse {
  message: string;
  data: GroupData;
}

export interface GetSingleGroupResponse {
  message: string;
  data: Groupchat;
}

interface GroupData {
  groupchats: Groupchat[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface Groupchat {
  id: number;
  name: string;
  photo: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  _count: {
    groupMembers: number;
  };
  groupMembers: GroupMember[];
  messages: GroupchatMessage[];

  isTyping?: boolean;
  typingUser?: string;
}
