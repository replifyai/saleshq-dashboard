export interface TeamFeature {
  id: string;
  title: string;
  description: string;
  color: string;
  benefits: string[];
  icon?: string;
  metrics?: {
    value: string;
    label: string;
  };
}

export interface TeamSolution {
  id: string;
  name: string;
  description: string;
  color: string;
  gradient: string;
  keyFeatures: string[];
  benefits: string[];
  icon: string;
  metrics: {
    value: string;
    label: string;
  }[];
  problemsSolved: string[];
  features: TeamFeature[];
  successStories: {
    company: string;
    industry: string;
    teamSize: string;
    results: string;
    quote: string;
  }[];
  supportChannels?: {
    name: string;
    description: string;
    color: string;
    icon: string;
  }[];
  keyMetrics?: {
    name: string;
    description: string;
    color: string;
  }[];
}

export const teamSolutions: Record<string, TeamSolution> = {
  sales: {
    id: "sales",
    name: "Sales Teams",
    icon: "TrendingUp",
    description: "Empower your sales team with AI-powered intelligence, real-time insights, and automated workflows to close more deals faster.",
    color: "from-blue-500 to-blue-600",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    keyFeatures: [
      "AI-Powered Sales Intelligence",
      "Real-Time Deal Insights",
      "Automated Follow-ups",
      "Performance Analytics",
      "Knowledge Management",
      "CRM Integration"
    ],
    benefits: [
      "40% faster deal closure",
      "25% increase in win rates",
      "60% reduction in admin time",
      "95% accuracy in responses"
    ],
    metrics: [
      { value: "40%", label: "Faster Deals" },
      { value: "25%", label: "Higher Win Rate" },
      { value: "60%", label: "Time Saved" }
    ],
    problemsSolved: [
      "Inconsistent sales performance across team members",
      "Time-consuming manual research and preparation",
      "Difficulty accessing up-to-date product information",
      "Lack of real-time insights during customer calls",
      "Inefficient follow-up processes",
      "Knowledge gaps between experienced and new sales reps",
      "Poor visibility into deal progress and pipeline health",
      "Manual data entry and CRM updates",
      "Difficulty identifying upsell and cross-sell opportunities",
      "Lack of competitive intelligence during sales calls"
    ],
    features: [
      {
        id: "ai-intelligence",
        title: "AI-Powered Sales Intelligence",
        description: "Get instant, accurate answers to complex sales questions with context-aware AI that understands your products, customers, and market.",
        color: "from-blue-500 to-blue-600",
        icon: "Brain",
        benefits: [
          "Instant product knowledge access",
          "Context-aware customer insights",
          "Competitive intelligence",
          "Source-backed responses"
        ],
        metrics: { value: "95%", label: "Response Accuracy" }
      },
      {
        id: "real-time-insights",
        title: "Real-Time Deal Insights",
        description: "Access live customer data, deal progress, and personalized recommendations during every sales interaction.",
        color: "from-emerald-500 to-emerald-600",
        icon: "Activity",
        benefits: [
          "Live deal tracking",
          "Customer sentiment analysis",
          "Next-best-action recommendations",
          "Risk assessment alerts"
        ],
        metrics: { value: "40%", label: "Faster Deals" }
      },
      // {
      //   id: "automated-followups",
      //   title: "Automated Follow-ups",
      //   description: "Never miss an opportunity with intelligent follow-up automation that personalizes outreach based on customer behavior.",
      //   color: "from-yellow-500 to-yellow-600",
      //   icon: "RefreshCw",
      //   benefits: [
      //     "Personalized follow-up sequences",
      //     "Optimal timing recommendations",
      //     "Multi-channel outreach",
      //     "Response tracking"
      //   ],
      //   metrics: { value: "60%", label: "Time Saved" }
      // },
      {
        id: "performance-analytics",
        title: "Performance Analytics",
        description: "Track individual and team performance with detailed analytics, identify top performers, and optimize sales processes.",
        color: "from-purple-500 to-purple-600",
        icon: "BarChart",
        benefits: [
          "Individual performance tracking",
          "Team benchmarking",
          "Pipeline analysis",
          "ROI measurement"
        ],
        metrics: { value: "25%", label: "Higher Win Rate" }
      },
      {
        id: "knowledge-management",
        title: "Sales Knowledge Hub",
        description: "Centralized repository of sales materials, battle cards, case studies, and best practices with intelligent search.",
        color: "from-orange-500 to-orange-600",
        icon: "BookOpen",
        benefits: [
          "Centralized sales content",
          "Smart search capabilities",
          "Version control",
          "Team collaboration"
        ],
        metrics: { value: "10K+", label: "Sales Assets" }
      },
      {
        id: "crm-integration",
        title: "Seamless CRM Integration",
        description: "Connect with your existing CRM for unified data flow, automated updates, and enhanced visibility across all touchpoints.",
        color: "from-cyan-500 to-cyan-600",
        icon: "Link",
        benefits: [
          "Real-time CRM sync",
          "Automated data entry",
          "Unified customer view",
          "Custom field mapping"
        ],
        metrics: { value: "50+", label: "CRM Integrations" }
      }
    ],
    successStories: [
      {
        company: "TechCorp Solutions",
        industry: "SaaS",
        teamSize: "25 sales reps",
        results: "40% increase in win rate, 60% reduction in admin time",
        quote: "Our sales team is now 40% more effective with instant access to product knowledge and customer insights."
      },
      {
        company: "Global Enterprises",
        industry: "Manufacturing",
        teamSize: "50+ sales reps",
        results: "35% faster deal closure, 25% increase in average deal size",
        quote: "The AI-powered insights have transformed how we approach customer conversations and close deals."
      }
    ]
  },
  "customer-support": {
    id: "customer-support",
    name: "Customer Support",
    icon: "Headphones",
    description: "Enhance customer satisfaction with intelligent support tools, instant knowledge access, and automated ticket resolution.",
    color: "from-emerald-500 to-emerald-600",
    gradient: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    keyFeatures: [
      "Instant Knowledge Access",
      "Automated Ticket Resolution",
      "Customer Sentiment Analysis",
      "Multi-Channel Support",
      "Performance Tracking",
      "Escalation Management"
    ],
    benefits: [
      "50% faster resolution times",
      "35% reduction in escalations",
      "90% customer satisfaction",
      "80% first-call resolution"
    ],
    metrics: [
      { value: "50%", label: "Faster Resolution" },
      { value: "90%", label: "Customer Satisfaction" },
      { value: "80%", label: "First-Call Resolution" }
    ],
    problemsSolved: [
      "Long resolution times for customer issues",
      "Inconsistent support quality across agents",
      "Difficulty finding relevant product information",
      "High escalation rates to senior staff",
      "Lack of customer sentiment insights",
      "Manual ticket categorization and routing",
      "Poor visibility into support performance",
      "Fragmented customer communication history",
      "Difficulty identifying common issues",
      "Lack of proactive customer care"
    ],
    features: [
      {
        id: "instant-knowledge",
        title: "Instant Knowledge Access",
        description: "Get immediate access to product information, troubleshooting guides, and solutions with AI-powered search and recommendations.",
        color: "from-emerald-500 to-emerald-600",
        icon: "Search",
        benefits: [
          "Instant solution lookup",
          "Context-aware recommendations",
          "Multi-language support",
          "Source verification"
        ],
        metrics: { value: "80%", label: "First-Call Resolution" }
      },
      // {
      //   id: "automated-tickets",
      //   title: "Automated Ticket Resolution",
      //   description: "Intelligent ticket categorization, routing, and automated responses for common issues to reduce resolution time.",
      //   color: "from-yellow-500 to-yellow-600",
      //   icon: "Bot",
      //   benefits: [
      //     "Smart ticket categorization",
      //     "Automated routing",
      //     "Template responses",
      //     "Escalation management"
      //   ],
      //   metrics: { value: "50%", label: "Faster Resolution" }
      // },
      {
        id: "sentiment-analysis",
        title: "Customer Sentiment Analysis",
        description: "Real-time analysis of customer emotions and satisfaction levels to proactively address concerns and improve experience.",
        color: "from-pink-500 to-pink-600",
        icon: "Heart",
        benefits: [
          "Real-time sentiment tracking",
          "Proactive intervention alerts",
          "Satisfaction prediction",
          "Emotion-based routing"
        ],
        metrics: { value: "90%", label: "Customer Satisfaction" }
      },
      {
        id: "multi-channel",
        title: "Multi-Channel Support",
        description: "Unified support across email, chat, phone, and social media with consistent experience and knowledge sharing.",
        color: "from-cyan-500 to-cyan-600",
        icon: "MessageSquare",
        benefits: [
          "Unified customer view",
          "Cross-channel history",
          "Consistent responses",
          "Channel optimization"
        ],
        metrics: { value: "35%", label: "Reduced Escalations" }
      },
      {
        id: "performance-tracking",
        title: "Performance Analytics",
        description: "Comprehensive analytics on agent performance, response times, and customer satisfaction with actionable insights.",
        color: "from-purple-500 to-purple-600",
        icon: "TrendingUp",
        benefits: [
          "Agent performance metrics",
          "Response time analysis",
          "Quality scoring",
          "Training recommendations"
        ],
        metrics: { value: "45%", label: "Faster Response Time" }
      },
      {
        id: "knowledge-base",
        title: "Intelligent Knowledge Base",
        description: "Centralized repository of support articles, FAQs, and solutions with smart search and continuous learning.",
        color: "from-orange-500 to-orange-600",
        icon: "Database",
        benefits: [
          "Smart content search",
          "Auto-updating articles",
          "Usage analytics",
          "Content optimization"
        ],
        metrics: { value: "5K+", label: "Support Articles" }
      }
    ],
    successStories: [
      {
        company: "RetailMax",
        industry: "E-commerce",
        teamSize: "30 support agents",
        results: "50% faster resolution, 90% customer satisfaction",
        quote: "Our support team now resolves issues 50% faster with instant access to knowledge and automated workflows."
      },
      {
        company: "TechStart Inc",
        industry: "SaaS",
        teamSize: "15 support agents",
        results: "35% reduction in escalations, 80% first-call resolution",
        quote: "The AI-powered insights help us understand customer needs better and provide more effective solutions."
      }
    ],
    supportChannels: [
      {
        name: "Live Chat",
        description: "Real-time chat support with instant responses",
        color: "from-blue-500 to-blue-600",
        icon: "MessageCircle"
      },
      {
        name: "Email Support",
        description: "Comprehensive email support with tracking",
        color: "from-green-500 to-green-600",
        icon: "Mail"
      },
      {
        name: "Phone Support",
        description: "Voice support with call analytics",
        color: "from-purple-500 to-purple-600",
        icon: "Phone"
      },
      {
        name: "Social Media",
        description: "Social media monitoring and response",
        color: "from-pink-500 to-pink-600",
        icon: "Share2"
      }
    ]
  },
  revops: {
    id: "revops",
    name: "Revenue Operations",
    icon: "BarChart3",
    description: "Optimize revenue processes with advanced analytics, predictive insights, and automated revenue management workflows.",
    color: "from-purple-500 to-purple-600",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    keyFeatures: [
      "Revenue Forecasting",
      "Pipeline Analytics",
      "Automated Reporting",
      "Performance Dashboards",
      "Data Integration",
      "Predictive Insights"
    ],
    benefits: [
      "30% improvement in forecast accuracy",
      "45% faster reporting cycles",
      "20% increase in revenue visibility",
      "85% reduction in manual data entry"
    ],
    metrics: [
      { value: "30%", label: "Forecast Accuracy" },
      { value: "45%", label: "Faster Reporting" },
      { value: "20%", label: "Revenue Visibility" }
    ],
    problemsSolved: [
      "Inaccurate revenue forecasting",
      "Manual and time-consuming reporting processes",
      "Lack of real-time revenue visibility",
      "Data silos across different systems",
      "Difficulty identifying revenue optimization opportunities",
      "Inconsistent data quality and accuracy",
      "Poor pipeline visibility and management",
      "Lack of predictive insights for revenue planning",
      "Manual data aggregation and analysis",
      "Difficulty tracking revenue attribution across channels"
    ],
    features: [
      {
        id: "revenue-forecasting",
        title: "Advanced Revenue Forecasting",
        description: "Predict future revenue with AI-powered models that analyze historical data, market trends, and sales patterns for accurate forecasting.",
        color: "from-purple-500 to-purple-600",
        icon: "TrendingUp",
        benefits: [
          "AI-powered predictions",
          "Multiple forecasting models",
          "Scenario planning",
          "Risk assessment"
        ],
        metrics: { value: "30%", label: "Forecast Accuracy" }
      },
      {
        id: "pipeline-analytics",
        title: "Pipeline Analytics & Insights",
        description: "Comprehensive pipeline analysis with real-time visibility, conversion tracking, and actionable insights for revenue optimization.",
        color: "from-blue-500 to-blue-600",
        icon: "BarChart3",
        benefits: [
          "Real-time pipeline visibility",
          "Conversion rate analysis",
          "Bottleneck identification",
          "Optimization recommendations"
        ],
        metrics: { value: "45%", label: "Faster Reporting" }
      },
      // {
      //   id: "automated-reporting",
      //   title: "Automated Revenue Reporting",
      //   description: "Generate comprehensive revenue reports automatically with customizable dashboards and real-time data synchronization.",
      //   color: "from-yellow-500 to-yellow-600",
      //   icon: "FileText",
      //   benefits: [
      //     "Automated report generation",
      //     "Customizable dashboards",
      //     "Real-time data sync",
      //     "Scheduled delivery"
      //   ],
      //   metrics: { value: "85%", label: "Time Saved", trend: "+35% efficiency" }
      // },
      {
        id: "performance-dashboards",
        title: "Performance Dashboards",
        description: "Real-time dashboards with key revenue metrics, team performance, and actionable insights for data-driven decisions.",
        color: "from-emerald-500 to-emerald-600",
        icon: "Monitor",
        benefits: [
          "Real-time metrics",
          "Team performance tracking",
          "Custom KPI monitoring",
          "Interactive visualizations"
        ],
        metrics: { value: "20%", label: "Revenue Visibility" }
      },
      // {
      //   id: "data-integration",
      //   title: "Unified Data Integration",
      //   description: "Connect and synchronize data from multiple sources including CRM, marketing, and finance systems for complete revenue visibility.",
      //   color: "from-cyan-500 to-cyan-600",
      //   icon: "Zap",
      //   benefits: [
      //     "Multi-source data sync",
      //     "Data quality management",
      //     "Automated data cleaning",
      //     "API integrations"
      //   ],
      //   metrics: { value: "99.9%", label: "Data Accuracy", trend: "Real-time sync" }
      // },
      {
        id: "predictive-insights",
        title: "Predictive Revenue Insights",
        description: "AI-powered insights that identify revenue opportunities, predict churn risk, and recommend optimization strategies.",
        color: "from-pink-500 to-pink-600",
        icon: "CrystalBall",
        benefits: [
          "Churn prediction",
          "Upsell opportunities",
          "Revenue optimization",
          "Strategic recommendations"
        ],
        metrics: { value: "25%", label: "Churn Reduction" }
      }
    ],
    successStories: [
      {
        company: "GrowthCorp",
        industry: "SaaS",
        teamSize: "15 RevOps specialists",
        results: "30% better forecast accuracy, 45% faster reporting",
        quote: "Our revenue forecasting is now 30% more accurate, helping us make better strategic decisions and plan for growth."
      },
      {
        company: "Enterprise Solutions",
        industry: "Enterprise Software",
        teamSize: "25 RevOps team",
        results: "20% increase in revenue visibility, 85% time saved on reporting",
        quote: "The unified data integration and automated reporting have transformed how we track and optimize revenue."
      }
    ],
    keyMetrics: [
      {
        name: "Revenue Forecasting",
        description: "AI-powered revenue predictions with 30% accuracy improvement",
        color: "from-purple-500 to-purple-600"
      },
      {
        name: "Pipeline Management",
        description: "Real-time pipeline visibility and conversion tracking",
        color: "from-blue-500 to-blue-600", 
      },
      {
        name: "Data Integration",
        description: "Unified data from multiple sources with 99.9% accuracy",
        color: "from-cyan-500 to-cyan-600",
      },
      {
        name: "Automated Reporting",
        description: "85% time saved with automated report generation",
        color: "from-yellow-500 to-yellow-600"
      }
    ]
  },
};

export const getAllTeams = (): TeamSolution[] => {
  return Object.values(teamSolutions);
};

export const getTeamById = (id: string): TeamSolution | undefined => {
  return teamSolutions[id];
};

export const getTeamIds = (): string[] => {
  return Object.keys(teamSolutions);
};
