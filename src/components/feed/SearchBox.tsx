import React, { useState, useEffect } from 'react';
import SearchIcon from '../../assets/images/feed/Search.png';
import NoResult from '../../assets/images/feed/NO_RESULT.png';
import * as S from '../../styles/feed/feed.style';
import { useSearch } from '../../hooks/feed/useSearch';
import type { FeedItem } from '../../types/feed/feed';

interface SearchBoxProps {
  onSearchResults?: (results: FeedItem[]) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentKeyword, setCurrentKeyword] = useState('');

  const { flatList, isFetching } = useSearch(currentKeyword);

  useEffect(() => {
    if (currentKeyword) {
      onSearchResults?.(flatList);
    }
  }, [flatList, currentKeyword, onSearchResults]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setCurrentKeyword(searchTerm.trim());
    }
  };

  return (
    <div>
      <div className={S.SearchContainer}>
        <div className={S.SearchInputWrapper}>
          <input
            type="text"
            placeholder="검색어를 입력해 주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={S.SearchInput}
          />
          <button onClick={handleSearch} className={S.SearchButton}>
            <img src={SearchIcon} alt="검색" width={20} height={20} />
          </button>
        </div>
      </div>

      {currentKeyword && (
        <div className="search-results">
          {!isFetching && flatList.length === 0 && (
            <div className={S.NoResultContainer}>
              <img
                src={NoResult}
                alt="검색 결과 없음"
                className="w-[16rem] h-[16rem] object-contain"
              />
              <span className="text-[1.4rem] text-[var(--color-G4)]">
                검색 결과가 없어요.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
