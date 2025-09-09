/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import * as React from "react";
import { validateUrl } from "@/utils/url";

type Props = {
  hasLinkAttributes?: boolean;
};

export default function CustomLinkPlugin({
  hasLinkAttributes = false,
}: Props): JSX.Element {
  return (
    <LinkPlugin
      validateUrl={validateUrl}
      attributes={
        hasLinkAttributes
          ? {
              rel: "noopener noreferrer",
              target: "_blank",
            }
          : undefined
      }
    />
  );
}
