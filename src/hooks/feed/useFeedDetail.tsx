import { useQuery } from '@tanstack/react-query';
import { API } from '../../apis/axios';
import type { ApiResponseFeedDetailResultDTO } from '../../types/feed/feedDetail';

const fetchFeedDetail = async (consumptionRecordId: number) => {
  const token = localStorage.getItem('accessToken');
  const { data } = await API.get<ApiResponseFeedDetailResultDTO>(
    `/api/feed/${consumptionRecordId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data.result;
};

export const useFeedDetail = (consumptionRecordId: number) => {
  return useQuery({
    queryKey: ['feedDetail', consumptionRecordId],
    queryFn: () => fetchFeedDetail(consumptionRecordId),
    enabled: !!consumptionRecordId,
  });
};
