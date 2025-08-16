export const Container =
  '!h-[calc(100vh-13rem)] !mb-[13rem] px-[2.4rem]  !overflow-y-auto';

export const SearchContainer = 'w-full h-[6rem] rounded-[0.5rem]';

export const SearchInputWrapper =
  'w-full h-[4.5rem] border border-[var(--color-G7)] rounded-[0.5rem] my-[0.8rem] mx-auto flex items-center';

export const SearchInput =
  'w-full h-full text-[1.4rem] px-[1.5rem] py-[1.2rem] text-[var(--color-G5)]';

export const SearchButton = 'h-full cursor-pointer p-[1.2rem]';

export const DropdownContainer = 'relative flex justify-end';

export const DropdownButton =
  'flex items-center gap-[0.8rem] px-[1.6rem] py-[0.2rem] rounded-[0.5rem] cursor-pointer';

export const DropdownMenu =
  'absolute top-full w-[6.1rem] bg-[var(--color-G8)] mx-[1rem] px-[1.6rem] rounded-[0.5rem] z-10 text-[var(--color-G4)]';

export const DropdownItem = (isActive: boolean) => `
  w-full py-[0.4rem] text-center cursor-pointer flex justify-center items-center
  ${isActive ? 'text-[var(--color-G1)]' : 'text-[var(--color-G4)]'}
`;

export const PostContainer = 'flex flex-col gap-[1.6rem] mt-[1.2rem]';

export const PostList = 'flex flex-col';

export const PostCard = 'bg-[var(--color-white)] overflow-hidden pb-[1.6rem]';

export const PostHeader = 'pb-[0.8rem] flex items-center gap-[1.2rem]';

export const ProfileImage = 'w-[3rem] h-[3rem] rounded-full object-cover';

export const AuthorInfo = 'flex flex-col';

export const AuthorName = 'text-[1.4rem] text-[var(--color-G2)]';

export const PostImageContainer =
  'w-full relative pb-[100%] overflow-hidden rounded-[1rem] cursor-pointer';

export const PostImage = 'absolute w-full h-full object-cover';

export const PostActions = 'flex items-center gap-[1.6rem] pt-[0.5rem]';

export const LikeButton =
  'flex items-center justify-center gap-[0.4rem] w-[5rem] h-[3.6rem] cursor-pointer';

export const DislikeButton =
  'flex items-center justify-center gap-[0.4rem] w-[5rem] h-[3.6rem] cursor-pointer';

export const LikeCount =
  'w-[2rem] text-center text-[1.4rem] font-inherit text-[var(--color-G1)]';

export const DislikeCount =
  'w-[2rem] text-center text-[1.4rem] font-inherit text-[var(--color-G1)]';

export const NoResultContainer =
  'flex flex-col items-center h-[60vh] text-center mt-[10rem]';

export const NoResultImage = 'h-[12rem] block';

export const NoResultText = 'text-[2rem] text-[var(--color-G1)]';

export const DropdownText =
  'text-[1.1rem] text-[var(--color-G4)] flex items-center';

export const ChevronIcon = 'flex items-center';

export const SkeletonBox = (
  width = '100%',
  height = '1.6rem',
  circle = false,
) => `
  bg-[var(--color-G7)]
  ${circle ? 'rounded-full' : 'rounded-[0.4rem]'}
  w-[${width}] h-[${height}]
`;

export const ImageSkeleton =
  'absolute bg-[var(--color-G7)] w-full h-full rounded-[0.5rem]';

export const DefaultProfile =
  'w-[3rem] h-[3rem] rounded-full bg-[var(--color-G6)]';

export const DefaultPostImage =
  'absolute w-full h-full bg-[var(--color-G6)] rounded-[1rem]';
