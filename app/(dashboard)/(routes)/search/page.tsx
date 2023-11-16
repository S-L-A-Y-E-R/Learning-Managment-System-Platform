import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    category: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = [
    {
      id: "1",
      name: "Music",
    },
    {
      id: "2",
      name: "Photography",
    },
    {
      id: "3",
      name: "Fitness",
    },
    {
      id: "4",
      name: "Accounting",
    },
    {
      id: "5",
      name: "Computer Science",
    },
    {
      id: "6",
      name: "Filming",
    },
    {
      id: "7",
      name: "Engineering",
    },
  ];
  // console.log(searchParams);

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
