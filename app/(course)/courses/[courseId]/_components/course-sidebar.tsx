import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import axios from "axios";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";

export const CourseSidebar = async ({ course, progressCount }: any) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { data: purchase } = await axios.get(
    `${process.env.API_URL}api/v1/purchase?courseId=${course.id}&userId=${userId}`
  );

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase.data && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter: any) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase.data}
          />
        ))}
      </div>
    </div>
  );
};
