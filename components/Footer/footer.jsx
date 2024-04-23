import Link from "next/link";

import { GitHub, Logo, X } from "../ui/icon";
import { Separator } from "../ui/separator";
import ThemeToggleGroup from "../theme/theme-toggle-group";


const footerLinks = [
  {
    title: "Product",
    links: ["Wikis", "Projects", "Docs", "AI", "What's new"],
  },
  {
    title: "Download",
    links: ["iOS & Android", "Mac & Windows", "Web Clipper"],
  },
  {
    title: "Policies",
    links: ["Privacy", "Terms of use", "Cookie Preferences"],
  },
  { title: "Support", links: ["Contact us", "FAQs"] },
];

function sitefooter() {
  const githubUrl = '/';

  return (
    <footer className="border-t py-10">
      <div className="mx-auto w-full max-w-none px-5 text-sm sm:max-w-[90%] sm:px-0 2xl:max-w-7xl">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] items-stretch justify-between gap-y-10 sm:gap-x-6 md:flex md:flex-wrap">
          <div className="col-span-full flex items-center justify-between gap-4 md:flex-col">
            <Link
              href="/"
              className="flex gap-1  font-handwriting text-xl lowercase [text-shadow:_0_2px_0_#e1e1e1] dark:[text-shadow:none]"
            >
              <Logo size={28} />
              <p className="font-heading text-md font-bold duration-500 ease-out animate-in fade-in-0 zoom-in-5">Hipus</p>
            </Link>
            <div className="flex justify-center gap-3 text-muted-foreground">
              <a
                aria-label="GitHub Repository"
                href='/'
                target="_blank"
                rel="noreferrer"
                className="duration-200 hover:text-foreground"
              >
                <GitHub className="size-4 shrink-0" />
              </a>

              <Separator orientation="vertical" className="h-4" />

              <a
                aria-label="X/Twitter Handle"
                href='/'
                target="_blank"
                rel="noreferrer"
                className="duration-200 hover:text-foreground"
              >
                <X className="size-4 shrink-0" />
              </a>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-2.5">
              <h3 className="mb-1 text-sm font-heading  font-bold duration-500 ease-out animate-in fade-in-0 zoom-in-5 lg:text-sm">
                {section.title}
              </h3>

              {section.links.map((link) => (
                <a
                  key={link}
                  href='/'
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-heading  font-bold  ease-out animate-in fade-in-0 zoom-in-5 text-muted-foreground duration-200 hover:text-foreground"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
          <div className="col-span-full flex w-full flex-col gap-2 lg:max-w-[240px]">
            <h3 className="mb-1.5 text-sm font-heading  font-bold duration-500 ease-out animate-in fade-in-0 zoom-in-5 lg:text-sm">
              Subscribe to our newsletter
            </h3>

            <p className="mb-1.5 text-xs leading-6 font-heading   duration-500 ease-out animate-in fade-in-0 zoom-in-5 text-muted-foreground lg:text-xs">
              Join Our Community! Get exclusive travel offers and insider tips.
            </p>

          </div>
        </div>

        <div className="mt-8 flex items-center justify-between lg:mt-12">
          <p className="mt-4 text-muted-foreground">
            <span className="font-heading text-xs font-bold duration-500 ease-out animate-in fade-in-0 zoom-in-5">
              &copy; {new Date().getFullYear()} Hipus.
            </span>{" "}
            <span className="font-heading text-xs font-bold duration-500 ease-out animate-in fade-in-0 zoom-in-5">
              Illustrations by{" "}
              <a
                href="https://popsy.co/"
                className="underline underline-offset-4 font-heading text-xs font-bold duration-500 ease-out animate-in fade-in-0 zoom-in-5 transition-colors hover:text-foreground"
              >
                Hipus
              </a>
            </span>
          </p>

          <ThemeToggleGroup />
        </div>
      </div>
    </footer>
  );
}
export default sitefooter;