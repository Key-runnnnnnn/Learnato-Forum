import { type Reply } from "../types";
import ReplyCard from "./ReplyCard";

interface ReplyListProps {
  replies: Reply[];
}

const ReplyList = ({ replies }: ReplyListProps) => {
  if (replies.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No replies yet. Be the first to reply!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
      </h3>
      {replies.map((reply) => (
        <ReplyCard key={reply._id} reply={reply} />
      ))}
    </div>
  );
};

export default ReplyList;
