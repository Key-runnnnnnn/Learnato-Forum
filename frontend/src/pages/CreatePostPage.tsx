import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { postsAPI } from "../services/api";
import { findSimilarQuestions, getAISuggestions } from "../services/gemini";
import { type Post } from "../types";
import AISuggestions from "../components/AISuggestions";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user, setShowLoginModal } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState<Post[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
      navigate("/");
    }
  }, [user, navigate, setShowLoginModal]);

  // Set author name from authenticated user
  useEffect(() => {
    if (user?.displayName) {
      setFormData((prev) => ({ ...prev, author: user.displayName || "" }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setShowAI(false); // Reset AI suggestions when user types
  };

  // Check for similar questions using AI
  const handleCheckSimilar = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please enter both title and content first");
      return;
    }

    try {
      setAiLoading(true);
      setShowAI(true);

      // Fetch existing posts
      const response = await postsAPI.getAllPosts("votes", "all");
      const existingPosts = response.data;

      // Get similar questions and AI suggestions in parallel
      const [similar, suggestions] = await Promise.all([
        findSimilarQuestions(formData.title, formData.content, existingPosts),
        getAISuggestions(formData.title, formData.content),
      ]);

      setSimilarQuestions(similar);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error getting AI assistance:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      await postsAPI.createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || user.displayName || "Anonymous",
        userId: user.uid,
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error creating post:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <FaArrowLeft />
        <span>Back to home</span>
      </button>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Ask a Question
        </h1>
        <p className="text-gray-600 mb-6">
          Share your question with the community and get help from fellow
          learners and instructors.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Author Field */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Anonymous"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to post anonymously
            </p>
          </div>

          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Question Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., How do I deploy Node.js on Cloud Run?"
              maxLength={200}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Content Field */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Question Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Provide more details about your question. What have you tried? What specific help do you need?"
              rows={8}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Be as detailed as possible to get better answers
            </p>
          </div>

          {/* AI Check Button */}
          <div>
            <button
              type="button"
              onClick={handleCheckSimilar}
              disabled={
                aiLoading || !formData.title.trim() || !formData.content.trim()
              }
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {aiLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>AI is analyzing...</span>
                </>
              ) : (
                <>
                  <span>🤖</span>
                  <span>Check for Similar Questions (AI)</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              AI will suggest similar questions and helpful tips
            </p>
          </div>

          {/* AI Suggestions */}
          {showAI && (
            <AISuggestions
              similarQuestions={similarQuestions}
              suggestions={aiSuggestions}
              loading={aiLoading}
            />
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={
                loading || !formData.title.trim() || !formData.content.trim()
              }
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Post Question</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
