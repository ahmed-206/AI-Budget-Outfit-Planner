"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFiltersProps {
  categories: string[];
  baseUrl: string;
}

export default function CategoryFilters({ categories, baseUrl }: CategoryFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category") || "all";

  const handleChange = (value: string) => {
    router.replace(`${baseUrl}?category=${encodeURIComponent(value)}`);
  };

  return (
    <Tabs value={selectedCategory} onValueChange={handleChange} className="w-full">
      <TabsList>
        <TabsTrigger value="all" className="text-brand-primary">All Items</TabsTrigger>
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat} className="text-brand-primary">
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}