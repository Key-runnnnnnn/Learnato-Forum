import { type Post } from "../types";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
  onUpvote: (postId: string) => void;
  loading?: boolean;
}

const PostList = ({ posts, onUpvote, loading }: PostListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-lg">
          No posts found. Be the first to ask a question!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onUpvote={onUpvote} />
      ))}
    </div>
  );
};

export default PostList;
