import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

interface ReplyFormProps {
  onSubmit: (content: string, author: string) => void;
  loading?: boolean;
}

const ReplyForm = ({ onSubmit, loading }: ReplyFormProps) => {
  const { user, setShowLoginModal } = useAuth();
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  // Auto-fill author name if user is logged in
  useEffect(() => {
    if (user?.displayName) {
      setAuthor(user.displayName);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (content.trim()) {
      onSubmit(
        content.trim(),
        author.trim() || user.displayName || "Anonymous"
      );
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Add Your Reply
      </h3>

      {!user && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          <p>
            Please{" "}
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="font-semibold underline hover:text-blue-800"
            >
              sign in
            </button>{" "}
            to post a reply.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={user?.displayName || "Your name"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            disabled={loading || !user}
            readOnly={!!user?.displayName}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reply Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts or solution..."
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={!content.trim() || loading || !user}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Posting...</span>
            </>
          ) : (
            <>
              <FaPaperPlane />
              <span>Post Reply</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;
