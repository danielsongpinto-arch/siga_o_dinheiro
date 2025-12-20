export interface Discussion {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Reply[];
}

export interface Reply {
  id: string;
  discussionId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: number;
}
