import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useFeedPosts } from '../../hooks/feed/useFeedPosts';
import { SearchBox } from '../../components/feed/SearchBox';
import { SortDropdown } from '../../components/feed/SortDropdown';
import PostItem from '../../components/feed/PostItem';
import { SkeletonPost } from '../../components/feed/SkeletonPost';
import NoResult from '../../assets/images/feed/NO_RESULT.png';
import * as S from '../../styles/feed/feed.style';

import type { SortType, FeedItem } from '../../types/feed/feed';

const Feed: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortType>('POPULAR');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<FeedItem[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeedPosts(sortBy);

  const allPosts = data?.pages.flatMap((page) => page.feedList) ?? [];

  const [showSkeleton, setShowSkeleton] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setShowSkeleton(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isSearchMode
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isSearchMode],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });
    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [handleObserver, sortBy]);

  const handleSearchResults = (results: FeedItem[]) => {
    setSearchResults(results);
    setIsSearchMode(true);
  };

  const displayPosts = isSearchMode ? searchResults : allPosts;

  return (
    <div className={S.Container}>
      <SearchBox onSearchResults={handleSearchResults} />

      {!isSearchMode && (
        <SortDropdown
          sortBy={sortBy}
          onSortChange={setSortBy}
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen((prev) => !prev)}
        />
      )}

      <div className={S.PostContainer}>
        {showSkeleton ? (
          <SkeletonPost />
        ) : displayPosts.length > 0 ? (
          displayPosts.map((post) => (
            <PostItem key={post.consumptionRecordId} post={post} />
          ))
        ) : (
          !isLoading &&
          !isSearchMode && (
            <div className={S.NoResultContainer}>
              <img
                src={NoResult}
                alt="게시글 없음"
                className="w-[16rem] h-[16rem] object-contain"
              />
              <span className="text-[1.4rem] text-[var(--color-G4)]">
                게시글이 없어요.
              </span>
            </div>
          )
        )}

        <div ref={observerRef} />

        {!showSkeleton && isFetchingNextPage && !isSearchMode && (
          <SkeletonPost />
        )}
      </div>
    </div>
  );
};

export default Feed;
