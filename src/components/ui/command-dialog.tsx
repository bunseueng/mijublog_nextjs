"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { BlogPost, Category } from "@/types/BlogPost";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface CommandDialogProps {
  open: boolean;
  setOpen: (type: boolean) => void;
  categories: Category[];
  blog_posts: BlogPost[];
}

const SearchDialog = ({
  open,
  setOpen,
  categories,
  blog_posts,
}: CommandDialogProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [text, setText] = useState("");
  const filteredBlog = blog_posts.filter((post) =>
    post.title.toLocaleLowerCase().includes(text.toLocaleLowerCase())
  );

  const handleSelected = (category: Category) => {
    router.push(`/category?q=${category.name}`);
    setOpen(false);
  };

  const handleBlogSelected = (blog: BlogPost) => {
    router.push(`/blog/${blog.slug}`);
    setOpen(false);
  };

  useEffect(() => {
    if (previousPath.current !== pathname) {
      setOpen(false);
      previousPath.current = pathname;
    }
  }, [pathname, setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        onValueChange={(val: string) => setText(val)}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Categories">
          {categories.map((category) => (
            <CommandItem
              key={category.id}
              onSelect={() => handleSelected(category)}
            >
              {category.name}
            </CommandItem>
          ))}
        </CommandGroup>
        {text && (
          <CommandGroup heading="Blog Posts">
            {filteredBlog.map((blog) => (
              <CommandItem
                onSelect={() => handleBlogSelected(blog)}
                key={blog.id}
                value={`${blog.title.toLocaleLowerCase()}`}
              >
                <div className="flex items-center">
                  <Image
                    src={`${blog.featuredImage}`}
                    alt="Blog Cover"
                    width={100}
                    height={100}
                    quality={100}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <h4 className="text-sm! md:text-md!">
                    {blog.title.length > 50
                      ? blog.title.slice(0, 50) + "..."
                      : blog.title}
                  </h4>

                  <div className="flex space-x-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="border border-gray-200 rounded-full text-xs! py-0.5 px-2"
                      >
                        {tag.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;
