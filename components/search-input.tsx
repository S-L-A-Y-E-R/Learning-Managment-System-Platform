"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchParams.get("category");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          category: currentCategory,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    console.log(url);

    router.push(url);
  }, [debouncedValue, currentCategory, router, pathname]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200 dark:text-black"
        placeholder="Search for a course"
      />
    </div>
  );
};
