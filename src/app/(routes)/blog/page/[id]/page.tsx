import { getBlog } from "@/app/data/blog/get-blog";
import React, { Suspense } from "react";
import DiscoverBlog from "./DiscoverBlog";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/page/${id}`;

  return {
    title: `Discover Blog on Page ${id}`,
    description: `Discover all blog on this website here`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url: url,
      title: `Discover Blog on Page ${id}`,
      description: `Discover all blog on this website here`,
      images: [
        {
          url: `/site-log.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const AllBlogPage = async (props: PageProps) => {
  const { id } = await props.params;
  const currentPage = Number(id) || 1;
  const POSTS_PER_PAGE = 12;
  const skip = (currentPage - 1) * POSTS_PER_PAGE;
  const blog_post = await getBlog(skip, POSTS_PER_PAGE);
  const total_posts = await prisma.post.count();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiscoverBlog blog_post={blog_post} id={id} total_posts={total_posts} />
    </Suspense>
  );
};

export default AllBlogPage;
