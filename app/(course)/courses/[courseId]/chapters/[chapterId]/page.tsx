import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";
import { currentUser } from "@clerk/nextjs";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapterData,
    courseData,
    muxData,
    attachmentsData,
    nextChapterData,
    userProgressData,
    purchaseData,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapterData || !courseData) {
    return redirect("/");
  }

  const isLocked = !chapterData.isFree && !purchaseData;
  const completeOnEnd = !!purchaseData && !userProgressData?.isCompleted;

  return (
    <div>
      {userProgressData?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapterData.title}
            courseId={params.courseId}
            nextChapterId={nextChapterData?._id}
            playbackId={muxData[0].playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            userId={userId}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapterData.title}</h2>
            {purchaseData ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapterData?._id}
                isCompleted={!!userProgressData?.isCompleted}
                userId={userId}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={courseData.price!}
                userId={userId}
                email={user!.emailAddresses?.[0]?.emailAddress}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapterData.description!} />
          </div>
          {!!attachmentsData.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachmentsData.map((attachment: any) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment._id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
