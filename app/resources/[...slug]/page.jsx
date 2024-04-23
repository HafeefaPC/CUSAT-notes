"use client";
import React from "react";
import pageButton from "../../../data/pageButton.json";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const router = useRouter();
  const { slug } = params || [];

  const resource = pageButton["/"].resources.find((r) => r.slug === slug[0] || r.slug === "n");



  const handleDepartmentClick = (departmentSlug) => {
    router.push(`/resources/${slug[0]}/${departmentSlug}`);
  };

  const handleSemesterClick = (semesterSlug) => {
    router.push(`/resources/${slug[0]}/${slug[1]}/${semesterSlug}`);
  };

  const handleSubjectClick = (subjectSlug) => {
    console.log(slug[0], slug[1], slug[2], subjectSlug)
    const filename = `${slug[0]}${slug[1]}${slug[2]}${subjectSlug}*.pdf`;

    console.log("filename:", filename);
  };

  return (
    <div className="flex p-10 gap-6">
      {resource ? (
        <ul>
          {resource.departments.map((department) => (
            <li key={department.slug}>
              <button className="text-white dark:text-black   bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => handleDepartmentClick(department.slug)}>
                {department.name}
              </button>
              {
                department.slug === slug[1] && (
                  <ul>
                    {department.semesters.map((semester) => (
                      <li key={semester.slug}>
                        <button className=" text-white dark:text-black   bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => handleSemesterClick(semester.slug)}>
                          {semester.name}
                        </button>
                        {
                          semester.slug === slug[2] && (
                            <ul>
                              {semester.subjects.map((subject) => (
                                <li key={subject.slug}>
                                  <button className=" text-white dark:text-black   bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => handleSubjectClick(subject.slug)}>
                                    {subject.name}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )
                        }
                      </li>
                    ))}
                  </ul>
                )
              }
            </li>
          ))}
        </ul>
      ) : (
        <li>No data found</li>
      )
      }
    </div >
  );
};

export default Page;
