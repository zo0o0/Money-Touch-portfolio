import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as S from '../../styles/feed/feedDetail.style';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import CommentInput from '../../components/feed/feedDetail/CommentInput';
import CommentItem from '../../components/feed/feedDetail/CommentItem';
import DetailPostItem from '../../components/feed/feedDetail/DetailPostItem';
import { useFeedDetail } from '../../hooks/feed/useFeedDetail';
import { useFeedComments } from '../../hooks/feed/useFeedComments';
import { useCreateComment } from '../../hooks/feed/useCreateComment';
import { useReaction } from '../../hooks/feed/useReaction';
import type { MyReactionType } from '../../types/feed/feedDetail';

export const FeedDetail: React.FC = () => {
  const { postId } = useParams();
  const consumptionRecordId = Number(postId);

  const { data } = useFeedDetail(consumptionRecordId);
  const { data: comments } = useFeedComments(consumptionRecordId);
  const { mutate: createComment, isPending } =
    useCreateComment(consumptionRecordId);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [mentionName, setMentionName] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const reaction = useReaction(
    consumptionRecordId,
    {
      wiseCount: data?.wiseCount ?? 0,
      wasteCount: data?.wasteCount ?? 0,
      myReaction: (data?.myReaction as Exclude<MyReactionType, 'NONE'>) ?? null,
    },
    {
      invalidateKeys: [
        ['feed', 'POPULAR'],
        ['feed', 'RECENT'],
        ['feedDetail', consumptionRecordId],
      ],
    },
  );

  const { setFromServer } = reaction;

  const wise = data?.wiseCount;
  const waste = data?.wasteCount;
  const mine = data?.myReaction;

  useEffect(() => {
    if (wise === undefined || waste === undefined || mine === undefined) return;
    const normalize = (v: MyReactionType) => (v === 'NONE' ? null : v);
    setFromServer({
      wiseCount: wise,
      wasteCount: waste,
      myReaction: normalize(mine),
    });
  }, [wise, waste, mine, setFromServer]);

  const handleComment = (mention?: string, parentId?: number) => {
    setIsReplying(true);
    setMentionName(mention || null);
    setSelectedParentId(parentId ?? null);
    setReplyText('');
  };

  const closeReplyInput = () => {
    setIsReplying(false);
    setReplyText('');
    setMentionName(null);
    setSelectedParentId(null);
  };

  const handleSubmitComment = () => {
    const content = replyText.trim();
    if (!content) return;
    createComment(
      { parentId: selectedParentId ?? undefined, content },
      { onSuccess: closeReplyInput },
    );
  };

  const onReplyTo = (parentId: number) => (mention: string) => {
    handleComment(mention, parentId);
  };

  if (!data)
    return <div className="text-center p-10">게시글을 찾을 수 없습니다.</div>;

  const categoryName = data.consumptionCategory?.budgetCategoryName ?? '';

  return (
    <>
      <div className={S.container}>
        <Header title={categoryName} />
        <div className={S.contentContainer}>
          <DetailPostItem
            data={data}
            wiseCount={reaction.wiseCount}
            wasteCount={reaction.wasteCount}
            myReaction={reaction.myReaction}
            isReacting={reaction.isReacting}
            onReactWise={reaction.reactWise}
            onReactWaste={reaction.reactWaste}
            onComment={() => handleComment()}
          />
        </div>

        <div className={S.divider} />

        {comments && comments.length > 0 && (
          <div className={S.commentContainer}>
            {comments.map((c) => (
              <div key={c.commentId} style={{ marginBottom: '1.2rem' }}>
                <CommentItem
                  comment={c}
                  onReply={onReplyTo(c.commentId)}
                  invalidateKeys={[['feed', 'comments', consumptionRecordId]]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {isReplying && (
        <CommentInput
          mentionName={mentionName}
          replyText={replyText}
          onChange={setReplyText}
          onSubmit={handleSubmitComment}
          onClose={closeReplyInput}
          isSubmitting={isPending}
          maxLength={300}
        />
      )}
      {!isReplying && (
        <>
          <div className={S.footerMargin} />
          <Footer />
        </>
      )}
    </>
  );
};

export default FeedDetail;
