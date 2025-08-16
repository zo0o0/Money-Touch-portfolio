import type { QueryKey } from '@tanstack/react-query';
import type { MyReactionType } from './feedDetail';

export type ReactionType = 'WISE' | 'WASTE';

export type UIReaction = Exclude<MyReactionType, 'NONE'>;

export interface ReactionState {
  wiseCount: number;
  wasteCount: number;
  myReaction: UIReaction;
}

export interface ApiResponseReactionDTO {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    consumptionRecordId: number;
    wiseCount: number;
    wasteCount: number;
    myReaction: MyReactionType;
  };
}

export interface UseReactionOptions {
  invalidateKeys?: ReadonlyArray<QueryKey>;
  listQueryKeys?: ReadonlyArray<QueryKey>;
  debounceMs?: number;
}

export interface FeedListItem {
  consumptionRecordId: number;
  wiseCount: number;
  wasteCount: number;
  myReaction: MyReactionType;
}

export interface PageResult {
  result?: {
    items?: FeedListItem[];
  };
}

export interface ItemsContainer {
  items?: FeedListItem[];
}

export interface InfiniteDataShape<TPage> {
  pages: TPage[];
  pageParams: unknown[];
}
