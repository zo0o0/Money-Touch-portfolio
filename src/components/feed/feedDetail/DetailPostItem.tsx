import React, { useMemo } from 'react';
import * as S from '../../../styles/feed/feedDetail.style';
import LikeIcon from '../../../assets/images/feed/Like.png';
import LikeActiveIcon from '../../../assets/images/feed/Like_Fill.png';
import DislikeIcon from '../../../assets/images/feed/Dislike.png';
import DislikeActiveIcon from '../../../assets/images/feed/Dislike_Fill.png';
import CommentIcon from '../../../assets/images/feed/Bubble.png';
import PersonIcon from '../../../assets/images/feed/Person.png';
import EllipseIcon from '../../../assets/images/feed/Ellipse_221.png';
import type {
  FeedDetailResultDTO,
  MyReactionType,
} from '../../../types/feed/feedDetail';

type UIReaction = Exclude<MyReactionType, 'NONE'>;

interface Props {
  data: FeedDetailResultDTO;
  wiseCount: number;
  wasteCount: number;
  myReaction: UIReaction;
  isReacting: boolean;
  onReactWise: () => void;
  onReactWaste: () => void;
  onComment: () => void;
}

const DetailPostItem: React.FC<Props> = ({
  data,
  wiseCount,
  wasteCount,
  myReaction,
  isReacting,
  onReactWise,
  onReactWaste,
  onComment,
}) => {
  const createdAt = useMemo(() => new Date(data.createdAt), [data.createdAt]);
  const month = createdAt.getMonth() + 1;
  const day = createdAt.getDate();
  const time = createdAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const image = data.imageUrls?.[0];
  const categoryName = data.consumptionCategory?.budgetCategoryName ?? '';
  const authorName = data.user?.nickname ?? '';
  const authorProfile = data.user?.profileImgUrl || PersonIcon;

  return (
    <>
      <div className={S.authorSection}>
        <img
          src={authorProfile}
          className={S.profileImage}
          alt="작성자 프로필"
        />
        <div className={S.authorInfo}>
          <span className={S.authorName}>{authorName}</span>
          <span className={S.timestamp}>
            {month}
            <img src={EllipseIcon} className={S.eclipseIcon} alt="·" />
            {day}
            <img src={EllipseIcon} className={S.eclipseIcon} alt="·" />
            {time}
          </span>
        </div>
      </div>

      <img
        src={image || ''}
        alt="본문 이미지"
        className={`${S.postImage} ${!image ? S.noImage : ''}`}
      />

      <div className={S.actionButtons}>
        <button
          className={S.actionButton}
          onClick={() => !isReacting && onReactWise()}
          disabled={isReacting}
          aria-pressed={myReaction === 'WISE'}
        >
          <img
            src={myReaction === 'WISE' ? LikeActiveIcon : LikeIcon}
            className={S.actionIcon}
            alt="현명해요"
          />
          <span className={S.actionCount}>{wiseCount}</span>
        </button>
        <button
          className={S.actionButton}
          onClick={() => !isReacting && onReactWaste()}
          disabled={isReacting}
          aria-pressed={myReaction === 'WASTE'}
        >
          <img
            src={myReaction === 'WASTE' ? DislikeActiveIcon : DislikeIcon}
            className={S.actionIcon}
            alt="낭비에요"
          />
          <span className={S.actionCount}>{wasteCount}</span>
        </button>
        <button className={S.actionButton} onClick={onComment}>
          <img src={CommentIcon} className={S.actionIcon} alt="댓글" />
          <span className={S.actionCount}>{data.commentCount ?? 0}</span>
        </button>
      </div>

      <div className={S.infoContainer}>
        <h2 className={S.companyName}>{categoryName}</h2>
        <div className={S.price}>{(data.amount ?? 0).toLocaleString()}원</div>
        <p className={S.content}>{data.content}</p>
        {data.memo && <p className={S.content}>{data.memo}</p>}
      </div>
    </>
  );
};

export default React.memo(DetailPostItem);
