import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useEffect } from "react";

const LoadState = ({
  content,
  setFormData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: ((content: any) => void) | undefined;
}) => {
  const [editor] = useLexicalComposerContext();
  console.log(editor._editorState.toJSON());
  useEffect(() => {
    try {
      const newState = editor.parseEditorState(
        content ? content : localStorage.getItem("editor")
      );
      queueMicrotask(() => {
        editor.setEditorState(newState);
        editor.setEditable(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFormData?.((prev: any) => ({
          ...prev,
          content: JSON.stringify(editor._editorState.toJSON()),
        }));
      });
    } catch (err) {
      console.error("Failed to load editor state:", err);
    }
  }, [content, editor, setFormData]);
  return <></>;
};

export default LoadState;
