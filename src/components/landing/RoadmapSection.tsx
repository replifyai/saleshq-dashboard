export default function RoadmapSection() {
  const roadmap = [
    { stage: "Now", items: ["Document ingestion (PDF, Notion, GDocs)", "Source-cited answers", "Sales chat interface"] },
    { stage: "Next", items: ["CRM integration (HubSpot/Salesforce)", "Battlecard generator", "Slack/Teams app"] },
    { stage: "Later", items: ["Call transcript enrichment", "Analytics & coaching", "Multi-market language support"] },
  ];

  return (
    <section aria-label="Roadmap" className="py-16 sm:py-24" id="roadmap">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Roadmap</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">What s coming next inspired by feedback from early users.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmap.map((r) => (
            <div key={r.stage} className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-white/70 dark:bg-gray-900/40 backdrop-blur supports-[backdrop-filter]:bg-white/10">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{r.stage}</p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                {r.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}