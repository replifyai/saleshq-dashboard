export default function SocialProofSection() {
  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-[0.2em] mb-6">
            Trusted by leading sales teams at
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
            <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold flex items-center justify-center backdrop-blur">
              TechCorp
            </div>
            <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold flex items-center justify-center backdrop-blur">
              SalesFlow
            </div>
            <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold flex items-center justify-center backdrop-blur">
              GrowthCo
            </div>
            <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold flex items-center justify-center backdrop-blur">
              ScaleUp
            </div>
            <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold flex items-center justify-center backdrop-blur">
              RevTech
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur">
            <div className="text-3xl font-bold text-blue-400 mb-2">1,000+</div>
            <div className="text-gray-300 font-medium">Sales Teams</div>
          </div>
          <div className="text-center rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur">
            <div className="text-3xl font-bold text-emerald-400 mb-2">50M+</div>
            <div className="text-gray-300 font-medium">Queries Processed</div>
          </div>
          <div className="text-center rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur">
            <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
            <div className="text-gray-300 font-medium">Customer Satisfaction</div>
          </div>
          <div className="text-center rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur">
            <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
            <div className="text-gray-300 font-medium">AI Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
}