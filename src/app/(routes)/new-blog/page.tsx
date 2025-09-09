import EditorWrapper from "@/components/editor/EditorWrapper";
import React from "react";
import { Metadata } from "next";
import { getCategories } from "@/app/data/blog/get-blog";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Create new blog`,
    alternates: {
      canonical: `${process.env.BASE_URL}/new-blog`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.BASE_URL}/new-blog`,
      title: `Create new blog`,
    },
  };
}

const NewBlogPost = async () => {
  const categories = await getCategories();
  return (
    <div className="my-10">
      <EditorWrapper
        blog_db={null}
        setFormData={undefined}
        categories={categories}
      />
      ;
    </div>
  );
};

export default NewBlogPost;
