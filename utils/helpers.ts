import { Reaction } from '@/types/chat-socket';
import { GetSinglePhotoResponse } from '@/types/slices/search';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const generateSimilarQuery = (photo: GetSinglePhotoResponse) => {
  const tagTitles = photo.tags.map((tag) => tag.title).join(' ');

  const description = photo.description || '';
  const altDescription = photo.alt_description || '';

  const baseQuery = `${tagTitles} ${description} ${altDescription}`;

  return baseQuery;
};

const generateId = (base: string = ''): string => {
  const cleanBase = base.replace(/\s+/g, '').toLowerCase().substring(0, 3);
  const randomStr = Math.random()
    .toString(36)
    .substring(2, 10 - cleanBase.length);
  return `${cleanBase}${randomStr}`;
};

type FormatDateOptions = {
  dateOnly?: boolean;
  timeOnly?: boolean;
};

function formatDate(date: Date, options: FormatDateOptions = {}): string {
  const { dateOnly, timeOnly } = options;

  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (dateOnly) {
    return datePart;
  }

  if (timeOnly) {
    return timePart;
  }

  return `${datePart} at ${timePart}`;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const minFutureDate = new Date();
minFutureDate.setDate(today.getDate() + 1);

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};
function formatChatTime(dateStr: string, useChatStyle = false): string {
  const date = new Date(dateStr);

  if (!useChatStyle) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
}

const groupReactions = (reactions: Reaction[]) => {
  const grouped = reactions.reduce(
    (acc, reaction) => {
      const emoji = reaction.reaction;
      if (!acc[emoji]) {
        acc[emoji] = {
          emoji,
          count: 0,
          userIds: [],
          reactionIds: [],
        };
      }
      acc[emoji].count++;
      acc[emoji].userIds.push(reaction.userId);
      acc[emoji].reactionIds.push(reaction.id);
      return acc;
    },
    {} as Record<string, { emoji: string; count: number; userIds: number[]; reactionIds: number[] }>
  );

  return Object.values(grouped);
};

const convertToBase64 = async (imageUri: string) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 800 } }], // Resize to reasonable width
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  const file = new FileSystem.File(manipResult.uri);
  const base64 = await file.base64();
  return base64;
};

export const helpers = {
  generateSimilarQuery,
  generateId,
  formatDate,
  today,
  tomorrow,
  minFutureDate,
  isFetchBaseQueryError,
  formatChatTime,
  groupReactions,
  convertToBase64,
};
