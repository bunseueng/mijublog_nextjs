import React, { Suspense } from "react";
import SingleBlog from "./SingleBlog";
import {
  getBlogById,
  getComment,
  getSavedPost,
} from "@/app/data/blog/get-blog";
import { getUsers } from "@/app/data/user/get-users";
import { CommentType } from "@/types/Comment";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const blog = await getBlogById(id);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog?.id}`;

  return {
    title: `${blog?.metaTitle || blog?.title}`,
    description: `${blog?.metaDescription || blog?.excerpt}`,
    keywords: blog?.tags.map((t) => t.tag.name),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: blog?.metaTitle || blog?.title,
      description: `${blog?.metaDescription || blog?.excerpt}`,
      images: [
        {
          url: `${blog?.featuredImage}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const BlogPost = async (props: PageProps) => {
  const { id } = await props.params;
  const blog_post = await getBlogById(id);
  const comments = await getComment(blog_post?.id as string);
  const currentUser = await auth.api.getSession({ headers: await headers() });
  const savedPosts = await getSavedPost(currentUser?.user?.id as string);
  const users = await getUsers();
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <SingleBlog
          blog_post={blog_post}
          initial_comment={comments as CommentType[]}
          users={users}
          savedPosts={savedPosts}
        />
      </Suspense>
    </div>
  );
};

export default BlogPost;
