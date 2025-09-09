"use client";

import { BlogPost, SavedPost, User } from "@/types/BlogPost";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { exampleTheme } from "@/components/editor/EditorWrapper";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ImageNode } from "@/nodes/ImageNode";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { Icon } from "@iconify/react/dist/iconify.js";
import { MessageCircle, Tag } from "lucide-react";
import { toast } from "sonner";
import CommentSection from "./CommentSection";
import { CommentType } from "@/types/Comment";
import { CommentForm } from "./CommentForm";
import { commentTree } from "@/lib/commentTree";
import { authClient } from "@/lib/auth-client";
import { useBlogRoom } from "@/hooks/useBlogRoom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { YouTubeNode } from "@/nodes/YoutubeNode";
import LinkPlugin from "@/components/plugins/LinkPlugin";

interface SingleBlogProps {
  blog_post: BlogPost | null;
  initial_comment: CommentType[];
  users: User[];
  savedPosts: SavedPost[];
}

const SingleBlog = ({
  blog_post,
  initial_comment,
  users,
  savedPosts,
}: SingleBlogProps) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme: exampleTheme,
    editorState: blog_post?.content,
    editable: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => console.error(error),
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
      YouTubeNode,
    ],
  };
  const [comments, setComments] = useState<CommentType[]>(
    commentTree(initial_comment)
  );
  const [blogLike, setBlogLike] = useState(blog_post?.likes || []);
  const [savedPost, setSavedPost] = useState(savedPosts);
  const { data: session } = authClient.useSession();
  const socket = useBlogRoom(blog_post?.id);
  const path = usePathname();
  const currentUserLike = blogLike.find(
    (like) => like.userId === session?.user.id
  );
  const hasLike = !!currentUserLike;
  const owner = session?.user.id === blog_post?.authorId;

  const addReplyToComment = useCallback(
    (
      comments: CommentType[],
      newComment: CommentType,
      parentId: string
    ): CommentType[] => {
      return comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment],
          };
        } else if (comment.replies) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies, newComment, parentId),
          };
        }
        return comment;
      });
    },
    []
  );

  const removeCommentFromComments = useCallback(
    (comments: CommentType[], commentId: string): CommentType[] => {
      return comments
        .filter((com) => com.id !== commentId)
        .map((comment) => ({
          ...comment,
          replies: comment.replies
            ? removeCommentFromComments(comment.replies, commentId)
            : [],
        }));
    },
    []
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("new_comment", (comment) => {
      if (comment?.parentId) {
        setComments((prev) =>
          addReplyToComment(prev, comment, comment.parentId)
        );
      } else {
        setComments((prev) => [comment, ...prev]);
      }
    });

    socket.on("delete_comment", (comment) => {
      setComments((prev) => removeCommentFromComments(prev, comment.id));
    });

    socket.on("blog_like", (like) => {
      setBlogLike((prev) => {
        if (prev.find((l) => l.id === like.id)) return prev;
        return [...prev, like];
      });
    });

    socket.on("blog_unlike", (unlike) => {
      setBlogLike((prev) => prev.filter((l) => l.id !== unlike.id));
    });

    socket.on("blog:save-post", (saved_post) => {
      setSavedPost((prev) => [...prev, saved_post]);
    });

    socket.on("blog:delete-post", (saved_post) => {
      setSavedPost((prev) => prev.filter((p) => p.id !== saved_post.id));
    });

    return () => {
      socket.off("new_comment");
      socket.off("delete_comment");
      socket.off("blog_like");
      socket.off("blog_unlike");
      socket.off("blog:save-post");
      socket.off("blog:delete-post");
    };
  }, [comments, socket, addReplyToComment, removeCommentFromComments]);

  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      if (!socket) {
        return;
      }
      const res = await fetch(`/api/blogs/${blog_post?.id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          parentId: parentId,
        }),
      });
      const data = await res.json();
      const newComment = data.replyComment;
      if (res.status === 200) {
        socket.emit("new_comment", { ...newComment, postId: blog_post?.id }); // <-- emit only new comment
        if (parentId) {
          // Add as reply to existing comment
          setComments((prev) => addReplyToComment(prev, newComment, parentId));
        } else {
          setComments((prev) => [newComment, ...prev]);
        }
        toast("Comment posted sucessfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(`/api/blogs/${blog_post?.id}/comment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentId }),
      });

      const data = await res.json();

      if (res.status === 404) {
        toast.error("Unauthorized");
      } else {
        socket?.emit("delete_comment", {
          ...data.deleteComment,
          blogId: blog_post?.id,
        });
        setComments((prev) => removeCommentFromComments(prev, commentId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!socket) {
      return;
    }
    try {
      if (hasLike) {
        const res = await fetch(`/api/blogs/${blog_post?.id}/like`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const unlike_data = await res.json();

        socket.emit("blog_unlike", unlike_data.unlike);
        setBlogLike((prev) =>
          prev.filter((l) => l.userId !== session?.user.id)
        );
        return res;
      }
      const res = await fetch(`/api/blogs/${blog_post?.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.status === 404) {
        toast.error("Unauthorized");
      } else {
        socket.emit("blog_like", data.like);
        setBlogLike((prev) => [...prev, data.like]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const isSavedPostExist = savedPost.find(
        (p) => p.postId === blog_post?.id && p.userId === session?.user.id
      );

      if (isSavedPostExist) {
        const res = await fetch(`/api/blogs/${blog_post?.id}/saved-post`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.status === 404) {
          toast.error("Unauthorized");
        } else if (res.status === 200) {
          toast("Successfully deleting this post.");
          socket?.emit("blog:delete-post", data.deleting_post);
          setSavedPost((prev) =>
            prev.filter((p) => p.id !== data.deleting_post.id)
          );
        }

        return data;
      }

      const res = await fetch(`/api/blogs/${blog_post?.id}/saved-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.status === 404) {
        toast.error("Unauthorized");
      } else if (res.status === 200) {
        toast("Successfully savign this post.");
        socket?.emit("blog:save-post", data.saved_post);
        setSavedPost((prev) => [...prev, data.saved_post]);
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyLink = async () => {
    const linkToCopy = `${window.location.origin}${path}#${blog_post?.id}`;

    try {
      // Use the modern Clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(linkToCopy);
        toast.success("Link copied to clipboard!");
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = linkToCopy;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
          toast.success("Link copied to clipboard!");
        } catch (err) {
          console.error(err, "Failed to copy link");
        } finally {
          textArea.remove();
        }
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    }
  };

  useEffect(() => {
    if (blog_post?.slug) {
      fetch(`/api/page-views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: blog_post.slug, postId: blog_post.id }),
      });
    }
  }, [blog_post?.id, blog_post?.slug]);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollWidth(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-orange-500"
          style={{ width: `${scrollWidth}%` }}
        ></div>
      </div>
      <div className="w-full lg:w-[80%] xl:w-[70%] mx-auto space-y-4 md:space-y-6 bg-white dark:bg-background border border-white dark:border-transparent shadow-lg rounded-t-lg">
        <Image
          src={blog_post?.featuredImage ?? "/default-pf.jpg"}
          alt="Blog Image"
          width={10000}
          height={400}
          quality={100}
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-t-lg"
        />
        <div className="px-3 sm:px-4 md:px-6 dark:px-0 space-y-4 md:space-y-6 lg:space-y-8">
          <div className="flex items-center flex-wrap gap-2">
            <span className="bg-blue-400 border border-blue-300 text-white px-2 py-1 text-xs sm:text-sm rounded-full">
              {blog_post?.category?.name}
            </span>
          </div>
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {blog_post?.title}
          </h1>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 my-4 md:my-6">
            {blog_post?.tags.map((tag) => (
              <Link
                key={tag.id}
                className="inline-flex items-center px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                href={`/tags/${tag.tag.slug}`}
              >
                <Tag className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                <span>{tag.tag.name}</span>
              </Link>
            ))}
          </div>
          <p className="scroll-m-20 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-200 font-semibold leading-relaxed">
            {blog_post?.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <Icon
                icon="tabler:calendar-week"
                width="16"
                height="16"
                className="sm:w-6 sm:h-6"
              />
              <p className="text-xs md:text-sm">
                {blog_post?.createdAt.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <Icon
                icon="tabler:clock-hour-10"
                width="16"
                height="16"
                className="sm:w-6 sm:h-6"
              />
              <p className="text-xs md:text-sm">
                {blog_post?.readingTime} min, To Read
              </p>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <Icon
                icon="tabler:eye"
                width="16"
                height="16"
                className="sm:w-6 sm:h-6"
              />
              <p className="text-xs md:text-sm">{blog_post?.viewCount} views</p>
            </div>
          </div>

          {/* Profile */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 md:pb-6 border-b border-gray-200 dark:border-b-0">
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={blog_post?.author.image ?? "/default-pf.jpg"}
                      alt={`${blog_post?.author.name} Avatar`}
                      width={100}
                      height={100}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-200">
                      {blog_post?.author.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      @{blog_post?.author.name}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    title="Like"
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-black dark:text-white hover:text-red-600 hover:bg-red-50 dark:hover:text-black rounded-lg transition-colors group cursor-pointer"
                    onClick={handleLike}
                  >
                    <Icon
                      icon="tabler:heart"
                      width="16"
                      height="16"
                      className={`group-hover:scale-110 transition-transform ${
                        blogLike.length > 0 ? "text-red-400" : ""
                      } sm:w-5 sm:h-5`}
                    />
                    <span className="text-xs sm:text-sm font-medium dark:hover:text-black">
                      {blogLike.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Save"
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-black rounded-lg transition-colors group cursor-pointer"
                    onClick={handleSave}
                  >
                    <Icon
                      icon="tabler:bookmark"
                      width="16"
                      height="16"
                      className="group-hover:scale-110 transition-transform sm:w-5 sm:h-5"
                    />
                    <span className="text-xs sm:text-sm font-medium hidden md:inline">
                      {savedPost.length > 0 ? "Saved" : "Save"}
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Share"
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors group dark:hover:text-black cursor-pointer"
                    onClick={handleCopyLink}
                  >
                    <Icon
                      icon="tabler:share"
                      width="16"
                      height="16"
                      className="group-hover:scale-110 transition-transform sm:w-5 sm:h-5"
                    />
                    <span className="text-xs sm:text-sm font-medium hidden md:inline">
                      Share
                    </span>
                  </button>
                  {owner && (
                    <Link
                      href={`/blog/${blog_post?.slug}/edit`}
                      title="Edit"
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 dark:text-gray-200 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors group dark:hover:text-black cursor-pointer"
                    >
                      <Icon
                        icon="mingcute:edit-4-line"
                        width="24"
                        height="24"
                      />
                      <span className="text-xs sm:text-sm font-medium hidden md:inline">
                        Edit
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="focus:outline-none cursor-text min-h-[calc(40vh-80px)] sm:min-h-[calc(50vh-80px)] text-sm sm:text-base leading-relaxed"
                  aria-placeholder="Enter some text..."
                  placeholder={
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-gray-400 pointer-events-none text-sm sm:text-base">
                      Enter some text...
                    </div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            <LinkPlugin hasLinkAttributes={true} />
          </LexicalComposer>
        </div>

        {/* Coment */}
        <div className="px-3 sm:px-4 md:px-6">
          <div className="pb-4 sm:pb-6 md:pb-8 pt-4 sm:pt-6 md:pt-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4 sm:mb-6 flex items-center">
              <Icon
                icon="tabler:message-circle-down"
                width="20"
                height="20"
                className="mr-2"
              />
              Comments
            </h3>
          </div>

          {/* Add Comment */}
          <div className="mb-6 sm:mb-8">
            <CommentForm
              onSubmit={(content: string) => handleAddComment(content)}
            />
            {/* Comments list */}
            <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8 md:mt-10">
              {comments.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <CommentSection
                    key={index}
                    comment={comment}
                    users={users}
                    onReply={handleAddComment}
                    onDelete={handleDelete}
                    // onLike={() => handleLikeComment(comment.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
