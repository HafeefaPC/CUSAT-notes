"use client";

import React from "react";
import { Monitor, Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { clsx } from "clsx";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useIsMounted } from "../hooks/use-is-mounted";

function ThemeToggleGroup({ className }) {
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();

  function handleThemeChange(value) {
    setTheme(value);
  }

  return (
    <ToggleGroup
      type="single"
      value={isMounted() ? theme : "system"}
      onValueChange={handleThemeChange}
      className={clsx("rounded-full border p-1", className)}
    >
      <ToggleGroupItem
        aria-label="Toggle Light Mode"
        value="light"
        className="size-8 rounded-full px-2"
      >
        <SunMedium className="h-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        aria-label="Toggle System Mode"
        value="system"
        className="size-8 rounded-full px-2"
      >
        <Monitor className="h-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        aria-label="Toggle Dark Mode"
        value="dark"
        className="size-8 rounded-full px-2"
      >
        <Moon className="h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export { ThemeToggleGroup };

