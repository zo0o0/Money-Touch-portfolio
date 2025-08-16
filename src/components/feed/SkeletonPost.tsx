import React from 'react';
import * as S from '../../styles/feed/feed.style';

export const SkeletonPost: React.FC = () => {
  return (
    <div className={S.PostCard}>
      <div className={S.PostHeader}>
        <div
          className={`${S.SkeletonBox} rounded-full`}
          style={{ width: '3rem', height: '3rem' }}
        />
        <div className="flex flex-col gap-2">
          <div
            className={`${S.SkeletonBox} rounded-full`}
            style={{ width: '12rem', height: '1.6rem' }}
          />
        </div>
      </div>

      <div className={S.PostImageContainer}>
        <div className={S.ImageSkeleton} />
      </div>

      <div className={S.PostActions}>
        <div
          className={`${S.SkeletonBox} rounded-full`}
          style={{ width: '6.4rem', height: '3.2rem' }}
        />
        <div
          className={`${S.SkeletonBox} rounded-full`}
          style={{ width: '6.4rem', height: '3.2rem' }}
        />
      </div>
    </div>
  );
};
