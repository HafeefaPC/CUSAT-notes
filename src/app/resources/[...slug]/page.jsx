"use client"

import React from "react";
import pageButton from "../../data/pageButton.json";

const Page = ({ params }) => {
  // const router = useRouter();
  const { slug } = params || {}; // Check if router is defined

  console.log(slug);

  const lastSegment = slug ? slug[slug.length - 1] : null;
  
  const isSemester = lastSegment && pageButton.subjects.some((subject) => subject.name === `/${lastSegment}`);

  const subjectsToDisplay = isSemester
    ? pageButton.subjects.find((subject) => subject.name === `/${lastSegment}`).subjects
    : null;

  return (
    <div>
      <h1>{slug ? slug.join("/") : ""}</h1>
      <ul>
        {subjectsToDisplay
          ? subjectsToDisplay.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))
          : pageButton.semester.map((semester) => (
              <li key={semester.name}>
                <a href={`${semester.name}`}>{semester.name}</a>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default Page;