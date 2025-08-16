import { useQuery } from '@tanstack/react-query';
import { API } from '../../apis/axios';
import type { ApiResponseListCommentListDTO } from '../../types/feed/feedDetail';

const fetchFeedComments = async (consumptionRecordId: number) => {
  const token = localStorage.getItem('accessToken');
  const { data } = await API.get<ApiResponseListCommentListDTO>(
    `/api/feed/${consumptionRecordId}/comments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data.result;
};

export const useFeedComments = (consumptionRecordId: number) => {
  return useQuery({
    queryKey: ['feedComments', consumptionRecordId],
    queryFn: () => fetchFeedComments(consumptionRecordId),
    enabled: !!consumptionRecordId,
  });
};
