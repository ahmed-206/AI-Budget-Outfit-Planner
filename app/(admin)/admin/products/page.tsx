import { getAdminProducts, deleteProduct } from "@/components/lib/actions/admin-actions";
import { formatCurrency } from "@/lib/utils"; // Assuming there's a format helper or we can use formatter
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import EditProductModal from "@/components/EditProductModal";

export default async function ManageProductsPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const res = await getAdminProducts();
  const products = res.success ? res.products : [];

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-emerald-900">Manage Products</h1>
          <Link href="/admin" className="text-sm text-emerald-700 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Product Name</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Stock</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: any) => (
                  <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                      {product.images?.[0] ? (
                        <div className="w-10 h-10 relative rounded overflow-hidden">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                      )}
                      {product.name}
                    </td>
                    <td className="px-6 py-4">{product.category.name}</td>
                    <td className="px-6 py-4">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditProductModal product={product} />
                        <form action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}>
                          <Button type="submit" variant="destructive" size="sm" className="gap-2">
                            <Trash2 className="w-4 h-4" /> Delete
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {(!products || products.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No products found.
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
