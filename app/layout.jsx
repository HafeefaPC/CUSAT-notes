import "./globals.css";


import { Providers } from "../components/ui/providers.jsx";
import { TailwindIndicator } from "../components/ui/tailwind-indicator";
import { Toaster } from "../components/ui/sonner";


import { fontHandwriting, fontHeading, fontMono, fontSans } from "../app/components/ui/fonts";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          fontHeading.variable,
          fontHandwriting.variable,
          "min-h-screen scroll-smooth font-sans antialiased selection:bg-foreground selection:text-background"
        )}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>


        <TailwindIndicator />
      </body>
    </html>
  );
}
