import React, { Suspense } from "react";
import { getBlog } from "@/app/data/blog/get-blog";
import FeatureBlog from "@/components/home/FeatureBlog";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;

  return {
    title: `${id} | Category`,
    description: `Discover Blog by Tags`,
    keywords: [`${id}`],
    alternates: {
      canonical: `${process.env.BASE_URL}/tags/${id}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.BASE_URL}/tags/${id}`,
      title: `${id} | Category`,
      description: `Discover Blog by Tags`,
    },
  };
}

const TagsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const blogs = await getBlog();
  const filteredBlogs = blogs.filter((b) =>
    b.tags.find((t) => t.tag.slug.includes(id))
  );
  return (
    <div className="container mx-auto px-8">
      <Suspense
        fallback={
          <div className="animate animate-pulse transform duration-300">
            Loading...
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <FeatureBlog blog_post={filteredBlogs} />
        </div>
      </Suspense>
    </div>
  );
};

export default TagsPage;
