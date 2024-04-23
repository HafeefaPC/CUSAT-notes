'use client'
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import NavButton from "../Button/navbutton"
import { Signoutbutton } from "../Button/navbutton";
import { Logo } from "../ui/icon";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "../../firebase/firebaseApp";
import { useRouter } from 'next/navigation';


function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function LobbyNavbar() {
  const [accessToken, setAccessToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const router = useRouter();
  const logout = async () => {
    try {
      await auth.signOut();


      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');


      router.push('/');
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
      <nav className="container flex h-full items-center justify-between gap-3">
        <Link
          href="/"
          className="flex gap-1 px-4 font-handwriting text-xl lowercase [text-shadow:_0_2px_0_#e1e1e1] dark:[text-shadow:none]"
        >
          <Logo size={28} className="" />

          <p className="font-heading text-md font-bold duration-500 ease-out animate-in fade-in-0 zoom-in-5">Hipus</p>
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
