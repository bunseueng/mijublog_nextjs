"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      {resolvedTheme === "light" ? (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("dark")} // switch to dark
        >
          <Icon icon="mynaui:moon-solid" width="24" height="24" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("light")} // switch to light
        >
          <Icon icon="mynaui:sun-dim-solid" width="24" height="24" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      )}
    </>
  );
}
