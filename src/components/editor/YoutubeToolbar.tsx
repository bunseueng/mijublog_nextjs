"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";
import { INSERT_YOUTUBE_COMMAND } from "../plugins/YoutubePlugin";

function extractYouTubeId(url: string): string | null {
  const match =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

  const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;

  return id ?? null;
}

export default function YoutubeToolbar(): React.JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");

  const handleInsert = () => {
    const id = extractYouTubeId(url);
    if (id) {
      editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, id);
      setUrl("");
      setIsOpen(false);
    } else {
      alert("Please enter a valid YouTube URL.");
    }
  };

  return (
    <>
      {/* Toolbar button */}
      <div className="toolbar">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white dark:bg-card rounded-full text-black dark:text-white border border-white dark:border-white/50 px-2"
        >
          <span>Insert YouTube Video</span>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Insert YouTube Video</h2>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleInsert}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
