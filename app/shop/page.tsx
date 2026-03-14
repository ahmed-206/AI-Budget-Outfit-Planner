import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const selectedCategory = resolvedParams.category;

  // Fetch all categories for the filter tabs
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch products, filtering by category if one is selected
  const products = await prisma.product.findMany({
    where: selectedCategory
      ? {
          category: {
            slug: selectedCategory,
          },
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Shop All Products</h1>
          <p className="text-gray-600">Browse our collection of products.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pb-4 border-b">
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
             <Link
             key={category.id}
             href={`/shop?category=${category.slug}`}
             className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
               selectedCategory === category.slug
                 ? "bg-black text-white border-black"
                 : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
             }`}
           >
             {category.name}
           </Link>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
             <h2 className="text-2xl font-semibold text-gray-700">No products found.</h2>
             <p className="text-gray-500 mt-2">Try selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border transition-all hover:shadow-lg"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                     {product.category.name}
                  </div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                     <span className="font-extrabold text-lg">${Number(product.price).toFixed(2)}</span>
                     <Button variant="outline" size="sm" className="rounded-full">View</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopPage;
