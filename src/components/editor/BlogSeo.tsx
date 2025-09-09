import { Icon } from "@iconify/react/dist/iconify.js";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { Hash } from "lucide-react";
import React, { useEffect } from "react";
import { Input } from "../ui/input";
import { BlogPost } from "./Editor";
import Image from "next/image";
import { toast } from "sonner";
import { Category } from "@/types/BlogPost";

interface BlogSeoProps {
  words: number;
  setWords: (value: number) => void;
  minutes: number;
  setMinutes: (value: number) => void;
  blog: BlogPost;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setBlog: (value: any) => any;
  tagInput: string;
  setTagInput: (value: string) => void;
  preview: string;
  setPreview: (value: string) => void;
  categories: Category[];
}

const BlogSeo = ({
  words,
  setWords,
  minutes,
  setMinutes,
  blog,
  setBlog,
  tagInput,
  setTagInput,
  preview,
  setPreview,
  categories,
}: BlogSeoProps) => {
  const [editor] = useLexicalComposerContext();

  // Listen for words for getting reading time
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent().trim();
        const wordCount = text === "" ? 0 : text.split(/\s+/).length;
        const wordsPerMinute = 200;
        const minutes = Math.ceil(wordCount / wordsPerMinute);

        setWords(wordCount);
        setMinutes(minutes);
      });
    });
  }, [editor, setMinutes, setWords]);

  // generate slug from title
  useEffect(() => {
    if (blog.title) {
      const slug = blog.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBlog((prev: any) => ({ ...prev, slug }));
    }
  }, [blog.title, setBlog]);

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      const tag = tagInput.trim();
      if (tag && !blog.tags.includes(tag)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setBlog((prev: any) => ({ ...prev, tags: [...prev.tags, tag] }));
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setBlog((prev: any) => ({
      ...prev,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: prev.tags.filter((tag: any) => tag !== tagToRemove),
    }));
  };

  const transformFile = (file: Blob) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
    } else {
      setPreview("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // ✅ Condition: check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, PNG, and WebP images are allowed.");
        return;
      }

      // ✅ Condition: check file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error("File size should be less than 2MB.");
        return;
      }

      // ✅ Set preview
      setPreview(URL.createObjectURL(file));

      // ✅ Update blog featuredImage with file name instead of input value
      setBlog((prev: BlogPost) => ({
        ...prev,
        featuredImage: file.name,
      }));

      transformFile(file);
    }
  };

  return (
    <div className="w-full md:w-[30%] flex flex-col pl-5 space-y-4">
      {/* Status */}
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-gray-200 dark:border-0 p-6">
        <div className="space-y-4">
          <h4>Post Status</h4>
          <div className="flex items-center justify-between">
            <p className="text-lg text-slate-600 dark:text-slate-300">Status</p>
            <p className="border border-yellow-300 bg-yellow-300 text-white text-xs py-1 px-2 rounded-full">
              Draft
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg text-slate-600 dark:text-slate-300">Words</p>
            <p className="text-xs ">{words}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Reading time
            </p>
            <p className="text-xs flex items-center">
              <Icon icon="ri:timer-2-line" width="20" height="20" /> {minutes}{" "}
              min
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="bg-white dark:bg-card dark:border-0 rounded-xl shadow-sm border border-gray-200 p-6 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          Title
        </h3>
        <Input
          placeholder="Title of your blog"
          value={blog.title || ""}
          onChange={(e) =>
            setBlog((prev: BlogPost) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <span className="text-slate-400">
          Slug: <span>{blog.slug || "auto generated from title"}</span>
        </span>
      </div>

      {/*  Seo Title */}
      <div className="bg-white dark:bg-card dark:border-0 rounded-xl shadow-sm border border-gray-200 p-6 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          SEO Title
        </h3>
        <Input
          placeholder="Title of your blog"
          value={blog.metaTitle || ""}
          onChange={(e) =>
            setBlog((prev: BlogPost) => ({
              ...prev,
              metaTitle: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <span className="text-slate-400">
          Optional:{" "}
          <span>
            You can fill this field. If left empty, it will be auto-generated
            from the post title.
          </span>
        </span>
      </div>

      {/* SEO Description */}
      <div className="bg-white dark:bg-card dark:border-0 rounded-xl shadow-sm border border-gray-200 p-6 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          SEO Description
        </h3>
        <textarea
          placeholder="Write a brief summary..."
          value={blog.metaDescription || ""}
          onChange={(e) =>
            setBlog((prev: BlogPost) => ({
              ...prev,
              metaDescription: e.target.value,
            }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <span>
          You can fill this field. If left empty, it will be auto-generated from
          the post excerpt.
        </span>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-card dark:border-0 rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          Category
        </h3>
        <select
          value={blog.category || ""}
          onChange={(e) =>
            setBlog((prev: BlogPost) => ({ ...prev, category: e.target.value }))
          }
          className="w-full px-3 py-2 dark:bg-card border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="bg-white dark:bg-card dark:border-0 rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          Tags
        </h3>
        <input
          type="text"
          placeholder="Add tags (press Enter)"
          value={tagInput || ""}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagAdd}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {blog.tags &&
            blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                <Hash className="w-3 h-3 mr-1" />
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      </div>

      {/* Featured Image */}
      <div className="bg-white dark:bg-card dark:border-0 rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          Featured Image
        </h3>
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
          <Icon
            icon="ri:image-circle-ai-line"
            width="24"
            height="24"
            className="w-8 h-8 text-gray-400 mx-auto mb-2"
          />
          <p className="text-sm text-gray-600">Click to upload image</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          {preview && (
            <Image
              src={preview}
              alt="featured image"
              width={100}
              height={100}
              className="absolute inset-0 opacity-100 object-cover bg-center w-full h-full cursor-pointer rounded-lg"
            />
          )}
          <Input
            type="file"
            title="Image Upload"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="bg-white dark:bg-card dark:border-0 rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
          Excerpt
        </h3>
        <textarea
          placeholder="Write a brief summary..."
          value={blog.excerpt || ""}
          onChange={(e) =>
            setBlog((prev: BlogPost) => ({ ...prev, excerpt: e.target.value }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
};

export default BlogSeo;
