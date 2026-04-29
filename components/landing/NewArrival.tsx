import prisma from '@/lib/prisma';
import { Button } from '@base-ui/react'
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}
async function NewArrival() {
    const featuredProducts = await getFeaturedProducts();
  return (
    <section className="py-20 bg-background">
        <div className="container mx-auto px-4 space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-primary">
                New Arrivals
              </h2>
              <p className="text-gray-600 mt-2">
                Explore the latest trends in our curated collection.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-brand-secondary font-semibold hover:text-brand-primary transition-colors flex items-center gap-1 group"
            >
              View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col">
                <Link href={`/products/${product.id}`} className="relative aspect-3/4 overflow-hidden bg-gray-100">
                  <Image
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </Link>
    
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-foreground text-lg mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="font-extrabold text-xl text-primary">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <Button
                      
                      className="bg-primary hover:bg-primary/80 text-white font-bold rounded-md px-4 py-2"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default NewArrival