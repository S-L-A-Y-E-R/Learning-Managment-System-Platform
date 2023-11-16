import { CourseCard } from "@/components/course-card";

export const CoursesList = ({ items }: any) => {
  // console.log(items);

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item: any) => (
          <CourseCard
            key={item.data?.data?.id || item._id}
            id={item.data?.data?.id || item._id}
            title={item.data?.data?.title || item.title}
            imageUrl={item.data?.data?.imageUrl || item.imageUrl}
            chaptersLength={
              item.data?.data?.chapters.length || item.chapters.length
            }
            price={item.data?.data?.price || item.price}
            progress={item.progress}
            category={item.data?.data?.category || item.category}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  );
};
