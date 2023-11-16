import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import axios from "axios";

import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import TitleForm from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-fom";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapter-form";
import { Actions } from "./_components/actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { data: course } = await axios.get(
    `${process.env.API_URL}api/v1/courses/${params.courseId}`
  );

  const { data: chapters } = await axios.get(
    `${process.env.API_URL}api/v1/chapters?courseId=${params.courseId}&sort=position`
  );
  // console.log(chapters);

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

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.data.data.title,
    course.data.data.description,
    course.data.data.imageUrl,
    course.data.data.price,
    course.data.data.category,
    course.data.data.chapters.some((chapter: any) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.data.data.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm dark:text-slate-300 text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.data.data.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initialData={course.data.data}
              courseId={course.data.data.id}
            />
            <DescriptionForm
              initialData={course.data.data}
              courseId={course.data.data.id}
            />
            <ImageForm
              initialData={course.data.data}
              courseId={course.data.data.id}
            />
            <CategoryForm
              initialData={course.data.data}
              courseId={course.data.data.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm
                initialData={chapters.data}
                courseId={course.data.data.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm
                initialData={course.data.data}
                courseId={course.data.data.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm
                initialData={course.data.data}
                courseId={course.data.data.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
