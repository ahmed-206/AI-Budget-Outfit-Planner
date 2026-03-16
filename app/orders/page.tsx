import { getUserOrders } from "@/components/lib/actions/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Calendar,Clock,CreditCard, Truck,CheckCircle2} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function OrdersPage() {
  const { success, data: orders, error } = await getUserOrders();

  if (!success || !orders) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-brand-primary">Error fetching orders</h1>
        <p className="text-destructive">{error || "Something went wrong"}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-32 px-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="p-6 bg-brand-accent/10 rounded-full">
            <ShoppingBag size={64} className="text-brand-secondary opacity-50" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-brand-primary">No orders found</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your wardrobe is waiting! Start exploring our AI-curated collections today.
        </p>
        <Link href="/shop">
          <Button className="mt-4 bg-brand-primary hover:bg-brand-secondary text-white px-8 rounded-full h-12 transition-all shadow-lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock size={14} /> };
      case "PROCESSING":
        return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: <CreditCard size={14} /> };
      case "SHIPPED":
        return { color: "bg-brand-accent/20 text-brand-secondary border-brand-accent/30", icon: <Truck size={14} /> };
      case "DELIVERED":
        return { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={14} /> };
      default:
        return { color: "bg-gray-100 text-gray-700 border-gray-200", icon: <Package size={14} /> };
    }
  };

return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <header className="mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight flex items-center gap-4">
          <div className="p-3 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
            <Package className="h-8 w-8 text-brand-primary" />
          </div>
          Order History
        </h1>
        <p className="text-muted-foreground ml-16">Manage and track your recent fashion purchases.</p>
      </header>

      <div className="grid gap-8">
        {orders.map((order) => {
          const status = getStatusColor(order.status);
          return (
            <Card
              key={order.id}
              className="overflow-hidden border-brand-accent/20 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl"
            >
              <CardHeader className="bg-brand-accent/5 border-b border-brand-accent/10 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <CardTitle className="text-lg font-bold text-brand-primary">
                        Order <span className="text-brand-secondary">#{order.id.slice(-8).toUpperCase()}</span>
                      </CardTitle>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
        {status.icon}
        {order.status}
      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={15} className="text-brand-secondary" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-brand-accent" />
                      <span>{order.orderItems.length} Items</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-brand-accent/10 shadow-sm flex flex-col items-end min-w-[140px]">
                    <p className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-brand-primary">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y divide-brand-accent/10">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-brand-accent/20 bg-gray-50 relative group">
                        <Image
                          fill
                          src={item.product.images[0] || "/placeholder.jpg"}
                          alt={item.product.name}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-bold text-brand-primary text-lg truncate hover:text-brand-secondary transition-colors cursor-pointer">
                          {item.product.name}
                        </h4>
                        
                        {/* تفاصيل المقاس واللون - معالجة البيانات المضافة */}
                        <div className="flex flex-wrap gap-3 mt-2">
                          {item.size && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 uppercase">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                              <span>Color:</span>
                              <div 
                                className="w-3 h-3 rounded-full border border-black/10" 
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="capitalize">{item.color}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground pt-1">
                          Quantity: <span className="font-bold text-brand-primary">{item.quantity}</span> × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-black text-brand-primary">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              
            </Card>
          );
        })}
      </div>
    </div>
  );
}
