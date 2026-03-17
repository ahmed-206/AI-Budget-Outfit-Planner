import Image from 'next/image';
import React, { useEffect, useState, useTransition } from 'react'
import { getCart, removeFromCart } from './lib/actions/cart';
import { Loader2, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from './lib/actions/checkout';


interface CartProduct {
    name: string;
    price: number | string;
    images: string[];
}

interface CartItem {
    id: string;
    quantity: number;
    size?: string | null; 
    color?: string | null; 
    product: CartProduct;
}

interface CartWithItems {
    id: string;
    items: CartItem[];
}

function CartSheet({ initialCart }: { initialCart?: CartWithItems | null }) {
    const [cart, setCart] = useState<CartWithItems | null>(initialCart || null);

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (initialCart) {
            setCart(initialCart);
        }
    }, [initialCart])


    const loadCart = async () => {
        setLoading(true);
        try {
            const data = await getCart();
            setCart(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isOpen) {
            loadCart();
        }
    }, [isOpen]);


    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total: number, item: CartItem) => {
            return total + (Number(item.product.price) * item.quantity);
        }, 0);
    };

    const itemCount = cart?.items?.reduce((acc: number, item: CartItem) => acc + item.quantity, 0) || 0;


    const handleRemove = async (id: string) => {
        await removeFromCart(id);
        loadCart(); // Reload after delete
    };

    const handleCheckout = async () => {
        if (!cart) return;
        startTransition(async () => {
            try {
                const result = await createCheckoutSession();
                if (result?.url) {
                    router.push(result.url);
                }
            } catch (e) {
                console.error("Checkout failed", e);
            }
        });
    };

  return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                    <SheetDescription>
                        {itemCount === 0 ? "Your cart is empty." : `You have ${itemCount} items.`}
                    </SheetDescription>
                </SheetHeader>

                <div className='flex-1 overflow-y-auto py-6'>
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-emerald-600" /></div>
                    ) : !cart || cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                            <ShoppingCart className="h-12 w-12 opacity-20" />
                            <p>Start adding fresh products!</p>
                        </div>
                    ) : (
                        <ul className="space-y-6">
                            {cart.items.map((item: CartItem) => (
                                <li key={item.id} className="flex gap-4 items-start">
                                    <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border">
                                        {/* حل مشكلة الصورة باستخدام Optional Chaining */}
                                        <Image 
                                            src={item.product.images?.[0] || "/placeholder.jpg"} 
                                            alt={item.product.name} 
                                            width={80} 
                                            height={80} 
                                            className="h-full w-full object-cover" 
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-bold text-sm line-clamp-1 text-brand-primary">{item.product.name}</h4>
                                        
                                        {/* عرض المقاس واللون المختارين */}
                                        <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase">
                                            {item.size && (
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 border">
                                                    Size: {item.size}
                                                </span>
                                            )}
                                            {item.color && (
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 border flex items-center gap-1">
                                                    Color: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm font-medium text-emerald-700">
                                            {item.quantity} x ${Number(item.product.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cart && cart.items.length > 0 && (
                    <SheetFooter className="border-t pt-6">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between font-bold text-xl text-brand-primary">
                                <span>Subtotal</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full bg-brand-primary/90 hover:bg-brand-primary text-white h-12 text-lg font-bold shadow-lg"
                                onClick={handleCheckout}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="animate-spin" /> : "Proceed to Checkout"}
                            </Button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )

}

export default CartSheet