import { useState } from "react";
import { FaRobot, FaSpinner } from "react-icons/fa";
import { summarizeDiscussion } from "../services/gemini";
import { type Reply } from "../types";

interface DiscussionSummaryProps {
  postTitle: string;
  postContent: string;
  replies: Reply[];
}

const DiscussionSummary = ({
  postTitle,
  postContent,
  replies,
}: DiscussionSummaryProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (replies.length === 0) {
      setError("No replies to summarize yet.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("=== Starting Discussion Summary ===");
      console.log("Post Title:", postTitle);
      console.log("Post Content:", postContent);
      console.log("Number of Replies:", replies.length);
      console.log("Replies:", replies);

      const result = await summarizeDiscussion(postTitle, postContent, replies);

      console.log("Summary Result:", result);

      if (!result) {
        throw new Error("No summary returned from API");
      }

      setSummary(result);
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to generate summary. Please try again.";
      setError(errorMessage);
      console.error("=== Summary Generation Error ===");
      console.error("Error:", err);
      console.error("Error Message:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaRobot className="text-indigo-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">
            AI Discussion Summary
          </h3>
        </div>
        {!summary && (
          <button
            onClick={handleSummarize}
            disabled={loading || replies.length === 0}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FaRobot />
                <span>Summarize</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {summary && (
        <div className="bg-white rounded-lg p-4 border border-indigo-100">
          <p className="text-gray-700 leading-relaxed">{summary}</p>
          <button
            onClick={() => setSummary(null)}
            className="text-indigo-600 hover:text-indigo-700 text-sm mt-3 font-medium"
          >
            Generate New Summary
          </button>
        </div>
      )}

      {!summary && !error && replies.length === 0 && (
        <p className="text-gray-600 text-sm">
          Add some replies to this discussion to generate an AI summary.
        </p>
      )}
    </div>
  );
};

export default DiscussionSummary;
