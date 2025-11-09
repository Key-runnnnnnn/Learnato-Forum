import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Post API calls
export const postsAPI = {
  // Get all posts
  getAllPosts: async (sortBy = "votes", filterAnswered = "all") => {
    const response = await api.get(
      `/posts?sortBy=${sortBy}&filterAnswered=${filterAnswered}`
    );
    return response.data;
  },

  // Get single post with replies
  getPostById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  createPost: async (postData: {
    title: string;
    content: string;
    author?: string;
    userId: string;
  }) => {
    const response = await api.post("/posts", postData);
    return response.data;
  },

  // Add reply to post
  addReply: async (
    postId: string,
    replyData: { content: string; author?: string; userId: string }
  ) => {
    const response = await api.post(`/posts/${postId}/reply`, replyData);
    return response.data;
  },

  // Upvote post
  upvotePost: async (postId: string, userId: string) => {
    const response = await api.post(`/posts/${postId}/upvote`, { userId });
    return response.data;
  },

  // Downvote post
  downvotePost: async (postId: string, userId: string) => {
    const response = await api.post(`/posts/${postId}/downvote`, { userId });
    return response.data;
  },

  // Mark post as answered
  markAsAnswered: async (postId: string) => {
    const response = await api.patch(`/posts/${postId}/answer`);
    return response.data;
  },

  // Search posts
  searchPosts: async (keyword: string) => {
    const response = await api.get(`/posts/search/${keyword}`);
    return response.data;
  },
};

export default api;
