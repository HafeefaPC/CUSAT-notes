import Link from "next/link";

import NavButton from "../Button/navbutton"
import { Logo } from "../ui/icon";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


/**
 * Merges the given class names with the tailwind classes
 * @param inputs The class names to merge
 * @returns The merged class names
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function LobbyNavbar() {
  return (
    <header className="mt-3 p-7 h-14">
      <nav className="container flex h-full items-center justify-between">
        <Link
          href="/"
          className="flex gap-2 px-4 font-handwriting text-xl lowercase [text-shadow:_0_2px_0_#e1e1e1] dark:[text-shadow:none]"
        >
          <Logo size={28} />
          Hipus
        </Link>



        <div className="flex flex-1 justify-end gap-2">
          <NavButton id="Resources" onClick="/resources" />


        </div>
      </nav>
    </header>
  );
}
export default LobbyNavbar;
