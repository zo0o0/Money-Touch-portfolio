// Feed Detail
export interface UserInfo {
  userId: number;
  nickname: string;
  profileImgUrl: string;
}

export interface CategoryInfo {
  categoryId: number;
  budgetCategoryName: string;
}

export type MyReactionType = 'WISE' | 'WASTE' | 'NONE' | null;

export interface FeedDetailResultDTO {
  consumptionRecordId: number;
  user: UserInfo;
  consumptionCategory: CategoryInfo;
  amount: number;
  content: string;
  imageUrls: string[];
  memo: string;
  createdAt: string;
  wiseCount: number;
  wasteCount: number;
  commentCount: number;
  viewCount: number;
  myReaction: MyReactionType;
}

export interface ApiResponseFeedDetailResultDTO {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FeedDetailResultDTO;
}

// Comment
export interface CommentListDTO {
  commentId: number;
  userId: number;
  nickname: string;
  profileImgUrl: string;
  content: string;
  likes: number;
  liked: boolean;
  createdAt: string;
  replies: CommentListDTO[];
}

export interface ApiResponseListCommentListDTO {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CommentListDTO[];
}

export interface CommentCreateDTO {
  parentId?: number;
  content: string;
}
