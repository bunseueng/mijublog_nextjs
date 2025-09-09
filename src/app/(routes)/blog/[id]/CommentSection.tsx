import { User } from "@/types/BlogPost";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { CommentType } from "@/types/Comment";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./CommentForm";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocket } from "@/provider/SocketProvider";
import { CommentLike } from "../../../../../prisma/generated/prisma";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface CommentItemProps {
  comment: CommentType;
  onReply: (content: string, parentId?: string) => void;
  onDelete: (commentId: string) => void;
  users: User[];
  depth?: number;
}

const CommentSection = ({
  comment,
  users,
  onReply,
  onDelete,
  depth = 0,
}: CommentItemProps) => {
  const getAuthor = (authorId: string) => {
    return users.find((user) => user.id === authorId);
  };
  const user = authClient.useSession();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [like, setLike] = useState<CommentLike[]>(comment?.likes || []);
  const [isLiking, setIsLiking] = useState(false); // Prevent double clicks
  const maxDepth = 100; // Limit nesting depth
  const canReply = depth < maxDepth;
  const socket = useSocket();
  const path = usePathname();

  // Check if current user has liked this comment
  const currentUserLike = like.find((l) => l.userId === user.data?.user?.id);
  const hasLiked = !!currentUserLike;
  const isOldLike = like.filter((l) => l?.commentId === comment?.id);
  const isOwnerComment = user.data?.user?.id === comment?.authorId;

  useEffect(() => {
    if (!socket) return;

    const handleLike = (newLike: CommentLike) => {
      // Only update if it's for this comment
      if (newLike.commentId === comment.id) {
        setLike((prev) => {
          // Avoid duplicates
          if (prev.find((l) => l.id === newLike.id)) return prev;
          return [...prev, newLike];
        });
      }
    };

    const handleUnlike = (removedLike: CommentLike) => {
      // Only update if it's for this comment
      if (removedLike.commentId === comment.id) {
        setLike((prev) => prev.filter((l) => l.id !== removedLike.id));
      }
    };

    socket.on("like", handleLike);
    socket.on("unlike", handleUnlike);

    return () => {
      socket.off("like", handleLike);
      socket.off("unlike", handleUnlike);
    };
  }, [socket, comment?.id]);

  const handleReply = (content: string) => {
    onReply(content, comment?.id);
    setShowReplyForm(false);
  };

  const handleLike = async () => {
    if (isLiking || !user.data?.user?.id) return;

    setIsLiking(true);

    try {
      if (!socket) {
        return;
      }

      if (hasLiked) {
        // UNLIKE
        const response = await fetch(`/api/comment/${comment.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to unlike");
        }

        const data = await response.json();

        // Update local state immediately for responsiveness
        setLike((prev) => prev.filter((l) => l.userId !== user.data?.user?.id));

        // Emit socket event
        socket.emit("unlike", data.unlike);
      } else {
        // LIKE
        const response = await fetch(`/api/comment/${comment.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 400 && errorData.alreadyLiked) {
            // Handle case where user already liked (race condition)
            return;
          }
          throw new Error(errorData.message || "Failed to like");
        }

        const data = await response.json();

        // Update local state immediately for responsiveness
        setLike((prev) => [...prev, data.likes]);

        // Emit socket event
        socket.emit("like", data.likes);
      }
    } catch (error) {
      console.error("Like/Unlike error:", error);

      // Revert optimistic update on error
      if (hasLiked) {
        setLike((prev) => [...prev, currentUserLike!]);
      } else {
        setLike((prev) => prev.filter((l) => l.userId !== user.data?.user?.id));
      }

      alert("Failed to update like status. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopyLink = async () => {
    const linkToCopy = `${window.location.origin}${path}#${comment.id}`;

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

  return (
    <div
      id={comment?.id}
      className={`h-full ${
        depth === 1 || depth === 2
          ? "border-l-2 border-l-gray-200 pl-2 sm:pl-4"
          : ""
      }`}
      style={{
        marginLeft: depth === 1 || depth === 2 ? depth * 32 : 0,
      }} // 16px per level
    >
      <div className="flex gap-2 sm:gap-3">
        <div
          className={`relative flex shrink-0 overflow-hidden ${
            depth > 1 ? "flex-col items-center" : ""
          }`}
        >
          <Image
            src={getAuthor(comment?.authorId)?.image ?? "/default-pf.jpg"}
            alt="User Profile"
            width={100}
            height={1000}
            quality={100}
            className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-full mb-1 sm:mb-2"
          />
          {depth > 1 && (
            <div className="border-l-2 border-l-gray-200 pt-12 sm:pt-20"></div>
          )}
        </div>
        <div className="flex-1 space-y-1 sm:space-y-2">
          <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
              <p className="text-xs sm:text-sm md:text-base font-semibold truncate">
                {getAuthor(comment?.authorId)?.name}
              </p>
              <p className="text-xs sm:text-xs md:text-sm text-gray-500">
                {moment.utc(comment?.createdAt).fromNow()}
              </p>
            </div>

            {/* Actions Dropdown */}
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="border-0 hover:bg-gray-100 h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Icon
                      icon="mingcute:more-1-line"
                      width="16"
                      height="16"
                      className="sm:w-5 sm:h-5"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-40 sm:w-56 border-0"
                  align="end"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="w-full focus:bg-gray-100 dark:focus:bg-gray-400 dark:focus:text-black cursor-pointer text-xs sm:text-sm"
                      onClick={handleCopyLink}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Icon
                          icon="mingcute:copy-2-line"
                          width="14"
                          height="14"
                          className="sm:w-4 sm:h-4"
                        />
                        Copy link
                      </div>
                    </DropdownMenuItem>
                    {isOwnerComment && (
                      <DropdownMenuItem
                        className="focus:bg-gray-100 dark:focus:bg-gray-400 dark:focus:text-black cursor-pointer text-red-600 text-xs sm:text-sm"
                        onClick={() => onDelete(comment?.id as string)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Icon
                            icon="mingcute:delete-2-line"
                            width="14"
                            height="14"
                            className="sm:w-4 sm:h-4"
                          />
                          Delete
                        </div>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Comment text */}
          <p className="text-xs sm:text-sm leading-relaxed break-words">
            {comment?.content}
          </p>
          {/* Actions */}
          {canReply && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                type="button"
                title="Like"
                className="bg-transparent text-black outline-none border-0 ring-0 shadow-none hover:bg-transparent px-0 h-auto py-1 text-xs sm:text-sm"
                onClick={handleLike}
              >
                <Icon
                  icon="mingcute:heart-line"
                  width="16"
                  height="16"
                  className={`${
                    isOldLike && isOldLike.length > 0
                      ? "text-red-500"
                      : "text-black dark:text-white"
                  } sm:w-5 sm:h-5`}
                />
                <span className="ml-1">{isOldLike.length || 0}</span>
              </Button>
              <Button
                type="button"
                title="Reply"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="bg-transparent text-black dark:text-white font-normal outline-none border-0 ring-0 shadow-none hover:bg-gray-100 h-auto py-1 px-2 text-xs sm:text-sm"
              >
                <Icon
                  icon="mingcute:message-3-line"
                  width="16"
                  height="16"
                  className="sm:w-5 sm:h-5 mr-1"
                />
                Reply
              </Button>
              {comment?.replies && comment?.replies?.length > 0 && (
                <Button
                  type="button"
                  title={`${showReplies ? "Hide Reply" : "Show Reply"}`}
                  onClick={() => setShowReplies(!showReplies)}
                  className="bg-transparent text-black dark:text-white font-normal outline-none border-0 ring-0 shadow-none hover:bg-gray-100 h-auto py-1 px-2 text-xs sm:text-sm"
                >
                  {showReplies ? "Hide" : "Show"} {comment?.replies.length}{" "}
                  {comment?.replies.length === 1 ? "Reply" : "Replies"}
                </Button>
              )}
            </div>
          )}
          {showReplyForm && (
            <div className="mt-2 sm:mt-3">
              <CommentForm
                onSubmit={handleReply}
                onCancel={() => setShowReplyForm(false)}
                showCancel
              />
            </div>
          )}

          {/* Nested Replies */}
          {depth < 1 &&
            showReplies &&
            comment?.replies &&
            comment?.replies.length > 0 && (
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {comment?.replies.map((reply, index) => {
                  return (
                    <CommentSection
                      key={index}
                      comment={reply}
                      onReply={onReply}
                      onDelete={onDelete}
                      depth={depth + 1}
                      users={users}
                    />
                  );
                })}
              </div>
            )}
        </div>
      </div>
      {depth > 0 &&
        showReplies &&
        comment?.replies &&
        comment?.replies.length > 0 && (
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {comment?.replies.map((reply, index) => {
              return (
                <CommentSection
                  key={index}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  depth={depth + 1}
                  users={users}
                />
              );
            })}
          </div>
        )}
    </div>
  );
};

export default CommentSection;
