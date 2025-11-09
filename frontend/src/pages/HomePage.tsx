import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { type Post } from "../types";
import { postsAPI } from "../services/api";
import { getSocket } from "../services/socket";
import PostList from "../components/PostList";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("votes");
  const [filterAnswered, setFilterAnswered] = useState("all");
  const [searchMode, setSearchMode] = useState(false);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts(sortBy, filterAnswered);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search posts
  const handleSearch = async (keyword: string) => {
    try {
      setLoading(true);
      setSearchMode(true);
      const response = await postsAPI.searchPosts(keyword);
      setPosts(response.data);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchMode(false);
    fetchPosts();
  };

  // Upvote post
  const handleUpvote = async (postId: string) => {
    if (!user) return;

    try {
      const response = await postsAPI.upvotePost(postId, user.uid);

      // Update local state with new upvotedBy and downvotedBy arrays
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                votes: response.data.votes,
                upvotedBy: response.data.upvotedBy,
                downvotedBy: response.data.downvotedBy,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  // Downvote post
  const handleDownvote = async (postId: string) => {
    if (!user) return;

    try {
      const response = await postsAPI.downvotePost(postId, user.uid);

      // Update local state with new upvotedBy and downvotedBy arrays
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                votes: response.data.votes,
                upvotedBy: response.data.upvotedBy,
                downvotedBy: response.data.downvotedBy,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error downvoting post:", error);
    }
  };

  // Handle filter changes
  const handleClearFilters = () => {
    setSortBy("votes");
    setFilterAnswered("all");
    setSearchMode(false);
  };

  // Initial fetch
  useEffect(() => {
    if (!searchMode) {
      fetchPosts();
    }
  }, [sortBy, filterAnswered]);

  // Socket.io real-time updates
  useEffect(() => {
    const socket = getSocket();

    // Listen for new posts
    socket.on("newPost", (newPost: Post) => {
      if (!searchMode) {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
    });

    // Listen for upvotes
    socket.on(
      "postUpvoted",
      ({ postId, votes }: { postId: string; votes: number }) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, votes } : post
          )
        );
      }
    );

    return () => {
      socket.off("newPost");
      socket.off("postUpvoted");
    };
  }, [searchMode]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Discussion Forum
            </h1>
            <p className="text-gray-600 mt-1">
              Ask questions, share knowledge, and learn together
            </p>
          </div>
          <Link
            to="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <FaPlus />
            <span>New Question</span>
          </Link>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      </div>

      {/* Filters */}
      {!searchMode && (
        <Filters
          sortBy={sortBy}
          filterAnswered={filterAnswered}
          onSortChange={setSortBy}
          onFilterAnsweredChange={setFilterAnswered}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {searchMode
            ? `Search Results: ${posts.length} ${
                posts.length === 1 ? "question" : "questions"
              } found`
            : `Showing ${posts.length} ${
                posts.length === 1 ? "question" : "questions"
              }`}
        </p>
      </div>

      {/* Posts List */}
      <PostList
        posts={posts}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        loading={loading}
      />
    </div>
  );
};

export default HomePage;
