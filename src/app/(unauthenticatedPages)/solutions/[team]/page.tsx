'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  Target,
  Zap,
  MessageSquare,
  DollarSign,
  Clock,
  Brain,
  Globe,
  BarChart3,
  BookOpen,
  Shield,
  ArrowLeft,
  Play,
  Award,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  Database,
  Settings,
  AlertCircle,
  Phone,
  Mail,
  AlertTriangle,
  Calculator,
  Heart,
  TrendingUp,
  Link,
  FileText,
  Monitor,
  Headphones,
  Bot,
  Search,
  RefreshCw,
  BarChart,
  InspectIcon,
  Share2,
  MessageCircle
} from 'lucide-react';
import { getTeamById, getAllTeams } from '@/data/teamSolutions';
import { useEffect, useState } from 'react';

interface TeamSolutionPageProps {
  params: Promise<{
    team: string;
  }>;
}

export default function TeamSolutionPage({ params }: TeamSolutionPageProps) {
  const router = useRouter();
  const [teamData, setTeamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      const resolvedParams = await params;
      const team = getTeamById(resolvedParams.team);
      if (!team) {
        notFound();
      }
      setTeamData(team);
      setIsLoading(false);
    };
    
    loadTeam();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!teamData) {
    notFound();
  }

  const getTeamIcon = (teamId: string) => {
    switch (teamId) {
      case 'sales':
        return <TrendingUp className="w-4 h-4 mr-2" />;
      case 'customer-support':
        return <MessageSquare className="w-4 h-4 mr-2" />;
      case 'revops':
        return <BarChart3 className="w-4 h-4 mr-2" />;
      default:
        return <Target className="w-4 h-4 mr-2" />;
    }
  };

  const getTeamGradient = (teamId: string) => {
    switch (teamId) {
      case 'sales':
        return 'from-blue-600 via-blue-700 to-blue-800';
      case 'customer-support':
        return 'from-emerald-600 via-emerald-700 to-emerald-800';
      case 'revops':
        return 'from-purple-600 via-purple-700 to-purple-800';
      default:
        return 'from-slate-600 via-slate-700 to-slate-800';
    }
  };

  const getTeamColor = (teamId: string) => {
    switch (teamId) {
      case 'sales':
        return 'from-blue-600 via-blue-700 to-blue-800 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200';
      case 'customer-support':
        return 'from-emerald-600 via-emerald-700 to-emerald-800 dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-200';
      case 'revops':
        return 'from-purple-600 via-purple-700 to-purple-800 dark:from-purple-400 dark:via-purple-300 dark:to-purple-200';
      default:
        return 'from-slate-600 via-slate-700 to-slate-800 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200';
    }
  };
  const getIcons = (name: string) => {
    switch (name) {
      case 'Activity':
        return <TrendingUp className="w-6 h-6" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6" />;
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'Shield':
        return <Shield className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Heart':
        return <Heart className="w-6 h-6" />;
      case 'Globe':
        return <Globe className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      case 'Phone':
        return <Phone className="w-6 h-6" />;
      case 'Mail':
        return <Mail className="w-6 h-6" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6" />;
      case 'LineChart':
        return <LineChart className="w-6 h-6" />;
      case 'Database':
        return <Database className="w-6 h-6" />;
      case 'Settings':
        return <Settings className="w-6 h-6" />;
      case 'AlertCircle':
        return <AlertCircle className="w-6 h-6" />;
      case 'PieChart':
        return <PieChart className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      case 'Brain':
        return <Brain className="w-6 h-6" />;
      case 'Link':
        return <Link className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Monitor':
        return <Monitor className="w-6 h-6" />;
      case 'TrendingDown':
        return <TrendingDown className="w-6 h-6" />;
      case 'DollarSign':
        return <DollarSign className="w-6 h-6" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" />;
      case 'Bot':
        return <Bot className="w-6 h-6" />;
      case 'Search':
        return <Search className="w-6 h-6" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6" />;
      case 'BarChart':
        return <BarChart className="w-6 h-6" />;
      case 'CrystalBall':
        return <InspectIcon className="w-6 h-6" />;
      case 'Share2':
        return <Share2 className="w-6 h-6" />;
      case 'MessageCircle':
        return <MessageCircle className="w-6 h-6" />;
      default:
        return name;
    }
  }

  const getTeamHoverColor = (teamId: string) => {
    switch (teamId) {
      case 'sales':
        return 'group-hover:text-blue-600 dark:group-hover:text-blue-400';
      case 'customer-support':
        return 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400';
      case 'revops':
        return 'group-hover:text-purple-600 dark:group-hover:text-purple-400';
      default:
        return 'group-hover:text-slate-600 dark:group-hover:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden pt-6">
        <div className={`absolute inset-0 bg-gradient-to-r ${teamData.color.replace('from-', '').replace(' to-', '-600/10 via-').replace('-600', '-500/10 to-').replace('-600', '-400/10')}`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/solutions')}
              className="mr-4 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Solutions
            </Button>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-4 text-sm font-medium">
              {getTeamIcon(teamData.id)}
              {teamData.name}
            </Badge>
            <h1 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${getTeamColor(teamData.id)} bg-clip-text text-transparent mb-6`}>
              {teamData.id === 'sales' && 'Accelerate Sales with'}
              {teamData.id === 'customer-support' && 'Elevate Customer'}
              {teamData.id === 'revops' && 'Optimize Revenue'}
              <span className="block">
                {teamData.id === 'sales' && 'AI-Powered Intelligence'}
                {teamData.id === 'customer-support' && 'Support Excellence'}
                {teamData.id === 'revops' && 'Operations Excellence'}
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              {teamData.description}
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className={`bg-gradient-to-r ${teamData.color} hover:opacity-90 text-white`}>
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-600">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {teamData.metrics.map((metric: any, index: number) => (
            <div key={index} className="text-center">
              <div className={`text-4xl font-bold ${teamData.color.replace('from-', 'text-').replace(' to-', '-600 dark:text-').replace('-600', '-400')} mb-2`}>
                {metric.value}
              </div>
              <div className="text-lg text-slate-600 dark:text-slate-300">{metric.label}</div>
              {metric.trend && (
                <div className="text-sm text-green-600 dark:text-green-400">{metric.trend}</div>
              )}
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything Your {teamData.name} Needs
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Powerful features designed specifically for {teamData.name.toLowerCase()} to boost performance, streamline processes, and drive results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamData.features.map((feature: any) => (
              <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm relative overflow-hidden">
                <CardHeader className="pb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg mb-4`}>
                    {getIcons(feature.icon)}
                  </div>
                  <CardTitle className={`text-xl font-semibold text-slate-900 dark:text-white ${getTeamHoverColor(teamData.id)} transition-colors`}>
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900 dark:text-white">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* {feature.metrics && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{feature.metrics.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{feature.metrics.label}</div>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team-Specific Sections */}
      {teamData.supportChannels && (
        <div className="bg-slate-50 dark:bg-slate-800/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Multi-Channel Support Excellence
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Deliver consistent, high-quality support across all customer touchpoints with unified knowledge and intelligent routing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamData.supportChannels.map((channel: any, index: number) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${channel.color} text-white flex items-center justify-center`}>
                    {getIcons(channel.icon)}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{channel.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{channel.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {teamData.keyMetrics && (
        <div className="bg-slate-50 dark:bg-slate-800/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Comprehensive Revenue Intelligence
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Get complete visibility into your revenue operations with advanced analytics, forecasting, and optimization tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamData.keyMetrics.map((metric: any, index: number) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${metric.color} text-white flex items-center justify-center`}>
                    {getIcons(metric.icon)}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{metric.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{metric.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Problems We Solve Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Common {teamData.name} Challenges We Solve
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Every {teamData.name.toLowerCase()} faces these challenges. Our AI-powered platform helps you overcome them and achieve better results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamData.problemsSolved.map((problem: string, index: number) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-slate-700 dark:text-slate-300">{problem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={`bg-gradient-to-r ${getTeamGradient(teamData.id)} text-white py-16`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your {teamData.name}?
          </h2>
          <p className={`text-xl ${teamData.id === 'sales' ? 'text-blue-100' : teamData.id === 'customer-support' ? 'text-emerald-100' : 'text-purple-100'} mb-8`}>
            Join thousands of {teamData.name.toLowerCase()} already using our AI-powered platform to achieve better results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-50" onClick={() => router.push('/contact')}>
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-white/10 text-white hover:bg-white hover:text-slate-900" onClick={() => {
              window.open('https://calendly.com/saleshqai/30min', '_blank');
            }}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}