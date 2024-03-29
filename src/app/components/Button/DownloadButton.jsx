import React from 'react';
import { cva } from "class-variance-authority"; // Import cva from class-variance-authority
import Link from 'next/link';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define cn function directly within the component
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Create buttonVariants function using cva
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const DownloadButton = ({ id, onClick }) => {
  return (
    <div className="flex items-center gap-2 py-2 duration-500 ease-out animate-in fade-in-0 zoom-in-50 slide-in-from-bottom-1/2">
      <Link
        href={onClick}
        className={cn(
          buttonVariants({ size: "lg" }), // Use buttonVariants as a function here
          "font-semibold shadow-lg transition-all duration-200 hover:ring-2 hover:ring-foreground hover:ring-offset-2 hover:ring-offset-background"
        )}
      >
        {id}
      </Link>
    </div >
  );
};

export default DownloadButton;
