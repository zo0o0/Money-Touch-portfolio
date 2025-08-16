import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import { API } from '../../apis/axios';

type InitialState = { liked: boolean; likeCount: number };
type Options = { invalidateKeys?: QueryKey[] };

const toggleCommentLike = async (commentId: number) => {
  const token = localStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const { data } = await API.post(`/api/feed/comment/${commentId}/like`, null, {
    headers,
  });
  return data?.result as {
    commentId: number;
    likeCount: number;
    liked: boolean;
  };
};

export const useCommentLike = (
  commentId: number,
  initial: InitialState,
  options?: Options,
) => {
  const qc = useQueryClient();
  const [liked, setLiked] = useState<boolean>(initial.liked);
  const [likeCount, setLikeCount] = useState<number>(initial.likeCount);

  useEffect(() => {
    setLiked(initial.liked);
    setLikeCount(initial.likeCount);
  }, [initial.liked, initial.likeCount]);

  const { mutate: toggleLike, isPending: isLiking } = useMutation({
    mutationFn: () => toggleCommentLike(commentId),
    onMutate: async () => {
      const prev = { liked, likeCount };
      setLiked((v) => !v);
      setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
      return prev;
    },
    onError: (_err, _vars, context) => {
      if (context) {
        setLiked(context.liked);
        setLikeCount(context.likeCount);
      }
    },
    onSuccess: (res) => {
      setLiked(res.liked);
      setLikeCount(res.likeCount);
      options?.invalidateKeys?.forEach((key) =>
        qc.invalidateQueries({ queryKey: key }),
      );
    },
  });

  return { liked, likeCount, isLiking, toggleLike };
};
