import { Leaf, ShieldCheck, Truck } from "lucide-react"


function Features() {
  return (
   <section className="py-16 bg-background border-t border-b">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="flex flex-col items-center text-center space-y-3 p-8 rounded-2xl bg-white border border-brand-accent/10">
        <div className="h-14 w-14 bg-brand-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
          <Leaf className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-primary">Sustainable Fashion</h3>
        <p className="text-gray-600">
          Ethically sourced materials that care for you and the planet.
        </p>
      </div>

      <div className="flex flex-col items-center text-center space-y-3 p-8 rounded-2xl bg-white border border-brand-accent/10">
        <div className="h-14 w-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
          <Truck className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-primary">Express Shipping</h3>
        <p className="text-gray-600">
          Fast and secure delivery to your doorstep within 48 hours.
        </p>
      </div>

      <div className="flex flex-col items-center text-center space-y-3 p-8 rounded-2xl bg-white border border-brand-accent/10">
        <div className="h-14 w-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-primary">Premium Quality</h3>
        <p className="text-gray-600">
          Hand-picked fabrics ensuring the highest standards of durability.
        </p>
      </div>
    </div>
  </section>
  )
}

export default Features