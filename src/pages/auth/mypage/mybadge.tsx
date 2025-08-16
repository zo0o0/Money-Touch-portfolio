import { useState, useRef, useEffect } from 'react';
import Header from '../../../components/header/header';
import Footer from '../../../components/footer/footer';
import PencilIcon from '../../../assets/images/auth/badge/Pencil.png';
import PencilFilledIcon from '../../../assets/images/auth/badge/Pencil_Filled.png';
import Nobadge from '../../../assets/images/auth/badge/Represent/NoBadge.png';
import * as S from '../../../styles/auth/mypage/mybadge.style';

import {
  useMyBadgesQuery,
  useRepresentativeBadgeQuery,
  useSetRepresentativeBadgeMutation,
} from '../../../hooks/auth/mypage/useBadgeQuery';

import { badgeList } from '../../../mocks/auth/badge/badgeList';

const Mybadge = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [selectedBadgeId, setSelectedBadgeId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: badgeListData = [] } = useMyBadgesQuery();
  const { data: representativeBadge } = useRepresentativeBadgeQuery();
  const { mutate: setRepresentativeBadge } =
    useSetRepresentativeBadgeMutation();

  const handleBadgeClick = (badgeId: number) => {
    if (!isEditMode) return;
    setSelectedBadgeId(badgeId === selectedBadgeId ? null : badgeId);
  };

  const handleCancel = () => {
    setSelectedBadgeId(null);
    setIsEditMode(false);
  };

  const handleSelect = () => {
    if (selectedBadgeId !== null) {
      setRepresentativeBadge(selectedBadgeId);
    }
    setSelectedBadgeId(null);
    setIsEditMode(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setIsEditMode(false);
      setSelectedBadgeId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchedRepresentImage = representativeBadge
    ? badgeList.find((b) => b.id === representativeBadge.badgeId)?.represent
    : null;

  return (
    <div ref={wrapperRef} className={S.container}>
      <Header title="MY 배지" />
      <div className={S.topContainer}>
        <div className={S.titleContainer}>
          <div className={S.title}>대표 배지</div>
          <button className={S.editImage} onClick={() => setIsEditMode(true)}>
            <img
              src={isEditMode ? PencilFilledIcon : PencilIcon}
              alt="수정"
              className="w-[1.6rem] h-[1.6rem]"
            />
          </button>
        </div>
        <div className={S.representBadgeImageWrapper}>
          <img
            src={matchedRepresentImage || Nobadge}
            alt={representativeBadge ? '대표 배지' : '대표 배지 없음'}
            className={S.representBadgeImage}
          />
        </div>
      </div>

      <div className={S.divider} />

      <div
        className={`${S.myBadgeContainer} ${
          isEditMode
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-40 pointer-events-none'
        }`}
      >
        {badgeListData.map((badge) => {
          const isSelected = selectedBadgeId === badge.badgeId;
          return (
            <div
              key={badge.badgeId}
              className={S.badgeItem}
              onClick={() => handleBadgeClick(badge.badgeId)}
            >
              <div
                className={`${S.badgeImageWrapper} ${
                  isSelected ? '!bg-[#E6E6E6]' : 'bg-transparent'
                }`}
              >
                <img
                  src={badge.imageUrl}
                  alt={badge.name}
                  className="w-[5.8rem] h-[6.6rem] object-contain"
                />
              </div>
              <div className={S.badgeName}>{badge.name}</div>
            </div>
          );
        })}
      </div>

      {isEditMode ? (
        <div className={S.selectFooter}>
          <button className={S.cancelButton} onClick={handleCancel}>
            닫기
          </button>
          <button
            className={`${S.selectButton} ${
              selectedBadgeId !== null
                ? '!bg-[var(--color-mainColor1)] !text-[var(--color-white)]'
                : '!bg-[var(--color-G7)] !text-[var(--color-G4)] pointer-events-none'
            }`}
            onClick={handleSelect}
            disabled={selectedBadgeId === null}
          >
            선택
          </button>
        </div>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default Mybadge;
