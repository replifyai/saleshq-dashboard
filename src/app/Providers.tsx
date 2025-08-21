"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ReduxProvider } from "@/appstore/Provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import ThreejsToysLoader from "@/components/threejs-toys-loader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <ThreejsToysLoader />
              {children}
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

