import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaUser,
  FaClock,
} from "react-icons/fa";
import { type Post, type Reply } from "../types";
import { postsAPI } from "../services/api";
import { getSocket } from "../services/socket";
import ReplyList from "../components/ReplyList";
import ReplyForm from "../components/ReplyForm";
import DiscussionSummary from "../components/DiscussionSummary";
import { useAuth } from "../context/AuthContext";

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, setShowLoginModal } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);

  // Fetch post details
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const response = await postsAPI.getPostById(id);
      setPost(response.data.post);
      setReplies(response.data.replies);
    } catch (error) {
      console.error("Error fetching post details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add reply
  const handleAddReply = async (content: string, author: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      setReplyLoading(true);
      if (!id) return;
      await postsAPI.addReply(id, {
        content,
        author,
        userId: user.uid,
      });
    } catch (error: any) {
      console.error("Error adding reply:", error);
      alert(error.response?.data?.message || "Failed to add reply");
    } finally {
      setReplyLoading(false);
    }
  };

  // Upvote post
  const handleUpvote = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      if (!id) return;
      const response = await postsAPI.upvotePost(id, user.uid);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              votes: response.data.votes,
              upvotedBy: response.data.upvotedBy,
              downvotedBy: response.data.downvotedBy,
            }
          : null
      );
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  // Downvote post
  const handleDownvote = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      if (!id) return;
      const response = await postsAPI.downvotePost(id, user.uid);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              votes: response.data.votes,
              upvotedBy: response.data.upvotedBy,
              downvotedBy: response.data.downvotedBy,
            }
          : null
      );
    } catch (error) {
      console.error("Error downvoting post:", error);
    }
  };

  // Mark as answered
  const handleMarkAsAnswered = async () => {
    try {
      if (!id) return;
      await postsAPI.markAsAnswered(id);
      setPost((prev) =>
        prev ? { ...prev, isAnswered: !prev.isAnswered } : null
      );
    } catch (error) {
      console.error("Error marking as answered:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Initial fetch
  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  // Socket.io real-time updates
  useEffect(() => {
    const socket = getSocket();

    // Listen for new replies
    socket.on(
      "newReply",
      ({ postId, reply }: { postId: string; reply: Reply }) => {
        if (postId === id) {
          setReplies((prev) => [...prev, reply]);
        }
      }
    );

    // Listen for upvotes
    socket.on(
      "postUpvoted",
      ({ postId, votes }: { postId: string; votes: number }) => {
        if (postId === id) {
          setPost((prev) => (prev ? { ...prev, votes } : null));
        }
      }
    );

    return () => {
      socket.off("newReply");
      socket.off("postUpvoted");
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Post not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <FaArrowLeft />
        <span>Back to all questions</span>
      </button>

      {/* Post Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex gap-6">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleUpvote}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                !user
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : post.upvotedBy?.includes(user.uid)
                  ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  : "bg-gray-100 hover:bg-blue-100 hover:text-blue-600 cursor-pointer"
              }`}
              aria-label={
                user
                  ? post.upvotedBy?.includes(user.uid)
                    ? "Remove upvote"
                    : "Upvote"
                  : "Login to upvote"
              }
              title={
                user
                  ? post.upvotedBy?.includes(user.uid)
                    ? "Remove upvote"
                    : "Upvote this post"
                  : "Login to upvote"
              }
            >
              <FaArrowUp className="text-xl" />
            </button>
            <span className="font-bold text-2xl text-gray-700">
              {post.votes}
            </span>
            <button
              onClick={handleDownvote}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                !user
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : post.downvotedBy?.includes(user.uid)
                  ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                  : "bg-gray-100 hover:bg-red-100 hover:text-red-600 cursor-pointer"
              }`}
              aria-label={
                user
                  ? post.downvotedBy?.includes(user.uid)
                    ? "Remove downvote"
                    : "Downvote"
                  : "Login to downvote"
              }
              title={
                user
                  ? post.downvotedBy?.includes(user.uid)
                    ? "Remove downvote"
                    : "Downvote this post"
                  : "Login to downvote"
              }
            >
              <FaArrowDown className="text-xl" />
            </button>
            <span className="text-xs text-gray-500">votes</span>
          </div>

          {/* Post Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
              {post.isAnswered && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <FaCheckCircle />
                  <span className="text-sm font-semibold">Answered</span>
                </div>
              )}
            </div>

            <p className="text-gray-700 text-lg whitespace-pre-wrap mb-4">
              {post.content}
            </p>

            {/* Post Metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <FaUser className="text-xs" />
                <span>
                  Asked by <strong>{post.author}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock className="text-xs" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            {/* Mark as Answered Button */}
            <div className="mt-4">
              <button
                onClick={handleMarkAsAnswered}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  post.isAnswered
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {post.isAnswered ? "Mark as Unanswered" : "Mark as Answered"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Discussion Summary */}
      {replies.length > 0 && post && (
        <DiscussionSummary
          postTitle={post.title}
          postContent={post.content}
          replies={replies}
        />
      )}

      {/* Replies Section */}
      <div className="mb-6">
        <ReplyList replies={replies} />
      </div>

      {/* Reply Form */}
      <ReplyForm onSubmit={handleAddReply} loading={replyLoading} />
    </div>
  );
};

export default PostDetailPage;
