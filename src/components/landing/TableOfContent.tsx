import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items?: TOCItem[];
}

export const TableOfContents = ({ items: customItems }: TableOfContentsProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const defaultItems = [
    { id: 'hero', title: 'Overview' },
    { id: 'product-overview', title: 'Product Overview' },
    { id: 'challenges-section', title: 'Challenges' },
    { id: 'how-it-works', title: 'How It Works' },
    { id: 'use-cases', title: 'Use Cases' },
    { id: 'roi', title: 'ROI' },
    { id: 'faq', title: 'FAQ' },
  ];
  
  const items = customItems || defaultItems;

  useEffect(() => {
    const observers = new Map();
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    });

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
        observers.set(item.id, observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [items]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
      
      // Calculate scroll progress
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollY / documentHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block animate-in">
      <div className="glass-card rounded-2xl p-3 shadow-lg backdrop-blur-xl border border-white/10 dark:border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px] max-w-[240px]">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">
            Contents
          </div>
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "group relative w-full text-left px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ease-out toc-item-hover",
                "hover:bg-primary/10 hover:text-primary hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-primary/10",
                activeSection === item.id
                  ? "text-primary bg-primary/10 scale-105 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300 flex-shrink-0",
                  activeSection === item.id 
                    ? "bg-primary scale-125 shadow-sm shadow-primary/50" 
                    : "bg-muted-foreground/40 group-hover:bg-primary/60 group-hover:scale-110"
                )} />
                <span className="truncate text-xs">{item.title}</span>
              </div>
              
              {/* Active indicator line */}
              {activeSection === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gradient-to-b from-primary to-primary/60 rounded-r-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};