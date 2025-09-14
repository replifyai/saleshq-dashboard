import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResourcesSection() {
  const posts = [
    { title: "The Sales Enablement Playbook (Free Template)", href: "#", tag: "Template" },
    { title: "How to Build Source-Backed Battlecards in Minutes", href: "#", tag: "Guide" },
    { title: "Reducing Time-to-Answer for Complex Products", href: "#", tag: "Blog" },
  ];

  return (
    <section aria-label="Resources" className="py-16 sm:py-24" id="resources">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-white/70 dark:bg-gray-900/40 backdrop-blur supports-[backdrop-filter]:bg-white/10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Free resource</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Download our Sales Enablement Template to organize specs, pricing, and battlecards.</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Download Template</Button>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">No email required during early access.</p>
          </div>
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">From the blog</h3>
            <ul className="mt-4 space-y-3">
              {posts.map((p) => (
                <li key={p.title} className="flex items-center justify-between">
                  <Link href={p.href} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {p.title}
                  </Link>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10">{p.tag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}