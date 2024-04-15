'use client'
import React from "react";
import pageButton from "../../data/pageButton.json";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const router = useRouter();
  const { slug } = params || [];

  const resource = pageButton["/"].resources.find((r) => r.name === slug[0] || r.name === "notes");

  const handleDepartmentClick = (departmentSlug) => {
    router.push(`/resources/${slug[0]}/${departmentSlug}`);
  };

  const handleSemesterClick = (semesterSlug) => {
    router.push(`/resources/${slug[0]}/${slug[1]}/${semesterSlug}`);
  };

  return (
    <div>
      <h1>{slug ? slug.join("/") : ""}</h1>
      {resource ? (
        <ul>
          {resource.departments.map((department) => (
            <li key={department.slug}>
              <button onClick={() => handleDepartmentClick(department.slug)}>
                {department.name}
              </button>
              {department.slug === slug[1] && (
                <ul>
                  {department.semesters.map((semester) => (
                    <li key={semester.slug}>
                      <button onClick={() => handleSemesterClick(semester.slug)}>
                        {semester.name}
                      </button>
                      {semester.slug === slug[2] && (
                        <ul>
                          {semester.subjects.map((subject) => (
                            <li key={subject.slug}>
                              {subject.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <li>No data found</li>
      )}
    </div>
  );
};

export default Page;