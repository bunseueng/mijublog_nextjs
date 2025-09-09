"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BlogPost, SavedPost, User, UserType } from "@/types/BlogPost";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/provider/SocketProvider";
import { authClient } from "@/lib/auth-client";
import PostCard from "./PostCard";
import React from "react";

interface ProfileComponentProps {
  blogs: BlogPost[];
  user_data: User;
  currentUser_followers: UserType[];
  following: UserType[];
  savedPosts: SavedPost[];
}

const ProfileComponent = ({
  blogs,
  user_data,
  currentUser_followers,
  following,
  savedPosts,
}: ProfileComponentProps) => {
  const [blogItems, setBlogItems] = useState<BlogPost[] | undefined>(undefined);
  const [follower, setFollower] = useState(currentUser_followers);
  const [loading, setLoading] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const { data: session } = authClient.useSession();
  const recent_posts = blogs.filter((b) => b.authorId === user_data?.id);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const socket = useSocket();
  const postsPerPage = 1; // Show 1 post per load
  const filteredSavedPost = savedPosts.map((s) =>
    blogs.filter((b) => b.id === s.postId)
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("profile:follower", (follower) => {
      setFollower((prev) => [follower, ...prev]);
    });

    socket.on("profile:unfollow", (unfollow) => {
      setFollower((prev) =>
        prev.filter((p) => p.followers?.filter((f) => f.id !== unfollow.id))
      );
    });

    return () => {
      socket.off("profile:follower");
      socket.off("profile:unfollow");
    };
  }, [socket]);

  useEffect(() => {
    if (user_data && blogs) {
      const recent_posts = blogs.filter((b) => b.authorId === user_data?.id);
      // Initially load only the first post
      const initialPosts = recent_posts.slice(0, postsPerPage);
      setBlogItems(initialPosts);
      setHasMorePosts(recent_posts.length > postsPerPage);
    }
  }, [blogs, user_data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loading && hasMorePosts) {
          setLoading(true);
          await new Promise((r) => setTimeout(r, 1500));

          // Calculate next page
          const nextPage = currentPage + 1;
          const startIndex = nextPage * postsPerPage;
          const endIndex = startIndex + postsPerPage;

          // Get the next batch of posts
          const nextPosts = recent_posts.slice(startIndex, endIndex);

          if (nextPosts.length > 0) {
            setBlogItems((prev) => [...(prev || []), ...nextPosts]);
            setCurrentPage(nextPage);

            // Check if there are more posts to load
            if (endIndex >= recent_posts.length) {
              setHasMorePosts(false);
            }
          } else {
            setHasMorePosts(false);
          }

          setLoading(false);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, hasMorePosts, currentPage, recent_posts]);

  const onFollow = async () => {
    try {
      setIsFollowed(true);
      if (follower.length > 0) {
        const res = await fetch(`/api/follow`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user_data?.id }),
        });
        const data = await res.json();

        if (res.status === 200) {
          toast("Successfully unfollowing this user");
          socket?.emit("profile:unfollow", data.unfollow);
        } else if (res.status === 404) {
          toast.error("Unauthorized");
        }

        return data;
      }
      const res = await fetch(`/api/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user_data?.id }),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast("Successfully following this user");
        socket?.emit("profile:follower", data.follow);
      } else if (res.status === 404) {
        toast.error("Unauthorized");
      }

      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsFollowed(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Avatar className="w-20 h-20 mx-auto mb-6 text-center">
            <AvatarImage
              src={user_data?.image || "/placeholder.svg"}
              alt={user_data?.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-bold">
              {user_data?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">
            {user_data?.name}
          </h1>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Icon
                icon="material-symbols:verified-user-outline-rounded"
                width="24"
                height="24"
              />
              <span>
                {user_data?.role
                  ? user_data.role.charAt(0).toUpperCase() +
                    user_data.role.slice(1)
                  : "User"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>
                Joined{" "}
                {new Date(user_data?.createdAt ?? "").toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                  }
                )}
              </span>
            </div>
          </div>

          {/* Following/Follower */}
          <div className="flex justify-center gap-4 mb-8">
            <Badge>Follower: {follower.length}</Badge>
            <Badge>Following: {following.length}</Badge>
          </div>

          {user_data.id !== session?.user.id && (
            <Button
              className={`px-8 py-2 ${
                isFollowed && "animate animate-pulse transform duration-300"
              }`}
              onClick={onFollow}
            >
              {isFollowed
                ? follower?.length > 0
                  ? "Unfollowing..."
                  : "Following..."
                : follower?.length > 0
                ? "Unfollow"
                : "Follow"}
            </Button>
          )}
        </div>

        {/* Bio Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {user_data?.description ||
                "Welcome to my blog! I'm passionate about sharing knowledge and experiences through writing."}
            </p>
          </CardContent>
        </Card>

        {/* Tabbed Navigation */}
        <div className="mb-8">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "posts"
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Posts ({blogItems && blogItems.length})
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === "saved"
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved ({filteredSavedPost.length})
            </button>
          </div>
        </div>

        <div className="mb-12" ref={loaderRef}>
          {/* Conditional Content Based on Active Tab */}
          <div className="mb-12">
            {activeTab === "posts" && (
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-balance">
                  My Posts
                </h2>
                {recent_posts.length > 0 ? (
                  <div className="grid gap-6">
                    {blogItems?.map((post) => (
                      <PostCard post={post} key={post.id} />
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          No Posts Yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          This user hasn&apos;t published any blog posts yet.
                          Check back later for new content!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {activeTab === "saved" && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-balance">
                Saved Posts
              </h2>
              {savedPosts.length > 0 ? (
                <div className="grid gap-6">
                  {savedPosts?.map((post) => {
                    const filteredPost = blogs.filter(
                      (b) => b.id === post.postId
                    );
                    return (
                      <React.Fragment key={post.id}>
                        {filteredPost.map((p) => (
                          <PostCard post={p} key={p.id} />
                        ))}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="max-w-md mx-auto">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No Posts Yet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        This user hasn&apos;t published any blog posts yet.
                        Check back later for new content!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* loading */}
        {hasMorePosts && (
          <div className="flex items-center justify-center">
            <Icon
              icon="mingcute:loading-fill"
              width="24"
              height="24"
              className={`animate animate-spin transform duration-300 mb-4`}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-border">
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-accent transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Contact
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            © 2024 {user_data?.name}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ProfileComponent;
