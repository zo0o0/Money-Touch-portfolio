export interface Author {
  name: string;
  profileImage?: string;
}

export interface Post {
  id: number;
  author: Author;
  image?: string;
  likes: number;
  dislikes: number;
  timestamp: Date;
  category?: string;
  companyName?: string;
  price?: number;
  content?: string;
  comments?: Comment[];
}

export type SortType = 'RECENT' | 'POPULAR';

export interface FeedUser {
  userId: number;
  nickname: string;
  profileImgUrl?: string;
}

export interface FeedItem {
  consumptionRecordId: number;
  user: FeedUser;
  imageUrls: string[];
  createdAt: string;
  wiseCount: number;
  wasteCount: number;
  viewCount: number;
  myReaction: ReactionType;
}

export interface FeedListResultDTO {
  feedList: FeedItem[];
  isFirst: boolean;
  hasNext: boolean;
  nextCursorId: number | null;
  nextCursorViewCount?: number | null;
  feedListSize: number;
}

export interface FeedRequestParams {
  sortType: 'RECENT' | 'POPULAR';
  cursorId?: number | null;
  cursorViewCount?: number | null;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

//COMMENT
export interface Comment {
  id: number;
  author: Author;
  content: string;
  timestamp: Date;
  replies?: Comment[];
}

export type SortBy = 'popular' | 'latest';

export interface PostStates {
  [key: number]: {
    liked: boolean;
    disliked: boolean;
  };
}

// Search 관련
export type PageParam = { cursorId: number | null };

export type InfiniteQueryDataWithFlatList = {
  pages: FeedListResultDTO[];
  pageParams: PageParam[];
  flatList: FeedItem[];
};
/////////////

// useReaction.tsx
export type ReactionType = 'WISE' | 'WASTE';

export type MyReaction = ReactionType | null;

export interface ReactionState {
  wiseCount: number;
  wasteCount: number;
  myReaction: MyReaction;
}

export interface ReactionAPIResult {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ReactionResultDTO;
}

export interface ReactionResultDTO {
  consumptionRecordId: number;
  wiseCount: number;
  wasteCount: number;
  myReaction: MyReaction;
}

export interface UseReactionOptions {
  invalidateKeys?: unknown[][];
}
/////////////
