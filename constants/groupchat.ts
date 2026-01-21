import { Ionicons } from '@expo/vector-icons';

enum ActionType {
  AudioCall = 'audio-call',
  VideoCall = 'video-call',
  AddContact = 'add-contact',
  Search = 'search',
}

export type ActionButton = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  size: number;
  action: ActionType;
};

export const actionButtons: ActionButton[] = [
  {
    icon: 'call-outline',
    label: 'Audio',
    size: 24,
    action: ActionType.AudioCall,
  },
  {
    icon: 'videocam-outline',
    label: 'Video',
    size: 24,
    action: ActionType.VideoCall,
  },
  {
    icon: 'person-add-outline',
    label: 'Add',
    size: 23,
    action: ActionType.AddContact,
  },
  {
    icon: 'search-outline',
    label: 'Search',
    size: 24,
    action: ActionType.Search,
  },
];

enum UserActionType {
  AudioCall = 'audio-call',
  VideoCall = 'video-call',
  Message = 'message',
}

export type UserActionButton = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  size: number;
  action: UserActionType;
};

export const userActionButtons: UserActionButton[] = [
  {
    icon: 'chatbubble-outline',
    label: 'Message',
    size: 23,
    action: UserActionType.Message,
  },
  {
    icon: 'call-outline',
    label: 'Audio',
    size: 24,
    action: UserActionType.AudioCall,
  },
  {
    icon: 'videocam-outline',
    label: 'Video',
    size: 24,
    action: UserActionType.VideoCall,
  },
];
