import { Users, Zap, Settings, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ChallengesSection = () => {
  const router = useRouter();
  const challenges = [
    {
      icon: Users,
      title: "Ineffective team onboarding and knowledge gaps",
      description: "New team members struggle to access the right information at the right time, leading to longer ramp-up periods and inconsistent performance across your organization."
    },
    {
      icon: Zap,
      title: "Fragmented tools and disconnected workflows",
      description: "Teams waste valuable time switching between multiple platforms and tools, breaking their flow and reducing productivity when engaging with customers."
    },
    {
      icon: Settings,
      title: "Manual processes and repetitive tasks",
      description: "Customer-facing teams spend too much time on administrative work instead of focusing on high-value activities that drive business growth."
    },
    {
      icon: BarChart3,
      title: "Limited visibility into team performance",
      description: "Leaders lack actionable insights into team effectiveness, making it difficult to identify improvement opportunities and measure the impact of enablement efforts."
    }
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              What challenges can you solve with
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-powered enablement?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your team's productivity and performance with intelligent solutions that address the most common enablement challenges.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {challenges.map((challenge, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl shadow-xl bg-white/5 border border-white/10 backdrop-blur text-center transition-transform duration-300 ease-out will-change-transform hover:-translate-y-2 hover:scale-[1.01]"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <challenge.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {challenge.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {challenge.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            {/* <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold group"
            >
              See how we solve these challenges
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button> */}
            <Button
              onClick={() => router.push('/case-studies')}
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 px-8 py-4 text-lg font-semibold"
            >
              View case studies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;