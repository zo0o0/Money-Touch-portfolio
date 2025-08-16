import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { API } from '../../apis/axios';
import type {
  FeedListResultDTO,
  ApiResponse,
  SortType,
  FeedRequestParams,
} from '../../types/feed/feed';

interface PageParam {
  cursorId: number | null;
  cursorViewCount: number | null;
}

const fetchFeedPosts = async (
  sortType: SortType,
  pageParam: PageParam,
): Promise<FeedListResultDTO> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token');

  const params: FeedRequestParams = {
    sortType,
    ...(pageParam.cursorId !== null ? { cursorId: pageParam.cursorId } : {}),
    ...(sortType === 'POPULAR' && pageParam.cursorViewCount !== null
      ? { cursorViewCount: pageParam.cursorViewCount }
      : {}),
  };

  const res = await API.get<ApiResponse<FeedListResultDTO>>('/api/feed/home', {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.result;
};

export const useFeedPosts = (sortType: SortType) => {
  return useInfiniteQuery<
    FeedListResultDTO,
    Error,
    InfiniteData<FeedListResultDTO>,
    [string, SortType],
    PageParam
  >({
    queryKey: ['feed', sortType],
    initialPageParam: { cursorId: null, cursorViewCount: null },
    queryFn: async ({ queryKey, pageParam }) => {
      const [, sortTypeFromKey] = queryKey;
      return fetchFeedPosts(sortTypeFromKey, pageParam);
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? {
            cursorId: lastPage.nextCursorId,
            cursorViewCount: lastPage.nextCursorViewCount ?? null,
          }
        : undefined,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
