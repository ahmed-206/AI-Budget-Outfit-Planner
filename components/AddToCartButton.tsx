"use client"

import  { useState, useTransition } from 'react'
import { addToCart } from './lib/actions/cart';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Check, Loader2, ShoppingCart } from 'lucide-react';


interface AddToCartButtonProps {
    productId: string;
    variant?: "default" | "secondary" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    selectedSize?: string;
    selectedColor?: string;
}

export function AddToCartButton({ productId, variant = "default", size = "default", className, selectedSize, selectedColor }: AddToCartButtonProps) {

    const [isPending, startTransition] = useTransition(); //يسمح بتشغيل عمليات غير عاجلة بدون تجميد الواجهة.
    const [success, setSuccess] = useState(false);
    const router = useRouter(); //ليعيد جلب البيانات من السيرفر.
    const handleAdd = () => {
        startTransition(async () => {
            try {
                await addToCart(productId, 1, selectedSize, selectedColor);
                setSuccess(true);
                toast.success("Item added to cart");
                setTimeout(() => setSuccess(false), 2000);
                router.refresh(); //ليعيد جلب البيانات من السيرفر.
            } catch (error) {
                console.error("Failed to add to cart", error);
                toast.error("Failed to add to cart");

            }
        });
    };


    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleAdd}
            disabled={isPending}

        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />

            ) : success ? (
                <Check className="h-4 w-4" />
            ) : (
                <>
                    {size !== "icon" && <ShoppingCart className="mr-2 h-4 w-4" />}
                    {size !== "icon" ? "Add to Cart" : <ShoppingCart className="h-4 w-4" />}
                </>
            )
            }

        </Button>
    )
}

export default AddToCartButton