import Image from "next/image";

export default function TeamSection() {
  const team = [
    {
      name: "Shubham Agrawal",
      title: "Founder & CEO",
      bio: "Product-led founder focused on reducing the time to insight for GTM teams.",
      img: "/vercel.svg",
    },
    {
      name: "Co-founder",
      title: "CTO",
      bio: "Built knowledge systems at scale; obsessed with reliability and DX.",
      img: "/next.svg",
    },
  ];

  return (
    <section aria-label="Team" className="py-16 sm:py-24" id="team">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Meet the team</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">We are on a mission to make product knowledge instantly accessible for every seller.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {team.map((m) => (
            <div key={m.name} className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-white/10 p-5 bg-white/70 dark:bg-gray-900/40 backdrop-blur supports-[backdrop-filter]:bg-white/10">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <Image src={m.img} alt={m.name} width={48} height={48} className="object-contain" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{m.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{m.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Our mission is to remove friction from every sales conversation with accurate, source-backed answers in seconds. We believe AI should augment reps, not replace them.
          </p>
        </div>
      </div>
    </section>
  );
}