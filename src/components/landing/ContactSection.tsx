import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Clock, 
  Shield, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Rocket 
} from "lucide-react";

export default function ContactSection() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setContactForm({ name: '', email: '', company: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join 1,000+ sales teams already using Replify to close more deals faster. Start your free trial today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="p-8 border border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5 backdrop-blur">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Get Started in 5 Minutes
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Fill out the form below and we'll set up your account immediately. No technical setup required.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <Input
                      placeholder="Your Full Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      className="h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 dark:bg-white/5 dark:border-white/20 dark:text-white"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Work Email Address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      className="h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 dark:bg-white/5 dark:border-white/20 dark:text-white"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Company Name"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                      className="h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 dark:bg-white/5 dark:border-white/20 dark:text-white"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Tell us about your sales team size and current challenges..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={4}
                      required
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 dark:bg-white/5 dark:border-white/20 dark:text-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-500 hover:to-emerald-400 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Setting Up Your Account...
                      </>
                    ) : (
                      <>
                        Start Free Trial Now
                        <Rocket className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    By submitting, you agree to our terms and privacy policy. Unsubscribe anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Benefits */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Why Sales Teams Choose Replify
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <p className="font-semibold text-gray-900 dark:text-white">Self-Learning Technology</p>
                     <p className="text-gray-600 dark:text-gray-300">Only platform with real-time AI training and closed feedback loops</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <p className="font-semibold text-gray-900 dark:text-white">5-Minute Setup</p>
                     <p className="text-gray-600 dark:text-gray-300">Upload documents and start getting answers immediately</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <p className="font-semibold text-gray-900 dark:text-white">Enterprise Security</p>
                     <p className="text-gray-600 dark:text-gray-300">Bank-grade security with SOC 2 compliance and data encryption</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <p className="font-semibold text-gray-900 dark:text-white">Customer Success Team</p>
                     <p className="text-gray-600 dark:text-gray-300">Dedicated support to ensure your team's success from day one</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 backdrop-blur">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Our Sales Team
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">sales@replify.ai</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">San Francisco, CA</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Response Time:</strong> We respond to all inquiries within 2 hours during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 