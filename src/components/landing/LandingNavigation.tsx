'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Bot, 
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Users,
  BarChart3,
  Target,
  MessageSquare,
  Calendar,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navigationItems = [
  // { 
  //   label: "Product", 
  //   href: "#product",
  //   dropdown: [
  //     { 
  //       label: "AI Intelligence", 
  //       href: "#product", 
  //       description: "Advanced AI-powered responses",
  //       icon: <Bot className="w-4 h-4" />
  //     },
  //     { 
  //       label: "Analytics Dashboard", 
  //       href: "#product", 
  //       description: "Real-time performance insights",
  //       icon: <BarChart3 className="w-4 h-4" />
  //     },
  //     { 
  //       label: "Team Collaboration", 
  //       href: "#product", 
  //       description: "Seamless team workflows",
  //       icon: <Users className="w-4 h-4" />
  //     },
  //     { 
  //       label: "Integrations", 
  //       href: "#integrations", 
  //       description: "Connect your favorite tools",
  //       icon: <Globe className="w-4 h-4" />
  //     }
  //   ]
  // },
  { 
    label: "Solutions", 
    href: "/solutions",
    dropdown: [
      { 
        label: "Sales Teams", 
        href: "/solutions/sales", 
        description: "Boost sales performance",
        icon: <Target className="w-4 h-4" />
      },
      { 
        label: "Customer Support", 
        href: "/solutions/customer-support", 
        description: "Enhance customer experience",
        icon: <MessageSquare className="w-4 h-4" />
      },
      { 
        label: "RevOps Teams", 
        href: "/solutions/revops", 
        description: "Optimize your operations",
        icon: <Shield className="w-4 h-4" />
      },
    ]
  },
  // { 
  //   label: "Resources",
  //   dropdown: [
  //     { 
  //       label: "Documentation", 
  //       href: "/docs", 
  //       description: "Complete API and setup guides",
  //       icon: <Globe className="w-4 h-4" />
  //     },
  //     { 
  //       label: "Case Studies", 
  //       href: "/cases", 
  //       description: "Success stories from customers",
  //       icon: <BarChart3 className="w-4 h-4" />
  //     },
  //     { 
  //       label: "Help Center", 
  //       href: "/help", 
  //       description: "Get support and answers",
  //       icon: <MessageSquare className="w-4 h-4" />
  //     },
  //     { 
  //       label: "Blog", 
  //       href: "/blog", 
  //       description: "Latest insights and updates",
  //       icon: <Sparkles className="w-4 h-4" />
  //     }
  //   ]
  // },
  { 
    label: "Features", 
    href: "/features" 
  },
  { 
    label: "About Us", 
    href: "/about" 
  },
  { 
    label: "Contact Us", 
    href: "/contact" 
  }
];

const ctaButtons = [
  {
    label: "Book Demo",
    href: "https://calendly.com/saleshqai/30min",
    variant: "outline" as const,
    icon: <Calendar className="w-4 h-4" />
  },
  {
    label: "Start Free Trial",
    href: "/contact",
    variant: "default" as const,
    icon: <Zap className="w-4 h-4" />
  }
];

export default function ModernNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-lg p-2">
              <Image src="/logo.png" alt="SalesHQ" width={140} height={140} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    {item.dropdown ? (
                      <>
                        <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-3 p-6 w-[500px]">
                            {item.dropdown.map((dropdownItem) => (
                              <NavigationMenuLink key={dropdownItem.label} asChild>
                                <Link
                                  href={dropdownItem.href}
                                  className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-900 dark:focus:text-white"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                      {dropdownItem.icon}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium leading-none">
                                        {dropdownItem.label}
                                      </div>
                                      <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400 mt-1">
                                        {dropdownItem.description}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-900 dark:focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            {ctaButtons.map((button) => (
              <Button
                key={button.label}
                variant={button.variant}
                asChild
                className={button.variant === 'default' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 hover:text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-700 hover:scale-105'
                }
              >
                <Link href={button.href} className="flex items-center gap-2">
                  {button.icon}
                  {button.label}
                </Link>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span>SalesHQ</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-6">
                  {/* Mobile Navigation Links */}
                  <div className="space-y-4">
                    {navigationItems.map((item) => (
                      <div key={item.label}>
                        <Link
                          href={item.href || ''}
                          className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                        {item.dropdown && (
                          <div className="mt-2 ml-4 space-y-2">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.label}
                                href={dropdownItem.href}
                                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Mobile CTA Buttons */}
                  <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {ctaButtons.map((button) => (
                      <Button
                        key={button.label}
                        variant={button.variant}
                        asChild
                        className={`w-full ${
                          button.variant === 'default' 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Link 
                          href={button.href} 
                          className="flex items-center justify-center gap-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {button.icon}
                          {button.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}