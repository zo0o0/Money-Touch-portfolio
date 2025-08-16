import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../../apis/axios';
import type {
  ApiResponseMyBadgeListResultDTO,
  ApiResponseRepresentativeBadgeResultDTO,
  BadgeDTO,
} from '../../../types/auth/mypage/mybadge';

export const useMyBadgesQuery = () => {
  return useQuery<BadgeDTO[]>({
    queryKey: ['myBadges'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const res = await API.get<ApiResponseMyBadgeListResultDTO>(
        '/api/badge/my',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.result.badges;
    },
    staleTime: 1000 * 60,
  });
};

export const useRepresentativeBadgeQuery = () => {
  return useQuery({
    queryKey: ['representativeBadge'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const res = await API.get<ApiResponseRepresentativeBadgeResultDTO>(
        '/api/badge/representative-badge',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.result;
    },
    staleTime: 1000 * 60,
  });
};

export const useSetRepresentativeBadgeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (badgeId: number) => {
      const token = localStorage.getItem('accessToken');
      const res = await API.patch<ApiResponseRepresentativeBadgeResultDTO>(
        `/api/badge/representative-badge/${badgeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['representativeBadge'] });
    },
  });
};
