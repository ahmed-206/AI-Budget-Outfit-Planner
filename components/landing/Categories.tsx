
import { CategoryCarousel } from '../category-carousel'
import prisma from '@/lib/prisma';

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 6,
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

async function Categories() {
    const categories = await getCategories();
  return (
    <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <CategoryCarousel categories={categories} />
            </div>
          </section>
  )
}

export default Categories