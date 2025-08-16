import React from 'react';
import * as S from '../../../styles/feed/feedDetail.style';
import PersonIcon from '../../../assets/images/feed/Person.png';
import { useMypageQuery } from '../../../hooks/auth/mypage/useMypageQuery';

interface CommentInputProps {
  mentionName: string | null;
  replyText: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
  maxLength?: number;
}

const CommentInput: React.FC<CommentInputProps> = ({
  mentionName,
  replyText,
  onChange,
  onSubmit,
  isSubmitting = false,
  maxLength = 300,
}) => {
  const disabled = replyText.trim().length === 0 || isSubmitting;

  const { data: mypageData } = useMypageQuery();
  const profileImageUrl = mypageData?.result?.profileImgUrl || PersonIcon;

  return (
    <div className={S.replyInputWrapper}>
      <img src={profileImageUrl} alt="내 프로필" className={S.profileImage} />

      {mentionName && <div className={S.mentionLabel}>@{mentionName}</div>}

      <textarea
        value={replyText}
        onChange={(e) => onChange(e.target.value)}
        placeholder="댓글을 입력해주세요."
        maxLength={maxLength}
        className={S.replyInput}
      />

      <div className={S.replyInputFooter}>
        <div className={S.buttonGroup}>
          <button
            onClick={onSubmit}
            disabled={disabled}
            className={S.submitButton}
          >
            {isSubmitting ? '등록중' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
