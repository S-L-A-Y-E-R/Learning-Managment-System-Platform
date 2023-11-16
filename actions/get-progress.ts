import axios from "axios";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const { data } = await axios.get(
      `${process.env.API_URL}api/v1/chapters?courseId=${courseId}&isPublished=true`
    );

    const publishedChapterIds = data.data.map((chapter: any) => chapter._id);

    const overAllProgress = await axios.get(
      `${process.env.API_URL}api/v1/progress?userId=${userId}`
    );

    let validCompletedChapters = 0;

    overAllProgress.data.data.map(
      (progress: any) =>
        publishedChapterIds.includes(progress.chapterId) &&
        validCompletedChapters++
    );

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
