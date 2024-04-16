'use client'
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import NavButton from "../Button/navbutton"
import { Signoutbutton } from "../Button/navbutton";
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
  const [accessToken, setAccessToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const handleSignOut = () => {
    localStorage.removeItem('usser');
    localStorage.removeItem('userEmail');
    setAccessToken(null);
    setUserEmail(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('userEmail');

    setAccessToken(token);
    setUserEmail(email);
    console.log(token, "accessToken")
    console.log(email, "email");
  }, []);
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
          {!userEmail && <NavButton id="Login" onClick="/login" />}
          {!userEmail && <NavButton id="Signup" onClick="/signup" />}

          {userEmail && <Signoutbutton id="Sign out" onClick={handleSignOut} />}
          {userEmail === 'hafeefapc2003@gmail.com' && <NavButton id="select" onClick="/fileselect" />}
          {accessToken && < NavButton id="Upload" onClick="/upload" />}
        </div>
      </nav>
    </header>
  );
}
export default LobbyNavbar;
