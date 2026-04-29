import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import NewArrival from "@/components/landing/NewArrival";
import Categories from "@/components/landing/Categories";
import HowItWorks from "@/components/landing/HowItWorks";
import Newsletter from "@/components/landing/Newsletter";

function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <NewArrival />
      <Categories />
      <HowItWorks />
      <Newsletter />
    </main>
  );
}

export default Home;
