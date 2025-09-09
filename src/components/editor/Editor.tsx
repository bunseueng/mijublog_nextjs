"use client";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "../ui/button";
import Toolbars from "./Toolbars";
import ListMaxIndentLevelPlugin from "./ListMaxIndentPlugin";
import CodeHighlightPlugin from "./CodeHighlightPlugin";
import ImagesPlugin from "../plugins/ImagePlugin";
import BlogSeo from "./BlogSeo";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { toast } from "sonner";
import { mergeRegister } from "@lexical/utils";
import { useDebouncedCallback } from "use-debounce";
import { $getRoot } from "lexical";
import YouTubePlugin from "../plugins/YoutubePlugin";
import { Category } from "@/types/BlogPost";
import CustomLinkPlugin from "../plugins/LinkPlugin";

export interface BlogPost {
  title: string;
  metaTitle?: "";
  metaDescription?: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
  featuredImage: string;
}

export default function Editor({
  blog_db,
  setFormData,
  categories,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blog_db: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: ((value: any) => void) | undefined;
  categories?: Category[];
}) {
  const [editor] = useLexicalComposerContext();
  const [words, setWords] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [preview, setPreview] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [blog, setBlog] = useState<BlogPost>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    status: "PUBLISHED",
    featuredImage: "",
  });
  const { data: session } = authClient.useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (!session?.user) {
        toast("Not Authorized");
      }

      if (blog_db) {
        const res = await fetch(`/api/blogs/${blog_db?.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: JSON.stringify(editor._editorState.toJSON()), // ✅ store as string
          }),
        });
        if (res.status === 200) {
          toast("Blog successfully posted");
        } else {
          toast.error("Failed to post a blog");
        }
      }
      const res = await fetch("/api/new-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: blog.title,
          metaTitle: blog.metaTitle,
          slug: blog.slug,
          content: JSON.stringify(editor._editorState.toJSON()), // ✅ store as string
          metaDescription: blog.metaDescription,
          excerpt: blog.excerpt,
          featuredImage: preview,
          status: blog.status,
          readingTime: minutes, // ensure number
          wordCount: words, // ensure number
          authorId: session?.user.id, // ✅ only send ID
          tags: blog.tags,
          category: blog.category,
        }),
      });

      if (res.status === 200) {
        toast("Blog successfully posted");
      } else {
        toast.error("Failed to post a blog");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = useDebouncedCallback((content) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData?.((prev: any) => ({
      ...prev,
      content: JSON.stringify(content),
      readingTime: minutes,
      wordCount: words,
    }));
    localStorage.setItem("editor", JSON.stringify(content));
  }, 500);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
          if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
            return;
          }
          editorState.read(() => {
            const text = $getRoot().getTextContent().trim();
            const wordCount = text === "" ? 0 : text.split(/\s+/).length;
            const wordsPerMinute = 200;
            const minutes = Math.ceil(wordCount / wordsPerMinute);

            setWords(wordCount);
            setMinutes(minutes);
          });
          handleSave(editorState);
        }
      )
    );
  });

  return (
    <div className="container mx-auto">
      {!blog_db && (
        <form
          onSubmit={(e) => onSubmit(e)}
          className="bg-white dark:bg-card border border-slate-200 dark:border-0 shadow-md p-4 my-10 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon
                icon="mingcute:file-new-line"
                width="24"
                height="24"
                className="text-blue-400"
              />
              <h4 className="scroll-20 text-xl font-semibold tracking-tight">
                Create Blog
              </h4>
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Icon icon="mingcute:save-2-line" width="24" height="24" /> Save
                Draft
              </div>
              <div className="flex items-center">
                <Button type="submit" title="Publish">
                  <Icon icon="mingcute:share-2-line" width="24" height="24" />{" "}
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
      <div className="flex flex-col md:flex-row">
        <div
          className={`w-full bg-white dark:bg-background border border-slate-200 dark:border-transparent shadow-md rounded-lg ${
            blog_db ? "md:w-full" : "md:w-[70%]"
          }`}
        >
          <div className="relative min-h-[50vh] max-h-auto overflow-y-auto">
            {/* Editor container */}
            <div className="border-b border-b-slate-200 p-2 sticky top-0 z-10">
              {/* Toolbar stays fixed */}
              <Toolbars />
              <ImagesPlugin />
            </div>
            <div className="relative py-4 md:px-4">
              {/* Content area */}
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="focus:outline-none cursor-text min-h-[calc(50vh-80px)]"
                    aria-placeholder="Enter some text..."
                    placeholder={
                      <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                        Enter some text...
                      </div>
                    }
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>
            {/* Plugins */}
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CustomLinkPlugin hasLinkAttributes={true} />
            <AutoLinkPlugin matchers={MATCHERS} />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <YouTubePlugin />
          </div>
        </div>

        {/* Right Side */}
        {!blog_db && (
          <BlogSeo
            words={words}
            setWords={setWords}
            minutes={minutes}
            setMinutes={setMinutes}
            blog={blog}
            setBlog={setBlog}
            tagInput={tagInput}
            setTagInput={setTagInput}
            preview={preview}
            setPreview={setPreview}
            categories={categories as Category[]}
          />
        )}
      </div>
    </div>
  );
}

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_MATCHER =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const MATCHERS = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (text: any) => {
    const match = URL_MATCHER.exec(text);
    return (
      match && {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: match[0],
      }
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (text: any) => {
    const match = EMAIL_MATCHER.exec(text);
    return (
      match && {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: `mailto:${match[0]}`,
      }
    );
  },
];
