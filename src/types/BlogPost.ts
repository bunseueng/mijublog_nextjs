import { Category, Like, Post, PostStatus, Prisma, Tag, User } from "../../prisma/generated/prisma"

export type PostWithRelations = Post & {
  author: User
  category: Category | null
  tags: (PostTag & { tag: Tag })[]
  comments: CommentWithAuthor[]
  likes: Like[]
  _count: {
    comments: number
    likes: number
  }
}

export type PostTag = {
  id: string
  postId: string
  tagId: string
  tag: Tag
}

export type SavedPost = Prisma.SavedPostGetPayload<{
  include: {
    post: true
  }
}>

export type CommentWithAuthor = Comment & {
  author: User
  replies: CommentWithAuthor[]
}

export type CreatePostData = {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: PostStatus
  categoryId?: string
  tagIds: string[]
  metaTitle?: string
  metaDescription?: string
}

export type UpdatePostData = Partial<CreatePostData> & {
  id: string
}

export type BlogPost = Prisma.PostGetPayload<{
  include: {
    author: true;
    category: true;
    tags: { include: { tag: true } };
    likes: true
  };
}>;

export type UserType = Prisma.UserGetPayload<{
  include: {
    followers: true,
    following: true,
  }
}>

export { PostStatus, type Post, type User, type Category, type Tag,  type Like }