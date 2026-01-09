export interface SearchParams {
  query: string;
  page: number;
  per_page?: number;
  orientation?: 'landscape' | 'portrait' | 'squarish';
  content_filter?: 'low' | 'high';
  order_by?: 'latest' | 'relevant';
}

export interface SearchResponse {
  data: Data;
}

interface Alternative_slugs {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
  id: string;
}

interface Links {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

interface Topic_submissions {}

interface Profile_image {
  small: string;
  medium: string;
  large: string;
}

interface Social {
  instagram_username: string;
  portfolio_url: string;
  twitter_username: string;
  paypal_email: any;
}

export interface User {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: string;
  portfolio_url: string;
  bio: string;
  location: string;
  links: Links;
  profile_image: Profile_image;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: Social;
}

export interface SearchResult {
  id: string;
  slug: string;
  alternative_slugs: Alternative_slugs;
  created_at: string;
  updated_at: string;
  promoted_at: any;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string;
  alt_description: string;
  breadcrumbs: any[];
  urls: Urls;
  links: Links;
  likes: number;
  liked_by_user: boolean;
  bookmarked: boolean;
  current_user_collections: any[];
  sponsorship: any;
  topic_submissions: Topic_submissions;
  asset_type: string;
  user: User;
}

interface Data {
  total: number;
  total_pages: number;
  results: SearchResult[];
}

export interface ExploreData {
  id: string;
  slug: string;
  alternative_slugs: Alternative_slugs;
  created_at: string;
  updated_at: string;
  promoted_at: any | string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: any | string;
  alt_description: string;
  breadcrumbs: any[];
  urls: Urls;
  links: Links;
  likes: number;
  liked_by_user: boolean;
  bookmarked: boolean;
  current_user_collections: any[];
  sponsorship: Sponsorship | any;
  topic_submissions: Topic_submissions;
  asset_type: string;
  user: User;
}

interface Alternative_slugs {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
  id: string;
}

export interface Urls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}

interface Links {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

interface Profile_image {
  small: string;
  medium: string;
  large: string;
}

interface ExploreSocial {
  instagram_username: string;
  portfolio_url: string;
  twitter_username: any;
  paypal_email: any;
}

interface Sponsor {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: any;
  twitter_username: any;
  portfolio_url: string;
  bio: string;
  location: any;
  links: Links;
  profile_image: Profile_image;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: Social;
}

interface Sponsorship {
  impression_urls: any[];
  tagline: string;
  tagline_url: string;
  sponsor: Sponsor;
}

interface Topic_submissions {}

interface ExploreUser {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: any;
  twitter_username: any;
  portfolio_url: string;
  bio: string;
  location: any;
  links: Links;
  profile_image: Profile_image;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: Social;
}

export interface GetSinglePhotoResponse {
  id: string;
  slug: string;
  alternative_slugs: Alternative_slugs;
  created_at: string;
  updated_at: string;
  promoted_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string;
  alt_description: string;
  breadcrumbs: any[];
  urls: Urls;
  links: Links;
  likes: number;
  liked_by_user: boolean;
  bookmarked: boolean;
  current_user_collections: any[];
  sponsorship: any;
  topic_submissions: Topic_submissions;
  asset_type: string;
  user: SingleUser;
  exif: Exif;
  location: Location;
  meta: Meta;
  public_domain: boolean;
  tags: Tag[];
  views: number;
  downloads: number;
  topics: Topic[];
  related_collections: Related_collections;
}

interface Alternative_slugs {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
  id: string;
}

interface Links {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

interface People {
  status: string;
  approved_on: string;
}

interface Topic_submissions {
  people: People;
}

interface Profile_image {
  small: string;
  medium: string;
  large: string;
}

interface SingleSocial {
  instagram_username: string;
  portfolio_url: string;
  twitter_username: any;
  paypal_email: any;
}

interface SingleUser {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: any;
  portfolio_url: string;
  bio: any;
  location: string;
  links: Links;
  profile_image: Profile_image;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: SingleSocial;
}

interface Exif {
  make: string;
  model: string;
  name: string;
  exposure_time: string;
  aperture: string;
  focal_length: string;
  iso: number;
}

interface Position {
  latitude: number;
  longitude: number;
}

interface Location {
  name: string;
  city: string;
  country: string;
  position: Position;
}

interface Meta {
  index: boolean;
}

interface Tag {
  type: string;
  title: string;
}

interface Topic {
  id: string;
  title: string;
  slug: string;
  visibility: string;
}

interface Cover_photo {
  id: string;
  slug: string;
  alternative_slugs: Alternative_slugs;
  created_at: string;
  updated_at: string;
  promoted_at: any;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: any;
  alt_description: string;
  breadcrumbs: any[];
  urls: Urls;
  links: Links;
  likes: number;
  liked_by_user: boolean;
  bookmarked: boolean;
  current_user_collections: any[];
  sponsorship: any;
  topic_submissions: Topic_submissions;
  asset_type: string;
  user: User;
}

interface Preview_photo {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  blur_hash: string;
  asset_type: string;
  urls: Urls;
}

interface Result {
  id: string;
  title: string;
  description: any;
  published_at: string;
  last_collected_at: string;
  updated_at: string;
  featured: boolean;
  total_photos: number;
  private: boolean;
  share_key: string;
  links: Links;
  user: User;
  cover_photo: Cover_photo;
  preview_photos: Preview_photo[];
}

interface Related_collections {
  total: number;
  type: string;
  results: Result[];
}
