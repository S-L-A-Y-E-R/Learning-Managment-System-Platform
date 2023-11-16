import axios from "axios";

import { getProgress } from "@/actions/get-progress";

export const getCourses = async ({
  userId,
  ...searchParams
}: {
  userId: string;
  category: string;
  title: string;
}): Promise<any[]> => {
  try {
    // console.log(searchParams);

    const { data: courses } = await axios.get(
      `${process.env.API_URL}api/v1/courses?${Object.keys(searchParams)
        .map(
          (searchParam: string) =>
            `${searchParam}=${
              searchParams[searchParam as keyof typeof searchParams]
            }`
        )
        .join(`&`)}`
    );

    const coursesWithProgress: any[] = await Promise.all(
      courses.data.map(async (course: any) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progressPercentage = await getProgress(userId, course._id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );
    // console.log(coursesWithProgress);

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
