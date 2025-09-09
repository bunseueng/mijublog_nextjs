/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
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
} from "lexical";
import { useEffect, useRef, useState } from "react";
import * as React from "react";

import { $createImageNode, $isImageNode, ImageNode } from "@/nodes/ImageNode";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const CAN_USE_DOM =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDOMSelection = (targetWindow: any) =>
  CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function InsertImageUriDialogBody({ onClick }: any) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  return (
    <>
      <Input
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={(e) => setSrc(e.target.value)}
        value={src}
      />
      <Input
        placeholder="Random unsplash image"
        onChange={(e) => setAltText(e.target.value)}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <Button
        data-test-id="image-modal-confirm-btn"
        disabled={isDisabled}
        onClick={() => onClick({ altText, src })}
      >
        Confirm
      </Button>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function InsertImageUploadedDialogBody({ onClick }: any) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadImage = (files: any) => {
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
    <>
      <Button>
        Upload
        <input
          onChange={(e) => loadImage(e.target.files)}
          hidden
          accept="image/*"
          multiple
          type="file"
        />
      </Button>

      <Input
        placeholder="Descriptive alternative text"
        onChange={(e) => setAltText(e.target.value)}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <Button
        data-test-id="image-modal-confirm-btn"
        disabled={isDisabled}
        onClick={() => onClick({ altText, src })}
      >
        Confirm
      </Button>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function InsertImageDialog({ activeEditor, onClose }: any) {
  const [mode, setMode] = useState(null);
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [activeEditor]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClick = (payload: any) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };

  return (
    <>
      {!mode && (
        <>
          <Button
            data-test-id="image-modal-option-url"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setMode("url" as any)}
          >
            URL
          </Button>
          <Button
            data-test-id="image-modal-option-file"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setMode("file" as any)}
          >
            File
          </Button>
        </>
      )}
      {mode === "url" && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === "file" && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ImagesPlugin({ captionsEnabled }: any) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const imageNode = $createImageNode(payload as any);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          return onDrop(event);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [captionsEnabled, editor]);

  return null;
}

const TRANSPARENT_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const img = document.createElement("img");
img.src = TRANSPARENT_IMAGE;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDragStart(event: any) {
  const node = getImageNodeInSelection();
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

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDragover(event: any) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDrop({ event, editor }: any) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
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
  }
  return true;
}

function getImageNodeInSelection() {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDragImageData(event: any) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function canDropImage(event: any) {
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest("code, span.editor-image") &&
    target.parentElement &&
    target.parentElement.closest("div.ContentEditable__root")
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDragSelection(event: any) {
  let range;
  const target = event.target;
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
      ? target.defaultView
      : target.ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);
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
