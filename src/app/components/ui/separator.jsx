"use client";

import React from "react";
import clsx from "clsx"; // Import clsx
import * as SeparatorPrimitive from "@radix-ui/react-separator";

const Separator = React.forwardRef(
  function Separator(
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={clsx( // Use clsx instead of cn
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
