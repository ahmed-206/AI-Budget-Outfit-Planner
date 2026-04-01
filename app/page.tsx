import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { BudgetPlannerSheet } from "../components/BudgetPlannerSheet";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";
import { CategoryCarousel } from "@/components/category-carousel";

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 6,
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-primary text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1753369232906-7dddb0011aa9?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-30 "></div>
        <div className="relative container mx-auto px-4 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-sm font-medium text-brand-accent ring-1 ring-inset ring-brand-accent/20">
      <span className="flex h-2 w-2 rounded-full bg-brand-secondary mr-2 animate-pulse"></span>
      Experience the Future of Fashion
    </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl leading-tight">
      Elevate Your Style with <br />
      <span className="text-brand-accent">AI-Powered Curation</span>
    </h1>
         <p className="text-lg text-emerald-50/80 max-w-2xl mx-auto">
      Discover personalized outfits tailored to your taste. Our AI Stylist 
      helps you build a sustainable wardrobe that fits your lifestyle 
      and budget effortlessly.
    </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
      <Button className="bg-brand-secondary hover:bg-brand-secondary/90 text-white px-8 h-12 rounded-full transition-all">
        <Link className="flex items-center gap-2" href="/shop">
          Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
          <div className="flex items-center justify-center">
            <BudgetPlannerSheet />
          </div>
        </div>
      </section>

      {/* Features Grid */}
     <section className="py-16 bg-white">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="flex flex-col items-center text-center space-y-3 p-8 rounded-2xl bg-brand-accent/5 border border-brand-accent/10">
        <div className="h-14 w-14 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-2">
          <Leaf className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-brand-primary">Sustainable Fashion</h3>
        <p className="text-gray-600">
          Ethically sourced materials that care for you and the planet.
        </p>
      </div>

      <div className="flex flex-col items-center text-center space-y-3 p-8 rounded-2xl bg-brand-accent/5 border border-brand-accent/10">
        <div className="h-14 w-14 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-2">
          <Truck className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-brand-primary">Express Shipping</h3>
        <p className="text-gray-600">
          Fast and secure delivery to your doorstep within 48 hours.
        </p>
      </div>

      <div className="flex flex-col items-center text-center space-y-3 p-8 rounded-2xl bg-brand-accent/5 border border-brand-accent/10">
        <div className="h-14 w-14 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-2">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-brand-primary">Premium Quality</h3>
        <p className="text-gray-600">
          Hand-picked fabrics ensuring the highest standards of durability.
        </p>
      </div>
    </div>
  </section>

      {/* Featured Products */}
    <section className="py-20 bg-gray-50/50">
    <div className="container mx-auto px-4 space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-brand-primary">
            New Arrivals
          </h2>
          <p className="text-gray-600 mt-2">
            Explore the latest trends in our curated collection.
          </p>
        </div>
        <Link
          href="/shop"
          className="text-brand-secondary font-semibold hover:text-brand-primary transition-colors flex items-center gap-1 group"
        >
          View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredProducts.map((product) => (
          <div key={product.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col">
            <Link href={`/products/${product.id}`} className="relative aspect-3/4 overflow-hidden bg-gray-100">
              <Image
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </Link>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-brand-primary text-lg mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span className="font-extrabold text-xl text-brand-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
                <Button
                  size="sm"
                  className="bg-brand-primary hover:bg-brand-secondary text-white rounded-full px-5"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

      {/* Categories Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <CategoryCarousel categories={categories} />
        </div>
      </section>

      {/* How It Works Section */}
    <section className="py-20 bg-brand-primary/5">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-brand-primary">
          Your Personal AI Stylist
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          We use artificial intelligence to help you build the perfect wardrobe
          based on your style, size, and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-brand-accent/30 -z-10"></div>

        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 border-4 border-brand-accent/20">
            <span className="text-2xl font-bold text-brand-primary">1</span>
          </div>
          <h3 className="text-xl font-bold text-brand-primary mb-2">Define Style</h3>
          <p className="text-gray-600">Share your preferences and what occasions you're shopping for.</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 border-4 border-brand-accent/20">
            <span className="text-2xl font-bold text-brand-primary">2</span>
          </div>
          <h3 className="text-xl font-bold text-brand-primary mb-2">AI Analysis</h3>
          <p className="text-gray-600">Our AI curates a selection of pieces that match your unique profile.</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 border-4 border-brand-accent/20">
            <span className="text-2xl font-bold text-brand-primary">3</span>
          </div>
          <h3 className="text-xl font-bold text-brand-primary mb-2">Ready to Wear</h3>
          <p className="text-gray-600">Review your personalized collection and checkout in one click.</p>
        </div>
      </div>
    </div>
  </section>

      {/* Newsletter Section */}
     <section className="py-24 bg-brand-primary text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
    <div className="container mx-auto px-4 relative flex flex-col items-center text-center space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold">
        Join the Elite Club
      </h2>
      <p className="text-brand-accent max-w-xl text-lg opacity-90">
        Subscribe to get early access to new drops, styling tips, 
        and exclusive member-only discounts.
      </p>
      <div className="flex flex-col items-center sm:flex-row gap-3 w-full max-w-md">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 border-white/20 border bg-white/10 backdrop-blur-md rounded-full px-6 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
        <Button
          size="lg"
          className="bg-brand-secondary hover:bg-brand-secondary/90 text-white font-semibold rounded-full px-8 transition-transform active:scale-95"
        >
          Subscribe
        </Button>
      </div>
      <p className="text-xs text-white/40 mt-4 italic">
        * By subscribing, you agree to our Privacy Policy.
      </p>
    </div>
  </section>
    </main>
  );
}

export default Home;