import { useMemo, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API } from '../../apis/axios';
import type {
  FeedDetailResultDTO,
  MyReactionType,
} from '../../types/feed/feedDetail';
import type { FeedItem } from '../../types/feed/feed';
import type {
  ApiResponseReactionDTO,
  ReactionState,
  ReactionType,
  UseReactionOptions,
  FeedListItem,
  PageResult,
  ItemsContainer,
  InfiniteDataShape,
} from '../../types/feed/reaction';

const normalize = (v: MyReactionType) => (v === 'NONE' ? null : v);

const computeNext = (
  prev: ReactionState,
  clicked: ReactionType,
): ReactionState => {
  const { wiseCount, wasteCount, myReaction } = prev;
  if (clicked === 'WISE') {
    if (myReaction === 'WISE')
      return {
        wiseCount: Math.max(0, wiseCount - 1),
        wasteCount,
        myReaction: null,
      };
    if (myReaction === 'WASTE')
      return {
        wiseCount: wiseCount + 1,
        wasteCount: Math.max(0, wasteCount - 1),
        myReaction: 'WISE',
      };
    return { wiseCount: wiseCount + 1, wasteCount, myReaction: 'WISE' };
  } else {
    if (myReaction === 'WASTE')
      return {
        wiseCount,
        wasteCount: Math.max(0, wasteCount - 1),
        myReaction: null,
      };
    if (myReaction === 'WISE')
      return {
        wiseCount: Math.max(0, wiseCount - 1),
        wasteCount: wasteCount + 1,
        myReaction: 'WASTE',
      };
    return { wiseCount, wasteCount: wasteCount + 1, myReaction: 'WASTE' };
  }
};

function isFeedDetailDTO(x: unknown): x is FeedDetailResultDTO {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.wiseCount === 'number' &&
    typeof o.wasteCount === 'number' &&
    (o.myReaction === 'NONE' ||
      o.myReaction === 'WISE' ||
      o.myReaction === 'WASTE' ||
      o.myReaction === null)
  );
}

function isFeedListItem(x: unknown): x is FeedListItem {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.consumptionRecordId === 'number' &&
    typeof o.wiseCount === 'number' &&
    typeof o.wasteCount === 'number' &&
    (o.myReaction === 'NONE' ||
      o.myReaction === 'WISE' ||
      o.myReaction === 'WASTE' ||
      o.myReaction === null)
  );
}

function isItemsContainer(x: unknown): x is ItemsContainer {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  if (!('items' in o)) return false;
  const items = o.items as unknown;
  return Array.isArray(items) ? items.every(isFeedListItem) : false;
}

function isPageResult(x: unknown): x is PageResult {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  const r = o.result as unknown;
  if (!r || typeof r !== 'object') return false;
  const items = (r as Record<string, unknown>).items as unknown;
  return Array.isArray(items) ? items.every(isFeedListItem) : false;
}

function isInfiniteData<TPage>(
  x: unknown,
  guard: (p: unknown) => p is TPage,
): x is InfiniteDataShape<TPage> {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  if (!Array.isArray(o.pages) || !Array.isArray(o.pageParams)) return false;
  return (o.pages as unknown[]).every(guard);
}

function isFeedItem(x: unknown): x is FeedItem {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.consumptionRecordId === 'number' &&
    typeof o.wiseCount === 'number' &&
    typeof o.wasteCount === 'number'
  );
}

function isFeedPageWithFeedList(x: unknown): x is { feedList: FeedItem[] } {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return Array.isArray(o.feedList) && o.feedList.every(isFeedItem);
}

function isInfiniteWithFeedList(
  x: unknown,
): x is { pages: Array<{ feedList: FeedItem[] }>; pageParams: unknown[] } {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    Array.isArray(o.pages) &&
    Array.isArray(o.pageParams) &&
    (o.pages as unknown[]).every(isFeedPageWithFeedList)
  );
}

