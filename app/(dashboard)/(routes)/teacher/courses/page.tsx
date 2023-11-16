import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import axios from "axios";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { data: courses } = await axios.get(
    `${process.env.API_URL}api/v1/courses?userId=${userId}`
  );

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses.data} />
    </div>
  );
};

export default CoursesPage;
