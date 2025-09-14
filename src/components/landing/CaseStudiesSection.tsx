export default function CaseStudiesSection() {
  const cases = [
    {
      company: "Acme SaaS",
      headline: "Reduced ramp time by 47%",
      metric: "+32% win rate",
      summary: "New reps answered complex product questions in seconds with source-backed responses.",
    },
    {
      company: "Nimbus Cloud",
      headline: "Shortened sales cycles by 22%",
      metric: "-38% time to proposal",
      summary: "AI assembled accurate specs and pricing details instantly, eliminating back-and-forth.",
    },
    {
      company: "Vector Labs",
      headline: "Scaled enablement with 0 extra headcount",
      metric: "95% query resolution",
      summary: "SalesHQ learned from every interaction and kept knowledge up to date automatically.",
    },
  ];

  return (
    <section aria-label="Case studies" className="py-16 sm:py-24" id="case-studies">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Real results, not promises</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Tangible outcomes from teams using SalesHQ in the field.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((item) => (
            <div key={item.company} className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-white/70 dark:bg-gray-900/40 backdrop-blur supports-[backdrop-filter]:bg-white/10">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{item.company}</p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{item.headline}</h3>
              <p className="mt-1 text-emerald-600 dark:text-emerald-400 font-semibold">{item.metric}</p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}