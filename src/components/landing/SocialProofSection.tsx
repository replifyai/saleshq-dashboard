import Image from "next/image";

export default function SocialProofSection() {
  const logos = [
    { src: "/vercel.svg", alt: "Vercel" },
    { src: "/next.svg", alt: "Next.js" },
    { src: "/globe.svg", alt: "Globe" },
    { src: "/window.svg", alt: "Window" },
    { src: "/file.svg", alt: "File" },
  ];

  return (
    <section aria-label="Trusted by" className="py-10 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">Trusted by modern GTM teams</p>
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-6 sm:gap-10 items-center opacity-90">
            {logos.map((logo) => (
              <div key={logo.alt} className="flex items-center justify-center grayscale opacity-70 hover:opacity-100 transition-opacity">
                <Image src={logo.src} alt={logo.alt} width={120} height={40} className="h-6 sm:h-7 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}