export function useReaction(
  consumptionRecordId: number,
  initial?: Partial<ReactionState>,
  options?: UseReactionOptions,
) {
  const qc = useQueryClient();

  const [state, setState] = useState<ReactionState>({
    wiseCount: initial?.wiseCount ?? 0,
    wasteCount: initial?.wasteCount ?? 0,
    myReaction: initial?.myReaction ?? null,
  });
  const [isReacting, setIsReacting] = useState(false);

  const listQueryKeys = useMemo(
    () =>
      options?.listQueryKeys ?? [
        ['feed', 'POPULAR'],
        ['feed', 'RECENT'],
      ],
    [options?.listQueryKeys],
  );
  const invalidateKeys = useMemo(
    () => options?.invalidateKeys ?? [],
    [options?.invalidateKeys],
  );
  const debounceMs = options?.debounceMs ?? 200;

  const controllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingClickRef = useRef<ReactionType | null>(null);

  const patchFeedDetailCache = useCallback(
    (next: ApiResponseReactionDTO['result']) => {
      qc.setQueryData(['feedDetail', consumptionRecordId], (prev: unknown) => {
        if (!isFeedDetailDTO(prev)) return prev;
        const merged: FeedDetailResultDTO = {
          ...prev,
          wiseCount: next.wiseCount,
          wasteCount: next.wasteCount,
          myReaction: next.myReaction,
        };
        return merged;
      });
    },
    [qc, consumptionRecordId],
  );

  const patchListCaches = useCallback(
    (next: ApiResponseReactionDTO['result']) => {
      for (const key of listQueryKeys) {
        qc.setQueryData(key, (prev: unknown) => {
          if (isInfiniteWithFeedList(prev)) {
            const pages = prev.pages.map((pg) => ({
              ...pg,
              feedList: pg.feedList.map((it) =>
                it.consumptionRecordId === next.consumptionRecordId
                  ? {
                      ...it,
                      wiseCount: next.wiseCount,
                      wasteCount: next.wasteCount,
                      myReaction: next.myReaction,
                    }
                  : it,
              ),
            }));
            return { ...prev, pages };
          }
          if (isInfiniteData<PageResult>(prev, isPageResult)) {
            const pages = prev.pages.map((pg) => {
              const before = pg.result?.items ?? [];
              const items = before.map((it) =>
                it.consumptionRecordId === next.consumptionRecordId
                  ? {
                      ...it,
                      wiseCount: next.wiseCount,
                      wasteCount: next.wasteCount,
                      myReaction: next.myReaction,
                    }
                  : it,
              );
              return { ...pg, result: { ...(pg.result ?? {}), items } };
            });
            return { ...prev, pages };
          }
          if (isItemsContainer(prev)) {
            const items = (prev.items ?? []).map((it) =>
              it.consumptionRecordId === next.consumptionRecordId
                ? {
                    ...it,
                    wiseCount: next.wiseCount,
                    wasteCount: next.wasteCount,
                    myReaction: next.myReaction,
                  }
                : it,
            );
            return { ...prev, items };
          }
          if (Array.isArray(prev) && prev.every(isFeedListItem)) {
            return prev.map((it) =>
              it.consumptionRecordId === next.consumptionRecordId
                ? {
                    ...it,
                    wiseCount: next.wiseCount,
                    wasteCount: next.wasteCount,
                    myReaction: next.myReaction,
                  }
                : it,
            );
          }
          return prev;
        });
      }
    },
    [qc, listQueryKeys],
  );

  const flushSend = useCallback(async () => {
    const click = pendingClickRef.current;
    pendingClickRef.current = null;
    if (!click) return;

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsReacting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const { data } = await API.post<ApiResponseReactionDTO>(
        `/api/feed/${consumptionRecordId}/reaction`,
        { type: click },
        {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const next = data.result;
      setState({
        wiseCount: next.wiseCount,
        wasteCount: next.wasteCount,
        myReaction: normalize(next.myReaction),
      });
      patchFeedDetailCache(next);
      patchListCaches(next);
      if (invalidateKeys.length) {
        for (const key of invalidateKeys)
          qc.invalidateQueries({ queryKey: key });
      }
    } finally {
      setIsReacting(false);
    }
  }, [
    consumptionRecordId,
    invalidateKeys,
    patchFeedDetailCache,
    patchListCaches,
    qc,
  ]);

  const scheduleSend = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(flushSend, debounceMs);
  }, [flushSend, debounceMs]);

  const react = useCallback(
    (clicked: ReactionType) => {
      setState((p) => computeNext(p, clicked));
      pendingClickRef.current = clicked;
      scheduleSend();
    },
    [scheduleSend],
  );

  const reactWise = useCallback(() => {
    react('WISE');
  }, [react]);

  const reactWaste = useCallback(() => {
    react('WASTE');
  }, [react]);

  const setFromServer = useCallback((next: Partial<ReactionState>) => {
    setState((prev) => {
      const wise = next.wiseCount ?? prev.wiseCount;
      const waste = next.wasteCount ?? prev.wasteCount;
      const mine = next.myReaction ?? prev.myReaction;
      if (
        wise === prev.wiseCount &&
        waste === prev.wasteCount &&
        mine === prev.myReaction
      )
        return prev;
      return { wiseCount: wise, wasteCount: waste, myReaction: mine };
    });
  }, []);

  return useMemo(
    () => ({
      wiseCount: state.wiseCount,
      wasteCount: state.wasteCount,
      myReaction: state.myReaction,
      isReacting,
      reactWise,
      reactWaste,
      setFromServer,
    }),
    [
      state.wiseCount,
      state.wasteCount,
      state.myReaction,
      isReacting,
      reactWise,
      reactWaste,
      setFromServer,
    ],
  );
}
