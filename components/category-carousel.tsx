'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Category } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface CategoryCarouselProps {
    categories: Category[]
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
    return (
        <div className="w-full relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 px-1 gap-4">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-brand-primary tracking-tight">Shop by Category</h2>
                    <p className="text-gray-500 mt-2">Discover our curated collections for every occasion.</p>
                </div>
                
                {/* Custom Indicators/Navigation can be added here */}
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {categories.map((category) => (
                        <CarouselItem key={category.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                            <Link href={`/products?category=${category.slug}`} className="group block h-full">
                                <Card className="h-full border-none shadow-none bg-transparent overflow-hidden">
                                    <CardContent className="p-0 flex flex-col h-full">
                                        {/* Image Circle Container */}
                                        <div className="relative aspect-square rounded-xl overflow-hidden bg-brand-accent/5 border border-brand-accent/10 transition-all duration-500 group-hover:shadow-xl group-hover:border-brand-secondary/30">
                                            <Image
                                                src={category.image || "https://via.placeholder.com/300"}
                                                alt={category.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Overlay Effect */}
                                            <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/10 transition-colors duration-500" />
                                        </div>
                                        
                                        {/* Category Name */}
                                        <div className="mt-6 text-center">
                                            <h3 className="font-bold text-brand-primary group-hover:text-brand-secondary transition-colors text-lg">
                                                {category.name}
                                            </h3>
                                            <div className="w-0 group-hover:w-12 h-0.5 bg-brand-secondary mx-auto mt-2 transition-all duration-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Buttons Styled */}
                <div className="flex justify-center md:block">
                    <CarouselPrevious className="hidden md:flex -left-6 lg:-left-12 h-12 w-12 bg-white border-brand-accent/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm" />
                    <CarouselNext className="hidden md:flex -right-6 lg:-right-12 h-12 w-12 bg-white border-brand-accent/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm" />
                </div>
            </Carousel>
        </div>
    )
}