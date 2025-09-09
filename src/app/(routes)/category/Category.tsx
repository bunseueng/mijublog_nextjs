"use client";

import FeatureBlog from "@/components/home/FeatureBlog";
import { BlogPost, type Category } from "@/types/BlogPost";
import { Icon } from "@iconify/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CategoryProps {
  categories: Category[];
  blog_post: BlogPost[];
}

const Category = ({ categories, blog_post }: CategoryProps) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const all_categories = [
    {
      id: "all",
      name: "All",
      description: "All",
      color: "#62748e",
      slug: "all",
    },
    ...categories,
  ];
  const filteredBlog = blog_post.filter(
    (blog) => blog.category?.name === selectedCategory
  );

  const handleSelectedCategory = (id: string) => {
    if (id === "All") {
      setSelectedCategory("All");
    } else {
      setSelectedCategory(id);
    }
  };

  useEffect(() => {
    if (query) {
      setSelectedCategory(query);
    }
  }, [query]);

  return (
    <div className="container mx-auto mt-14 px-8">
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
        {all_categories.map((category) => (
          <div
            className="border border-gray-100 rounded-full py-1 px-3 text-sm hover:bg-gray-200 transform duration-300 shadow-sm cursor-pointer"
            style={{
              backgroundColor:
                selectedCategory === category.name
                  ? `${category.color}`
                  : "#ffff",
              color: selectedCategory === category.name ? "#ffff" : "#000",
            }}
            key={category.id}
            onClick={() => handleSelectedCategory(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2 w-full h-10 my-10">
        <div className="border-l-5 rounded-full border-l-orange-500 h-full"></div>
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          {selectedCategory} Articles (
          <span>
            {selectedCategory === "All"
              ? blog_post.length
              : filteredBlog.length}
          </span>
          )
        </h3>
      </div>
      {selectedCategory === "All" || filteredBlog.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <FeatureBlog
            blog_post={selectedCategory === "All" ? blog_post : filteredBlog}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center mt-24">
          <div className="flex flex-col items-center">
            <Icon icon="tabler:tag-filled" width="50" height="50" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No {selectedCategory} Articles Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We&apos;re working on bringing you great content in this category.
              Check back soon or explore other categories in the meantime.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Icon icon="tabler:arrow-right" width="24" height="24" />
              Browse All Articles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
