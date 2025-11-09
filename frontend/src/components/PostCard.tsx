import { Link } from "react-router-dom";
import {
  FaArrowUp,
  FaComment,
  FaCheckCircle,
  FaUser,
  FaClock,
} from "react-icons/fa";
import { type Post } from "../types";
import { useAuth } from "../context/AuthContext";

interface PostCardProps {
  post: Post;
  onUpvote: (postId: string) => void;
}

const PostCard = ({ post, onUpvote }: PostCardProps) => {
  const { user, setShowLoginModal } = useAuth();

  // Check if current user has upvoted this post
  const hasUpvoted = user && post.upvotedBy?.includes(user.uid);

  const handleUpvote = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    onUpvote(post._id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleUpvote}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              !user
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : hasUpvoted
                ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                : "bg-gray-100 hover:bg-blue-100 hover:text-blue-600 cursor-pointer"
            }`}
            aria-label={
              user
                ? hasUpvoted
                  ? "Remove upvote"
                  : "Upvote"
                : "Login to upvote"
            }
            title={
              user
                ? hasUpvoted
                  ? "Remove upvote"
                  : "Upvote this post"
                : "Login to upvote"
            }
          >
            <FaArrowUp />
          </button>
          <span className="font-bold text-lg text-gray-700">{post.votes}</span>
        </div>

        {/* Post Content */}
        <div className="flex-1">
          <Link to={`/post/${post._id}`} className="block group">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              {post.isAnswered && (
                <FaCheckCircle
                  className="text-green-500 text-xl flex-shrink-0"
                  title="Answered"
                />
              )}
            </div>
            <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
          </Link>

          {/* Post Metadata */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FaUser className="text-xs" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="text-xs" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <Link
              to={`/post/${post._id}`}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <FaComment className="text-xs" />
              <span>
                {post.replyCount || 0}{" "}
                {post.replyCount === 1 ? "reply" : "replies"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
