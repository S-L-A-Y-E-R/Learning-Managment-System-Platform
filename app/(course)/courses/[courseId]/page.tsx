import axios from "axios";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { data } = await axios.get(
    `${process.env.API_URL}api/v1/courses/${params.courseId}`
  );

  if (!data.data.data) {
    return redirect("/");
  }

  const chapters = await axios.get(
    `${process.env.API_URL}api/v1/chapters?courseId=${params.courseId}&&isPublished=true`
  );

  return redirect(
    `/courses/${data.data.data._id}/chapters/${chapters.data.data[0]._id}`
  );
};

export default CourseIdPage;
