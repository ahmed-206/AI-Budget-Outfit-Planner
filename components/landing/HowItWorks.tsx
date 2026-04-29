

function HowItWorks() {
  return (
    <section className="py-20 bg-background/5">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-primary">
          Your Personal AI Stylist
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          We use artificial intelligence to help you build the perfect wardrobe
          based on your style, size, and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-primary -z-10"></div>

        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 border-4 border-brand-accent/20">
            <span className="text-2xl font-bold text-primary">1</span>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Define Style</h3>
          <p className="text-gray-600">Share your preferences and what occasions you&apos;re shopping for.</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 border-4 border-brand-accent/20">
            <span className="text-2xl font-bold text-primary">2</span>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">AI Analysis</h3>
          <p className="text-gray-600">Our AI curates a selection of pieces that match your unique profile.</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 border-4 border-brand-accent/20">
            <span className="text-2xl font-bold text-primary">3</span>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Ready to Wear</h3>
          <p className="text-gray-600">Review your personalized collection and checkout in one click.</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default HowItWorks