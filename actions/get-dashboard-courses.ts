import axios from "axios";

import { getProgress } from "@/actions/get-progress";

export const getDashboardCourses = async (userId: string): Promise<any> => {
  try {
    const { data: purchasedCourses } = await axios.get(
      `${process.env.API_URL}api/v1/purchase?userId=${userId}`
    );

    const courses = await Promise.all(
      purchasedCourses.data.map(async (course: any) => {
        const { data: courseData } = await axios.get(
          `${process.env.API_URL}api/v1/courses/${course.courseId}`
        );
        return courseData;
      })
    );

    for (let course of courses) {
      const progress = await getProgress(userId, course.data.data._id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.data.data.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.data.data.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
