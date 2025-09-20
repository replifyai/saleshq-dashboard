"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Users, 
  Headphones,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UnauthenticatedNavbar from "@/components/navigation/UnauthenticatedNavbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      // Here you would typically send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        inquiryType: "general"
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "shubham@saleshq.ai",
      description: "Send us an email anytime",
      action: "mailto:shubham@saleshq.ai"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 96178 74449",
      description: "Mon-Fri from 8am to 5pm",
      action: "tel:+919617874449"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Raipur, Chhattisgarh",
      description: "India",
      action: null
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon-Fri: 8AM-5PM",
      description: "IST (GMT+5:30)",
      action: null
    }
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry", icon: MessageSquare },
    { value: "sales", label: "Sales & Pricing", icon: Users },
    { value: "support", label: "Technical Support", icon: Headphones },
    { value: "partnership", label: "Partnership", icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 dark:from-blue-600 dark:to-purple-600 dark:text-white py-16 pt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-blue-100 max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Let's Start a Conversation
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Whether you have questions about our AI-powered sales platform, need technical support, 
                or want to discuss partnership opportunities, we're here to help.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {info.title}
                        </h3>
                        {info.action ? (
                          <a 
                            href={info.action}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">
                            {info.content}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    How quickly do you respond?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Do you offer demos?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Yes! We offer personalized demos to show how SalesHQ can benefit your team.{" "}
                    <a 
                      href="https://calendly.com/saleshqai/30min" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Book a demo here
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    What support do you provide?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We provide comprehensive onboarding, training, and ongoing technical support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">What can we help you with?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            formData.inquiryType === type.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name="inquiryType"
                            value={type.value}
                            checked={formData.inquiryType === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <type.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Company and Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief subject line"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}