import { NewMessage } from '../chat-socket';

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
