export interface RepresentativeBadgeResultDTO {
  badgeId: number;
  badgeName: string;
  badgeImageUrl: string;
  badgeDescription: string;
}

export interface ApiResponseRepresentativeBadgeResultDTO {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RepresentativeBadgeResultDTO;
}

export interface BadgeDTO {
  badgeId: number;
  name: string;
  imageUrl: string;
  description: string;
}

export interface MyBadgeListResultDTO {
  badges: BadgeDTO[];
}

export interface ApiResponseMyBadgeListResultDTO {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyBadgeListResultDTO;
}
