import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import ProductSelection from "@/components/ProductSelection";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function productPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }, // لتمكين الوصول لاسم القسم بشكل صحيح
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Section - استخدام أول صورة في المصفوفة */}
        <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 aspect-square relative">
          <Image
            src={product.images[0]} // استخدام المصفوفة الجديدة
            alt={product.name}
            className="w-full h-full object-cover"
            fill
            priority
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              {product.category.name}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-gray-800">
              ${Number(product.price).toFixed(2)}
            </p>

            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>In Stock ({product.stock} units)</span>
            </div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Selection Section */}
          <ProductSelection 
            productId={product.id} 
            sizes={product.sizes} 
            colors={product.colors} 
          />
        </div>
      </div>
    </div>
  );
}

export default productPage;
