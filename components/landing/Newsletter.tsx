import { Button } from '../ui/button'

function Newsletter() {
  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
    {/* <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div> */}
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
          className="bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-full px-8 transition-transform active:scale-95"
        >
          Subscribe
        </Button>
      </div>
      <p className="text-xs text-white/40 mt-4 italic">
        * By subscribing, you agree to our Privacy Policy.
      </p>
    </div>
  </section>
  )
}

export default Newsletter