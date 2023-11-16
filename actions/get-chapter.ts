import axios from "axios";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await axios.get(
      `${process.env.API_URL}api/v1/purchase?userId=${userId}&courseId=${courseId}`
    );

    const course = await axios.get(
      `${process.env.API_URL}api/v1/courses/${courseId}?isPublished=true`
    );

    const chapter = await axios.get(
      `${process.env.API_URL}api/v1/chapters/${chapterId}?isPublished=true`
    );

    if (!chapter.data.data.data || !course.data.data.data) {
      throw new Error("Chapter or course not found");
    }

    let muxData = null;
    let attachments = null;
    let nextChapter = null;
    // console.log(purchase.data.data);

    if (purchase.data.data) {
      attachments = await axios.get(
        `${process.env.API_URL}api/v1/attachments?courseId=${courseId}`
      );
    }
    // console.log(attachments?.data.data);

    if (chapter.data.data.data.isFree || purchase.data.data) {
      muxData = chapter.data.data.data.muxData;

      nextChapter = await axios.get(
        `${process.env.API_URL}api/v1/chapters?position=${
          chapter.data.data.data.position + 1
        }&courseId=${courseId}&isPublished=true`
      );
    }

    const userProgress = await axios.get(
      `${process.env.API_URL}api/v1/progress?userId=${userId}&chapterId=${chapterId}`
    );

    const chapterData = chapter.data.data.data;
    const courseData = course.data.data.data;
    const attachmentsData = attachments?.data.data;
    const nextChapterData = nextChapter?.data.data[0];
    const userProgressData = userProgress?.data.data[0];
    const purchaseData = purchase?.data.data[0];

    return {
      chapterData,
      courseData,
      muxData,
      attachmentsData,
      nextChapterData,
      userProgressData,
      purchaseData,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapterData: null,
      courseData: null,
      muxData: null,
      attachmentsData: [],
      nextChapterData: null,
      userProgressData: null,
      purchaseData: null,
    };
  }
};
