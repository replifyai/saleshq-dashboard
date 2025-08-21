import { BookOpen, Target, Zap, Sparkles, Brain, Lightbulb, CheckSquare } from 'lucide-react';
import { CategoryGroup, LoadingStep } from './types';

export const categoryGroups: CategoryGroup[] = [
    {
        title: "Core Document Sections",
        description: "Essential document structure and content areas",
        icon: BookOpen,
        categories: ["introduction", "specification", "features", "pricing", "policies", "technical", "general"]
    },
    {
        title: "Specific Product Attributes",
        description: "Detailed product characteristics and specifications",
        icon: Target,
        categories: ["dimensions", "weight", "material", "color", "size", "model", "sku", "hsn"]
    },
    {
        title: "Conceptual Information",
        description: "Product value propositions and usage contexts",
        icon: Zap,
        categories: ["benefits", "use case", "target audience"]
    }
];

export const loadingSteps: LoadingStep[] = [
    { icon: Sparkles, title: "Getting Ready", subtitle: "Preparing your personalized quiz experience..." },
    { icon: Brain, title: "Thinking Hard", subtitle: "Our AI is working its magic..." },
    { icon: Lightbulb, title: "Almost There", subtitle: "Just a few more moments..." },
    { icon: CheckSquare, title: "Finalizing", subtitle: "Putting the finishing touches..." }
]; 