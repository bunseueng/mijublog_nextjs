"use client";

import FeatureBlog from "@/components/home/FeatureBlog";
import PaginationBlock from "@/components/home/PaginationBlock";
import { BlogPost } from "@/types/BlogPost";
import React from "react";

interface DiscoverBlogProps {
  blog_post: BlogPost[];
  id: string;
  total_posts: number;
}

const POSTS_PER_PAGE = 12;

const DiscoverBlog = ({ blog_post, id, total_posts }: DiscoverBlogProps) => {
  const total_page = Math.ceil(total_posts / POSTS_PER_PAGE);
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <FeatureBlog blog_post={blog_post} />
      </div>
      <PaginationBlock id={id} total_page={total_page} />
    </div>
  );
};

export default DiscoverBlog;
