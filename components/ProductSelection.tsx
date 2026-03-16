"use client"

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { cn } from "@/lib/utils";

interface ProductSelectionProps {
    productId: string;
    sizes: string[];
    colors: string[];
}

export default function ProductSelection({ productId, sizes, colors }: ProductSelectionProps) {
    const [selectedSize, setSelectedSize] = useState<string>(sizes.length > 0 ? sizes[0] : "");
    const [selectedColor, setSelectedColor] = useState<string>(colors.length > 0 ? colors[0] : "");

    return (
        <div className="space-y-8 pt-8 border-t border-brand-accent/20">
            {/* Sizes Selection */}
            {sizes.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary">
                            Select Size
                        </h3>
                        <button className="text-xs text-brand-secondary hover:underline font-medium">
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "min-w-[50px] h-11 px-3 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition-all duration-300",
                                    selectedSize === size
                                        ? "border-brand-primary bg-brand-primary text-white shadow-md scale-105"
                                        : "border-gray-100 bg-white text-gray-600 hover:border-brand-accent hover:text-brand-primary"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Colors Selection */}
            {colors.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary mb-4">
                        Available Colors: <span className="text-brand-secondary capitalize ml-1">{selectedColor}</span>
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {colors.map((color) => {
                            const isSelected = selectedColor === color;
                            return (
                                <div key={color} className="relative group">
                                    <button
                                        onClick={() => setSelectedColor(color)}
                                        className={cn(
                                            "w-9 h-9 rounded-full border-2 transition-all duration-300 relative z-10",
                                            isSelected 
                                                ? "border-white ring-2 ring-brand-primary scale-110 shadow-sm" 
                                                : "border-transparent hover:scale-110"
                                        )}
                                        style={{
                                            backgroundColor: color.includes("#") ? color : color.toLowerCase(),
                                        }}
                                        title={color}
                                    />
                                    {/* تلميح صغير عند الوقوف بالماوس */}
                                    {!color.includes("#") && (
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {color}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Action Area */}
            <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <AddToCartButton
                    productId={productId}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    size="lg"
                    className={cn(
                        "w-full md:w-full h-14 text-base font-bold uppercase tracking-widest transition-all duration-500",
                        "bg-brand-primary hover:bg-brand-secondary text-white rounded-xl",
                        "shadow-lg hover:shadow-brand-secondary/20 hover:-translate-y-1 active:translate-y-0"
                    )}
                />
                
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Secure payment & Free shipping on orders over $150
                </p>
            </div>
        </div>
    );
}