import { FaUser, FaClock } from "react-icons/fa";
import { type Reply } from "../types";

interface ReplyCardProps {
  reply: Reply;
}

const ReplyCard = ({ reply }: ReplyCardProps) => {
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
    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
      <p className="text-gray-800 whitespace-pre-wrap">{reply.content}</p>

      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <FaUser className="text-xs" />
          <span className="font-medium">{reply.author}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaClock className="text-xs" />
          <span>{formatDate(reply.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
