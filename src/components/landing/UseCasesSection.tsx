import { Badge } from "../ui/badge";
import { Search, Sparkles, RefreshCcw } from "lucide-react";

export default function UseCasesSection() {
  const items = [
    {
      title: "Answer product questions instantly",
      description: "Ask in plain English and get source‑backed answers with links—no more tab hopping.",
      icon: Search,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      title: "Build LSM-powered battlecards",
      description: "Pull competitive diffs and LSM-scored talking points while you're on a call.",
      icon: Sparkles,
      color: "bg-indigo-500/20 text-indigo-400",
    },
    {
      title: "Keep specs and pricing current",
      description: "SalesHQ learns continuously from your docs and LSM data so reps never share outdated info.",
      icon: RefreshCcw,
      color: "bg-purple-500/20 text-purple-400",
    },
  ];

  return (
    <section aria-label="Use cases" className="py-16 sm:py-24" id="use-cases">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-0">
          <Sparkles className="w-4 h-4 mr-1" /> Use cases
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            Where SalesHQ
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              helps most
            </span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Clear workflows that cut time‑to‑answer and boost confidence on every call.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ title, description, icon: Icon, color }) => (
            <div key={title} className="p-8 rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur text-left transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}