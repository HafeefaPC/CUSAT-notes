'use client'
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import NavButton from "../Button/navbutton"
import { Signoutbutton } from "../Button/navbutton";
import { Logo } from "../ui/icon";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function LobbyNavbar() {
  const [accessToken, setAccessToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const logout = async () => {
    try {
      // Clear user data from local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');


      // Redirect to the login page or any other page
      router.push('/resourses');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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

          {userEmail && <Signoutbutton id="Sign out" onClick={logout} />}
          {userEmail === 'hafeefapc2003@gmail.com' && <NavButton id="Select" onClick="/fileselect" />}
          {accessToken && < NavButton id="Upload" onClick="/fileupload" />}

        </div>
      </nav>
    </header>
  );
}
export default LobbyNavbar;
