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
        <div className="space-y-6 pt-6 border-t border-gray-100">
            {/* Sizes Display */}
            {sizes.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Available Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "px-4 py-2 border rounded-md text-sm font-medium transition",
                                    selectedSize === size
                                        ? "border-black bg-black text-white"
                                        : "border-gray-200 hover:border-black"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Colors Display */}
            {colors.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Available Colors
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => (
                            <div key={color} className="flex flex-col items-center gap-1">
                                <button
                                    onClick={() => setSelectedColor(color)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border cursor-pointer transition",
                                        selectedColor === color
                                            ? "ring-2 ring-offset-2 ring-black border-transparent"
                                            : "border-gray-300 hover:scale-110"
                                    )}
                                    style={{
                                        backgroundColor: color.includes("#")
                                            ? color
                                            : color.toLowerCase(),
                                    }}
                                    title={color}
                                />
                                <span className="text-[10px] text-gray-500">
                                    {color.includes("#") ? "" : color}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="pt-8">
                <AddToCartButton
                    productId={productId}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    size="lg"
                    className="w-full md:w-auto bg-black hover:bg-gray-800 text-white min-w-[200px] rounded-full"
                />
            </div>
        </div>
    );
}
