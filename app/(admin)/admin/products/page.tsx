import { getAdminProducts, deleteProduct } from "@/components/lib/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import EditProductModal from "@/components/EditProductModal";
import { ProductWithCategory } from "@/types";
import CategoryFilters from "@/components/CategoryFilters";
import AddProductModal from "@/components/AddProductModal";

export default async function ManageProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  // 1. التحقق من الصلاحيات
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // 2. جلب البيانات من السيرفر
  const res = await getAdminProducts();
  
  // تحويل البيانات لضمان عدم وجود مشاكل في التمرير بين السيرفر والكلينت (Deep Clone)
  const allProducts: ProductWithCategory[] = res.success 
    ? JSON.parse(JSON.stringify(res.products)) 
    : [];

  // 3. استخراج الفئات الفريدة للفلترة
  const categories = Array.from(
    new Set(allProducts.map((p) => p.category?.slug).filter(Boolean))
  ) as string[];

  // 4. منطق الفلترة
  const selectedCategory = params.category || "all";
  const filteredProducts = selectedCategory === "all" 
    ? allProducts 
    : allProducts.filter(p => p.category?.slug === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFA] p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
          
            <h1 className="text-4xl font-black text-brand-primary tracking-tight flex items-center gap-3">
              Manage Products
            </h1>
            <p className="text-gray-500 font-medium">Create, edit, and organize your fashion catalog.</p>
          </div>
          
          <div className="flex gap-3">
         <AddProductModal />
           <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary/70 hover:text-brand-primary transition-colors bg-brand-accent/20 px-4 py-2 rounded-lg border border-emerald-100">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          </div>
        </div>

        {/* Filters & Tabs Section */}
        <div className="w-full">
          
           <CategoryFilters 
             key={selectedCategory} 
             categories={categories} 
             baseUrl="/admin/products" 
           />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-brand-primary/5 border border-brand-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Product Info</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Category</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Price</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Stock Status</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F8FAFA]/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-14 relative rounded-xl overflow-hidden border border-brand-accent/30 bg-gray-50 shrink-0 shadow-sm">
                          <Image 
                            src={product.images?.[0] || "/placeholder.jpg"} 
                            alt={product.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-brand-primary text-base leading-tight">{product.name}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Ref: {product.id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex px-3 py-1 bg-[#9EC5AB]/10 text-brand-secondary border border-brand-accent/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-lg font-black text-brand-primary">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                            <span className={`text-[11px] font-black uppercase tracking-wide ${product.stock < 10 ? 'text-orange-600' : 'text-brand-secondary'}`}>
                                {product.stock} Units Left
                            </span>
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${product.stock < 10 ? 'bg-orange-500' : 'bg-brand-accent'}`}
                                    style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }} // افتراض أن 100 هي سعة المخزون الكاملة للتوضيح البصري
                                />
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <EditProductModal product={product} />
                        <form action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}>
                          <Button 
                            type="submit" 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                            <div className="p-6 bg-gray-50 rounded-full">
                                <Package size={60} className="text-brand-accent opacity-40" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-brand-primary">No Products Found</p>
                                <p className="text-sm text-gray-400 font-medium">There are no items listed in the  category.</p>
                            </div>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}