"use client";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React, { useState } from "react";
interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  showCancel?: boolean;
}

export function CommentForm({
  onSubmit,
  onCancel,
  isLoading = false,
  placeholder = "Write a comment...",
  showCancel = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />

      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2 sm:mt-3">
        {showCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-xs sm:text-sm"
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          onClick={handleSubmit}
        >
          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          {isLoading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </div>
  );
}
