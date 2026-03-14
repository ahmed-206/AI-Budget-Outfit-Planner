import { getAdminOrders } from "@/components/lib/actions/admin-actions";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const res = await getAdminOrders();
  const orders = res.success ? res.orders : [];

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-emerald-900">Manage Orders</h1>
          <Link href="/admin" className="text-sm text-emerald-700 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Order ID</th>
                  <th scope="col" className="px-6 py-3">Customer ID</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Total Amount</th>
                  <th scope="col" className="px-6 py-3">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order: any) => (
                  <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 truncate max-w-[150px]" title={order.clerkUserId}>
                        {order.clerkUserId}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.orderItems.map((item: any) => (
                          <div key={item.id} className="text-xs">
                            {item.quantity}x {item.product.name} 
                            {item.size && ` (${item.size})`}
                            {item.color && ` - ${item.color}`}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}

                {(!orders || orders.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No orders found.
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
