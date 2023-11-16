import axios from "axios";

const groupByCourse = async (purchases: any[]) => {
  const courses = await Promise.all(
    purchases.map((purchase) => {
      return axios.get(
        `${process.env.API_URL}api/v1/courses/${purchase.courseId}`
      );
    })
  );

  const grouped: { [courseTitle: string]: number } = {};

  courses.forEach((course) => {
    const courseTitle = course.data.data.data.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += course.data.data.data.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const { data: purchases } = await axios.get(
      `${process.env.API_URL}api/v1/purchase?userId=${userId}`
    );

    const groupedEarnings = await groupByCourse(purchases.data);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.results;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
