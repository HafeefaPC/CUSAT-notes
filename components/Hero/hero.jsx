"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import homeoffice from "../../app/assets/images/home-office.svg";
import Button from "../Button/DownloadButton";

function Hero() {


  return (
    <section
      id="hero"
      className="flex w-full flex-col items-center justify-center gap-4 text-center"
    >
      <header className="mt-10 flex flex-col items-center gap-4">
        <div className="shadow duration-500 ease-out animate-in fade-in-0 zoom-in-50 slide-in-from-bottom-1/2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          ✨ Your Workspace, Perfected
        </div>

        <h1 className="mt-4 font-heading text-4xl font-bold duration-500 ease-out animate-in fade-in-0 zoom-in-50 slide-in-from-bottom-1/2 [text-shadow:_0_4px_0_#e1e1e1] dark:bg-gradient-to-br dark:from-neutral-200 dark:to-neutral-600 dark:bg-clip-text dark:text-transparent dark:[text-shadow:none] md:text-7xl">
          Hipus
        </h1>

        <h2 className="max-w-xl text-lg text-muted-foreground duration-500 ease-out animate-in fade-in-0 zoom-in-50 slide-in-from-bottom-1/2">
          A Note Taking app built using Next.js (App Router), Typescipt,
          Tailwind CSS, shadcn/ui, Drizzle ORM & more!
        </h2>
      </header>


      <Button id="Resources" onClick="/resources" />


      <Image
        priority
        fetchPriority="high"
        loading="eager"
        src={homeoffice}
        alt="Home Office"
        width={500}
        height={500}
        className="drop-shadow-xl duration-500 ease-out animate-in fade-in-0 zoom-in-50 slide-in-from-bottom-1/2 dark:invert"
      />
    </section>
  );
}

export default Hero;
