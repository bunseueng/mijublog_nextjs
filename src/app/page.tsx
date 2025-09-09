import {
  getBlog,
  getPopularBlogs,
  getPopularMonthlyBlogs,
} from "./data/blog/get-blog";
import FeatureBlog from "@/components/home/FeatureBlog";
import { Suspense } from "react";
import PaginationBlock from "@/components/home/PaginationBlock";
import prisma from "@/lib/prisma";
import PopularPosts from "@/components/home/PopularPost";

export default async function Home() {
  const blog_post = await getBlog();
  const total_posts = await prisma.post.count();
  const POSTS_PER_PAGE = 12;
  const total_page = Math.ceil(total_posts / POSTS_PER_PAGE);
  // Try to get popular posts from current month first
  let popularPosts = await getPopularMonthlyBlogs(4);

  // If no posts from current month, get all-time popular posts
  if (popularPosts.length === 0) {
    popularPosts = await getPopularBlogs(4);
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Side - Main Blog Posts */}
            <div className="w-full lg:w-[70%]">
              <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Latest Posts
                </h2>
                <p className="text-muted-foreground">
                  Discover the newest Chinese drama reviews and insights
                </p>
              </div>
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-lg h-48 mb-4"></div>
                        <div className="bg-muted rounded h-4 mb-2"></div>
                        <div className="bg-muted rounded h-4 w-3/4"></div>
                      </div>
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <FeatureBlog blog_post={blog_post} />
                </div>
              </Suspense>
            </div>

            {/* Right Side - Popular Posts */}
            <div className="w-full lg:w-[30%]">
              <div className="sticky top-8">
                <Suspense
                  fallback={
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="bg-muted rounded w-6 h-6"></div>
                        <div className="bg-muted rounded h-6 w-32"></div>
                      </div>
                      <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex gap-4">
                              <div className="bg-muted rounded-lg w-[120px] h-[90px]"></div>
                              <div className="flex-1 space-y-2">
                                <div className="bg-muted rounded h-4"></div>
                                <div className="bg-muted rounded h-4 w-3/4"></div>
                                <div className="bg-muted rounded h-3 w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <PopularPosts popularPosts={popularPosts} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-12">
            <PaginationBlock id={"1"} total_page={total_page} />
          </div>
        </div>
      </div>
    </div>
  );
}
