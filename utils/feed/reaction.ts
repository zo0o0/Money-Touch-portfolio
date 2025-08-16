import type { Post, PostStates } from '../../types/feed/feed';

export const handleLike = (
  id: number,
  posts: Post[],
  postStates: PostStates,
  setPosts: (posts: Post[]) => void,
  setPostStates: (states: PostStates) => void,
) => {
  const current = postStates[id] || { liked: false, disliked: false };
  const wasLiked = current.liked;

  const updatedPost = posts.find((p) => p.id === id);
  if (!updatedPost) return;

  const newPosts = posts.map((p) => {
    if (p.id !== id) return p;
    return {
      ...p,
      likes: wasLiked ? p.likes - 1 : p.likes + 1,
      dislikes: current.disliked && !wasLiked ? p.dislikes - 1 : p.dislikes,
    };
  });

  setPosts(newPosts);
  setPostStates({
    ...postStates,
    [id]: {
      liked: !wasLiked,
      disliked: wasLiked ? current.disliked : false,
    },
  });
};

export const handleDislike = (
  id: number,
  posts: Post[],
  postStates: PostStates,
  setPosts: (posts: Post[]) => void,
  setPostStates: (states: PostStates) => void,
) => {
  const current = postStates[id] || { liked: false, disliked: false };
  const wasDisliked = current.disliked;

  const updatedPost = posts.find((p) => p.id === id);
  if (!updatedPost) return;

  const newPosts = posts.map((p) => {
    if (p.id !== id) return p;
    return {
      ...p,
      dislikes: wasDisliked ? p.dislikes - 1 : p.dislikes + 1,
      likes: current.liked && !wasDisliked ? p.likes - 1 : p.likes,
    };
  });

  setPosts(newPosts);
  setPostStates({
    ...postStates,
    [id]: {
      liked: wasDisliked ? current.liked : false,
      disliked: !wasDisliked,
    },
  });
};
