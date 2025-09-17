'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
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
  Sparkles
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
  { 
    label: "Features", 
    href: "#features",
    dropdown: [
      { label: "Live Transcription", href: "#features", description: "Real-time voice to text" },
      { label: "AI Suggestions", href: "#features", description: "Smart response recommendations" },
      { label: "Knowledge Base", href: "#features", description: "Self-learning content system" }
    ]
  },
  { 
    label: "Integrations", 
    href: "#integrations" 
  },
  { 
    label: "How it Works", 
    href: "#how-it-works" 
  },
  { 
    label: "Pricing", 
    href: "#pricing" 
  },
  { 
    label: "Resources",
    dropdown: [
      { label: "Blog", href: "/blog", description: "Latest insights and updates" },
      { label: "Help Center", href: "/help", description: "Get support and answers" },
      { label: "API Docs", href: "/docs", description: "Developer documentation" },
      { label: "Case Studies", href: "/cases", description: "Customer success stories" }
    ]
  },
  { 
    label: "Contact", 
    href: "/contact" 
  }
];

export default function NavigationHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      {/* Top banner */}
      {!isScrolled && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center text-sm">
          <p>
            <Sparkles className="inline w-3 h-3 mr-1" />
            Limited offer: Get 20% off annual plans this week only
            <Link href="#pricing" className="ml-2 underline font-semibold">
              Claim offer →
            </Link>
          </p>
        </div>
      )}

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-gradient-to-r from-white to-gray-200'
              } bg-clip-text text-transparent`}>
                SalesHQ
              </h1>
              {!isScrolled && (
                <p className="text-xs text-white/70">AI Sales Intelligence</p>
              )}
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
                        <NavigationMenuTrigger className={`${
                          isScrolled 
                            ? 'text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}>
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                            {item.dropdown.map((subItem) => (
                              <li key={subItem.label}>
                                <NavigationMenuLink asChild>
                                  <a
                                    href={subItem.href}
                                    onClick={(e) => handleSmoothScroll(e, subItem.href)}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {subItem.label}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {subItem.description}
                                    </p>
                                  </a>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <a
                        href={item.href!}
                        onClick={(e) => handleSmoothScroll(e, item.href!)}
                        className={`px-3 py-2 font-medium transition-colors ${
                          isScrolled 
                            ? 'text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </a>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button 
                variant={isScrolled ? "ghost" : "outline"}
                className={isScrolled ? "" : "text-white border-white/50 hover:bg-white/10"}
              >
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={isScrolled ? "" : "text-white hover:bg-white/10"}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {navigationItems.map((item) => (
                    <div key={item.label}>
                      {item.dropdown ? (
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.label}
                          </p>
                          {item.dropdown.map((subItem) => (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              onClick={(e) => handleSmoothScroll(e, subItem.href)}
                              className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <a
                          href={item.href!}
                          onClick={(e) => handleSmoothScroll(e, item.href!)}
                          className="block py-2 text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  ))}

                  <div className="mt-6 pt-6 border-t space-y-3">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        Start Free Trial
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}