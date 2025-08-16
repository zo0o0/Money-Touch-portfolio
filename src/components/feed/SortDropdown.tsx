import React from 'react';
import * as S from '../../styles/feed/feed.style';
import CaretDownIcon from '../../assets/images/feed/CaretDown.png';
import CaretUpIcon from '../../assets/images/feed/CaretUp.png';
import type { SortType } from '../../types/feed/feed';

interface SortDropdownProps {
  sortBy: SortType;
  onSortChange: (sortBy: SortType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const sortOptions: SortType[] = ['POPULAR', 'RECENT'];

const sortLabels: Record<SortType, string> = {
  POPULAR: '인기순',
  RECENT: '최신순',
};

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  onSortChange,
  isOpen,
  onToggle,
}) => {
  const handleSortChange = (newSortBy: SortType) => {
    if (newSortBy !== sortBy) {
      onSortChange(newSortBy);
    }
    onToggle();
  };

  return (
    <div className={S.DropdownContainer}>
      <button
        className={S.DropdownButton}
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="sort-options"
      >
        <span className={S.DropdownText}>{sortLabels[sortBy]}</span>
        <div className={S.ChevronIcon}>
          <img
            src={isOpen ? CaretUpIcon : CaretDownIcon}
            alt="정렬 아이콘"
            className="w-[0.48rem] h-[0.35rem]"
          />
        </div>
      </button>

      {isOpen && (
        <div className={S.DropdownMenu} role="listbox" id="sort-options">
          {sortOptions.map((type) => {
            const isSelected = sortBy === type;
            return (
              <button
                key={type}
                role="option"
                aria-selected={isSelected}
                className={`${S.DropdownItem} ${
                  isSelected ? '!text-[var(--color-G1)] font-semibold' : ''
                }`}
                onClick={() => handleSortChange(type)}
              >
                {sortLabels[type]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
