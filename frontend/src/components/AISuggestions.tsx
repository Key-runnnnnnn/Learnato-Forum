import { Link } from "react-router-dom";
import { FaRobot, FaLightbulb } from "react-icons/fa";
import { type Post } from "../types";

interface AISuggestionsProps {
  similarQuestions: Post[];
  suggestions: string | null;
  loading: boolean;
}

const AISuggestions = ({
  similarQuestions,
  suggestions,
  loading,
}: AISuggestionsProps) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <FaRobot className="text-purple-600 text-xl animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-800">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          <span>Analyzing your question...</span>
        </div>
      </div>
    );
  }

  if (!similarQuestions.length && !suggestions) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <FaRobot className="text-purple-600 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">AI Assistant</h3>
      </div>

      {/* Similar Questions */}
      {similarQuestions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FaLightbulb className="text-yellow-500" />
            <h4 className="font-semibold text-gray-700">
              Similar Questions Found
            </h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            These questions might already have the answer you're looking for:
          </p>
          <div className="space-y-2">
            {similarQuestions.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                className="block bg-white rounded-lg p-3 hover:shadow-md transition-shadow border border-purple-100"
              >
                <h5 className="font-medium text-gray-800 hover:text-purple-600 transition-colors">
                  {post.title}
                </h5>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{post.votes} votes</span>
                  <span>{post.replyCount || 0} replies</span>
                  {post.isAnswered && (
                    <span className="text-green-600 font-semibold">
                      ✓ Answered
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {suggestions && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaRobot className="text-purple-600" />
            <h4 className="font-semibold text-gray-700">AI Tips</h4>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {suggestions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
