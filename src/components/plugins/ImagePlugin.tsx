/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import {
  $isAutoLinkNode,
  $isLinkNode,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $findMatchingParent,
  $wrapNodeInElement,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  getDOMSelectionFromTarget,
  isHTMLElement,
  LexicalCommand,
  LexicalEditor,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import * as React from "react";

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload,
} from "../../nodes/ImageNode";
import TextInput from "../ui/LexicalTextInput";
import Button from "../ui/LexicalButton";
import FileInput from "../ui/LexicalFileInput";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export function InsertImageUriDialogBody({
  onClick,
  containerRef,
  setIsOpen,
}: {
  onClick: (payload: InsertImagePayload) => void;
  containerRef: React.Ref<HTMLDivElement> | undefined;
  setIsOpen: (type: boolean) => void;
}) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50 z-50">
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50">
        <div
          ref={containerRef}
          className="bg-white dark:bg-card w-[400px] h-[200px] border border-white rounded-lg shadow-md p-4"
        >
          <TextInput
            label="Image URL"
            placeholder="i.e. https://source.unsplash.com/random"
            onChange={setSrc}
            value={src}
            data-test-id="image-modal-url-input"
          />
          <TextInput
            label="Alt Text"
            placeholder="Random unsplash image"
            onChange={setAltText}
            value={altText}
            data-test-id="image-modal-alt-text-input"
          />
          <div className="flex items-center justify-end gap-4">
            <Button
              data-test-id="image-modal-confirm-btn"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              data-test-id="image-modal-confirm-btn"
              disabled={isDisabled}
              onClick={() => onClick({ altText, src })}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsertImageUploadedDialogBody({
  onClick,
  containerRef,
  setIsOpen,
}: {
  onClick: (payload: InsertImagePayload) => void;
  containerRef: React.Ref<HTMLDivElement> | undefined;
  setIsOpen: (type: boolean) => void;
}) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === "string") {
        setSrc(reader.result);
      }
      return "";
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50 z-50">
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50">
        <div
          ref={containerRef}
          className="bg-white dark:bg-card w-[400px] h-[200px] border border-white dark:border-white/50 rounded-lg shadow-md p-4"
        >
          <FileInput
            label="Image Upload"
            onChange={loadImage}
            accept="image/*"
            data-test-id="image-modal-file-upload"
          />
          <TextInput
            label="Alt Text"
            placeholder="Descriptive alternative text"
            onChange={setAltText}
            value={altText}
            data-test-id="image-modal-alt-text-input"
          />
          <div className="flex items-center justify-end gap-4">
            <Button
              data-test-id="image-modal-file-upload-btn"
              onClick={() => setIsOpen(false)}
              className="dark:bg-gray-700! dark:hover:opacity-50!"
            >
              Close
            </Button>
            <Button
              data-test-id="image-modal-file-upload-btn"
              disabled={isDisabled}
              onClick={() => onClick({ altText, src })}
              className="dark:bg-gray-700! dark:hover:opacity-50!"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsertImageDialog({
  activeEditor,
  setIsOpen,
}: {
  activeEditor: LexicalEditor;
  setIsOpen: (type: boolean) => void;
}): JSX.Element {
  const [mode, setMode] = useState<null | "url" | "file">(null);
  const hasModifier = useRef<HTMLInputElement | boolean>(false);
  const containerRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [activeEditor]);

  const onClose = React.useCallback(
    (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // close modal/toolbar
      }
    },
    [setIsOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", onClose);
    return () => {
      document.removeEventListener("mousedown", onClose);
    };
  }, [onClose]);

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    setIsOpen(false);
  };

  return (
    <div>
      {!mode && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50 z-50">
          <div
            ref={containerRef}
            className="bg-white dark:bg-card w-[200px] h-[200px] border border-white rounded-lg shadow-md"
          >
            <h1 className="p-2 text-xl border-b border-b-slate-200">
              Insert Image
            </h1>
            <div className="flex items-center p-2 gap-4">
              <Button
                data-test-id="image-modal-option-url"
                onClick={() => setMode("url")}
                className="dark:bg-card! dark:hover:opacity-50!"
              >
                URL
              </Button>
              <Button
                data-test-id="image-modal-option-file"
                onClick={() => setMode("file")}
                className="dark:bg-card! dark:hover:opacity-50!"
              >
                File
              </Button>
            </div>
          </div>
        </div>
      )}
      {mode === "url" && (
        <InsertImageUriDialogBody
          onClick={onClick}
          containerRef={containerRef}
          setIsOpen={setIsOpen}
        />
      )}
      {mode === "file" && (
        <InsertImageUploadedDialogBody
          onClick={onClick}
          containerRef={containerRef}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}

export default function ImagesPlugin({
  captionsEnabled,
}: {
  captionsEnabled?: boolean;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return $onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return $onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [captionsEnabled, editor]);

  return null;
}

function $onDragStart(event: DragEvent): boolean {
  const TRANSPARENT_IMAGE =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  if (typeof document !== "undefined") {
    const img = document.createElement("img");
    img.src = TRANSPARENT_IMAGE;

    const node = $getImageNodeInSelection();
    if (!node) {
      return false;
    }
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
      return false;
    }
    dataTransfer.setData("text/plain", "_");
    dataTransfer.setDragImage(img, 0, 0);
    dataTransfer.setData(
      "application/x-lexical-drag",
      JSON.stringify({
        data: {
          altText: node.__altText,
          caption: node.__caption,
          height: node.__height,
          key: node.getKey(),
          maxWidth: node.__maxWidth,
          showCaption: node.__showCaption,
          src: node.__src,
          width: node.__width,
        },
        type: "image",
      })
    );
  }
  return true;
}

function $onDragover(event: DragEvent): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function $onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  const existingLink = $findMatchingParent(
    node,
    (parent): parent is LinkNode =>
      !$isAutoLinkNode(parent) && $isLinkNode(parent)
  );
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
    if (existingLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, existingLink.getURL());
    }
  }
  return true;
}

function $getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData("application/x-lexical-drag");
  if (!dragData) {
    return null;
  }
  const { type, data } = JSON.parse(dragData);
  if (type !== "image") {
    return null;
  }

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target;
  return !!(
    isHTMLElement(target) &&
    !target.closest("code, span.editor-image") &&
    isHTMLElement(target.parentElement) &&
    target.parentElement.closest("div.ContentEditable__root")
  );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const domSelection = getDOMSelectionFromTarget(event.target);
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}
