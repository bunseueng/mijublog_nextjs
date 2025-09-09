"use client";

import Editor from "@/components/editor/Editor";
import React, { useEffect, useState } from "react";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ImageNode } from "@/nodes/ImageNode";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LoadState from "./LoadState";
import { YouTubeNode } from "@/nodes/YoutubeNode";
import { Category } from "@/types/BlogPost";

function onError(error: unknown) {
  console.error(error);
}

const EditorWrapper = ({
  blog_db,
  setFormData,
  categories,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blog_db: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData?: (value: any) => void;
  categories?: Category[];
}) => {
  const [localItem, setLocalItem] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("key", "value");
      const item = localStorage.getItem("editor");
      setLocalItem(item);
    }
  }, []);

  const initialConfig = {
    namespace: "MyEditor",
    theme: exampleTheme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
      YouTubeNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {!blog_db?.content ||
        (!localItem && (
          <LoadState content={blog_db?.content} setFormData={setFormData} />
        ))}
      <Editor
        blog_db={blog_db}
        setFormData={setFormData}
        categories={categories}
      />
    </LexicalComposer>
  );
};

export default EditorWrapper;

export const exampleTheme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "leading-7 [&:not(:first-child)]:mt-6",
  quote: "mt-6 border-l-2 pl-6 italic",
  heading: {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
    h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  hashtag: "editor-hashtag",
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-textBold",
    code: "editor-textCode",
    italic: "editor-textItalic",
    strikethrough: "editor-textStrikethrough",
    subscript: "editor-textSubscript",
    superscript: "editor-textSuperscript",
    underline: "editor-textUnderline",
    underlineStrikethrough: "editor-textUnderlineStrikethrough",
  },
  code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};
