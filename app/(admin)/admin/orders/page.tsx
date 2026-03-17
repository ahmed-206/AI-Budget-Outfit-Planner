import { getAdminOrders } from "@/components/lib/actions/admin-actions";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  CreditCard,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  clerkUserId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  totalAmount: number | string;
  createdAt: Date | string;
  orderItems: OrderItem[];
}
export default async function AdminOrdersPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const res = await getAdminOrders();
  const orders = res.success ? res.orders : [];

const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-amber-50 text-amber-700 border-amber-100", icon: <Clock size={14} /> };
      case "PROCESSING":
        return { color: "bg-blue-50 text-blue-700 border-blue-100", icon: <CreditCard size={14} /> };
      case "SHIPPED":
        return { color: "bg-[#9EC5AB]/20 text-[#32746D] border-[#9EC5AB]/30", icon: <Truck size={14} /> };
      case "DELIVERED":
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: <CheckCircle2 size={14} /> };
      default:
        return { color: "bg-gray-50 text-gray-700 border-gray-100", icon: <Package size={14} /> };
    }
  };
  return (
    <div className="min-h-screen bg-[#F8FAFA] p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
         
            <h1 className="text-4xl font-black text-brand-primary tracking-tight flex items-center gap-3">
              Manage Orders
            </h1>
            <p className="text-gray-500 font-medium">
              Review and process customer transactions.
            </p>
          </div>

         <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary/70 hover:text-brand-primary transition-colors bg-brand-accent/20 px-4 py-2 rounded-lg border border-emerald-100">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* Stats Summary (Quick View) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-brand-accent/20 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">
              Total Orders
            </p>
            <p className="text-2xl font-black text-brand-primary">
              {orders?.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-brand-accent/20 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Revenue</p>
            <p className="text-2xl font-black text-brand-secondary">
              $
              {orders
                ?.reduce((acc, curr) => acc + Number(curr.totalAmount), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-brand-primary/5 border border-brand-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">
                    Customer Info
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-right">
                    Products
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders?.map((order) => {
                  const statusInfo = getStatusStyle(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#F8FAFA] transition-colors group"
                    >
                      <td className="px-8 py-6 font-black text-[#104F55]">
                        <span className="text-brand-accent">#</span>
                        {order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700 truncate max-w-[140px]">
                            {order.clerkUserId}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            Verified User
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500 font-semibold">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-lg font-black text-brand-primary">
                          ${Number(order.totalAmount).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-end gap-2">
                          {order.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col items-end"
                            >
                              <span className="text-xs font-bold text-gray-800">
                                {item.quantity}x {item.product.name}
                              </span>
                              {(item.size || item.color) && (
                                <div className="flex gap-1 mt-0.5">
                                  {item.size && (
                                    <span className="text-[9px] px-1.5 bg-brand-accent/20 text-brand-primary rounded font-bold uppercase">
                                      Size: {item.size}
                                    </span>
                                  )}
                                  {item.color && (
                                    <span className="text-[9px] px-1.5 bg-brand-accent/20 text-brand-primary rounded font-bold uppercase">
                                      Color: {item.color}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {orders?.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-32 text-center text-gray-400 font-medium"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <Package
                          size={60}
                          className="text-brand-accent opacity-20"
                        />
                        <p>No transactions recorded yet.</p>
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
