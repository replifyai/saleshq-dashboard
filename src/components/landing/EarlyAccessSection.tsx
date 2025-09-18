import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function EarlyAccessSection() {
  const perks = [
    { title: "Founding member pricing", desc: "Preferential lifetime pricing for early supporters." },
    { title: "Shape the roadmap", desc: "Direct access to the team and priority on feedback." },
    { title: "White-glove onboarding", desc: "We set everything up for your first workflow." },
  ];

  return (
    <section aria-label="Early access" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent" id="early-access">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 dark:border-white/10 text-blue-700 dark:text-blue-300 bg-blue-50/60 dark:bg-blue-950/40 text-xs mb-4">
          <Sparkles className="w-4 h-4 mr-1" /> Early Access
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            Join the early
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              access program
            </span>
          </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Get in early, help us build the future of sales knowledge, and unlock benefits.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {perks.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
              <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Join Early Access <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">We are onboarding a limited cohort each week.</p>
        </div>
      </div>
    </section>
  );
}