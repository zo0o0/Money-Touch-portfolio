import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../apis/axios';
import type { CommentCreateDTO } from '../../types/feed/feedDetail';

const postComment = async (
  consumptionRecordId: number,
  body: CommentCreateDTO,
) => {
  if (
    consumptionRecordId === undefined ||
    consumptionRecordId === null ||
    Number.isNaN(consumptionRecordId)
  ) {
    throw new Error('Invalid consumptionRecordId');
  }

  const token = localStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const payload: Record<string, unknown> = { content: body.content };
  if (typeof body.parentId === 'number') {
    payload.parentId = body.parentId;
  }

  const url = `/api/feed/${consumptionRecordId}/comment`;
  const { data } = await API.post(url, payload, { headers });
  return data;
};

export const useCreateComment = (consumptionRecordId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CommentCreateDTO) =>
      postComment(consumptionRecordId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedComments', consumptionRecordId] });
      qc.invalidateQueries({ queryKey: ['feedDetail', consumptionRecordId] });
    },
  });
};
