import React, { Suspense } from "react";
import Category from "./Category";
import { getBlog, getCategories } from "@/app/data/blog/get-blog";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const categories = await getCategories();
  const displayedCategory = categories.map((c) => c.name);

  return {
    title: `Discover Blog by Categories`,
    description: `Discover Blog by Categories`,
    keywords: [`${displayedCategory}`],
    alternates: {
      canonical: `${process.env.BASE_URL}/category`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.BASE_URL}/category`,
      title: `Discover Blog by Categories`,
      description: `Discover Blog by Categories`,
    },
  };
}

const CategoryPage = async () => {
  const categories = await getCategories();
  const blog_post = await getBlog();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Category categories={categories} blog_post={blog_post} />
    </Suspense>
  );
};

export default CategoryPage;
