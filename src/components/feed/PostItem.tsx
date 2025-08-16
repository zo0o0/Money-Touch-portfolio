import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LikeIcon from '../../assets/images/feed/Like.png';
import LikeIconFill from '../../assets/images/feed/Like_Fill.png';
import DislikeIcon from '../../assets/images/feed/Dislike.png';
import DislikeIconFill from '../../assets/images/feed/Dislike_Fill.png';
import type { FeedItem } from '../../types/feed/feed';
import { useReaction } from '../../hooks/feed/useReaction';

type Props = { post: FeedItem };

function ReactionBar({
  id,
  wiseCount,
  wasteCount,
  myReaction,
}: {
  id: number;
  wiseCount: number;
  wasteCount: number;
  myReaction: 'WISE' | 'WASTE' | null;
}) {
  const {
    wiseCount: w,
    wasteCount: wa,
    myReaction: mine,
    isReacting,
    reactWise,
    reactWaste,
  } = useReaction(
    id,
    { wiseCount, wasteCount, myReaction },
    {
      invalidateKeys: [
        ['feed', 'POPULAR'],
        ['feed', 'RECENT'],
        ['feedDetail', id],
      ],
    },
  );

  const onLike = useCallback(() => {
    if (!isReacting) reactWise();
  }, [isReacting, reactWise]);

  const onDislike = useCallback(() => {
    if (!isReacting) reactWaste();
  }, [isReacting, reactWaste]);

  return (
    <div className="flex items-center gap-[1.6rem] pt-[0.5rem]">
      <button
        onClick={onLike}
        disabled={isReacting}
        aria-pressed={mine === 'WISE'}
        className="flex items-center justify-center gap-[0.4rem] w-[5rem] h-[3.6rem] cursor-pointer disabled:cursor-not-allowed"
      >
        <img src={mine === 'WISE' ? LikeIconFill : LikeIcon} alt="현명해요" />
        <span className="w-[2rem] text-center text-[1.4rem] text-[var(--color-G1)]">
          {w}
        </span>
      </button>

      <button
        onClick={onDislike}
        disabled={isReacting}
        aria-pressed={mine === 'WASTE'}
        className="flex items-center justify-center gap-[0.4rem] w-[5rem] h-[3.6rem] cursor-pointer disabled:cursor-not-allowed"
      >
        <img
          src={mine === 'WASTE' ? DislikeIconFill : DislikeIcon}
          alt="낭비에요"
        />
        <span className="w-[2rem] text-center text-[1.4rem] text-[var(--color-G1)]">
          {wa}
        </span>
      </button>
    </div>
  );
}

function PostItem({ post }: Props) {
  const navigate = useNavigate();
  const profileStyle = 'w-[3rem] h-[3rem] rounded-full';
  const imageUrl = post.imageUrls?.[0];

  const handleNavigate = useCallback(() => {
    navigate(`/feed/post/${post.consumptionRecordId}`);
  }, [navigate, post.consumptionRecordId]);

  return (
    <div className="bg-[var(--color-white)] overflow-hidden pb-[1.6rem]">
      <div className="pb-[0.8rem] flex items-center gap-[1.2rem]">
        {post.user.profileImgUrl ? (
          <img
            src={post.user.profileImgUrl}
            alt={`${post.user.nickname}의 프로필 이미지`}
            className={`${profileStyle} object-cover`}
          />
        ) : (
          <div
            className={`${profileStyle} bg-[var(--color-G6)]`}
            role="img"
            aria-label="기본 프로필 이미지"
          />
        )}
        <div className="flex flex-col">
          <h3 className="text-[1.4rem] text-[var(--color-G2)]">
            {post.user.nickname}
          </h3>
        </div>
      </div>

      <div
        onClick={handleNavigate}
        className="w-full relative pb-[100%] overflow-hidden rounded-[1rem] cursor-pointer"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`게시물 이미지 ${post.consumptionRecordId}`}
            className="absolute w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute w-full h-full bg-[var(--color-G6)] rounded-[1rem]"
            role="img"
            aria-label="게시물 이미지 없음"
          />
        )}
      </div>

      <ReactionBar
        id={post.consumptionRecordId}
        wiseCount={post.wiseCount}
        wasteCount={post.wasteCount}
        myReaction={post.myReaction}
      />
    </div>
  );
}

export default PostItem;
