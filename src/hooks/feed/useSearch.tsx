import { useInfiniteQuery } from '@tanstack/react-query';
import { API } from '../../apis/axios';
import type {
  FeedListResultDTO,
  ApiResponse,
  PageParam,
  InfiniteQueryDataWithFlatList,
} from '../../types/feed/feed';

async function fetchSearchFeed(params: {
  keyword: string;
  cursorId: number | null;
}) {
  const { keyword, cursorId } = params;

  const token = localStorage.getItem('accessToken');

  if (!token) throw new Error('No access token');

  try {
    const res = await API.get<ApiResponse<FeedListResultDTO>>(
      '/api/feed/search',
      {
        params: {
          keyword,
          cursorId: cursorId ?? undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.data.isSuccess) {
      throw new Error(res.data.message || '검색 요청 실패');
    }

    return res.data.result;
  } catch (error) {
    console.error('검색 API 오류:', error);
    throw error;
  }
}

export function useSearch(keyword: string) {
  const query = useInfiniteQuery({
    queryKey: ['feed', 'search', keyword],
    enabled: keyword.trim().length > 0,
    initialPageParam: { cursorId: null } as PageParam,
    queryFn: ({ pageParam }) =>
      fetchSearchFeed({
        keyword,
        cursorId: (pageParam as PageParam)?.cursorId ?? null,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? ({
            cursorId: lastPage.nextCursorId,
          } as PageParam)
        : undefined,
    select: (data): InfiniteQueryDataWithFlatList => {
      const items = data.pages.flatMap((p) => p.feedList);
      return { ...data, flatList: items };
    },
  });

  return {
    ...query,
    pages: query.data?.pages ?? [],
    flatList: query.data?.flatList ?? [],
  };
}
