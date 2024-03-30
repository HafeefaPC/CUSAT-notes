"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "../ui/tooltip";

function Providers({ children, theme }) {
  return (
    React.createElement(ThemeProvider, Object.assign({
      attribute: "class",
      defaultTheme: "light",
      enableSystem: true,
      disableTransitionOnChange: true
    }, theme), React.createElement(TooltipProvider, null, children))
  );
}

module.exports = {
  Providers
};
