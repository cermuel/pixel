import { Urls, User } from '../slices/search';

export interface BookmarkItem {
  id: string;
  urls: Urls;
  user: Partial<User>;
  collection_id?: string;
  width: number;
  height: number;
}

export interface Collection {
  id: string;
  title: string;
  items: BookmarkItem[];
}
