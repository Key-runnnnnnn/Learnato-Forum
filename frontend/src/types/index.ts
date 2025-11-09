// Post interface
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  votes: number;
  upvotedBy?: string[];
  downvotedBy?: string[];
  isAnswered: boolean;
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
}

// Reply interface
export interface Reply {
  _id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PostsResponse {
  success: boolean;
  count: number;
  data: Post[];
}

export interface PostDetailResponse {
  success: boolean;
  data: {
    post: Post;
    replies: Reply[];
  };
}

// Form data types
export interface CreatePostData {
  title: string;
  content: string;
  author?: string;
}

export interface CreateReplyData {
  content: string;
  author?: string;
}
