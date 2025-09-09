export interface CommentType {
  id?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  postId: string;
  authorId: string;
  parentId?: string;
  
  // Relations
  post?: {
    id: string;
    title: string;
  };
  author?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  parent?: Comment;
  replies?: CommentType[];
  likes?: CommentLike[];
  
  // Computed fields (for UI)
  likeCount?: number;
  isLiked?: boolean;
}

export interface CommentLike {
  id: string;
  createdAt: Date;
  commentId: string;
  userId: string;
  
  // Relations
  comment?: Comment;
  user?: {
    id: string;
    name: string;
  };
}

export interface CommentFormData {
  content: string;
  parentId?: string;
}