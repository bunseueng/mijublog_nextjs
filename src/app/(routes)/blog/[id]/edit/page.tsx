import { Suspense } from "react";
import { PostEditForm } from "./PostEditorForm";
import { getBlogById, getCategories } from "@/app/data/blog/get-blog";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id);
  const url = `${process.env.BASE_URL}/blog/${blog?.id}/edit`;

  return {
    title: `Edit ${blog?.metaTitle || blog?.title}`,
    description: `${blog?.metaDescription || blog?.excerpt}`,
    keywords: blog?.metaTitle || blog?.title,
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

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogById(id);
  const categories = await getCategories();
  const user = await auth.api.getSession({ headers: await headers() });
  const owner = user?.user.id === post?.authorId;

  // Not owner → show message
  if (!owner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            You don&apos;t have permission to edit this post.
          </p>
        </div>
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Post Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            The post you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Owner + post exists → render form
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Edit Post
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Update your Chinese drama blog post
            </p>
          </div>

          <Suspense
            fallback={
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="animate-pulse space-y-6">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            }
          >
            <PostEditForm post={post} categories={categories} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
