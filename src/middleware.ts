// middleware.ts

import { NextRequest, NextResponse } from "next/server";

// Helper function to decode JWT payload without verification (for middleware use)
function decodeJWTPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Convert base64url to base64 by replacing characters and adding padding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const decoded = Buffer.from(padded, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authTokens = request.cookies.get("auth_tokens");
  const authTokensValue = authTokens?.value;

  let isAuthenticated = false;
  let userRole = null;

  if (authTokensValue) {
    try {
      // Parse the auth tokens JSON
      const tokens = JSON.parse(authTokensValue);
      const { idToken } = tokens;

      // Decode the JWT to get user info and check JWT expiration
      const payload = decodeJWTPayload(idToken);
      if (payload) {
        // Check if JWT itself has expired
        const currentUnixTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > currentUnixTime) {
          userRole = payload.role;
          isAuthenticated = true;
        } else {
          console.log("🚀 ~ middleware ~ JWT token expired");
        }
      }
    } catch (error) {
      console.error("🚀 ~ middleware ~ Error parsing auth tokens:", error);
    }
  }

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password"
  ];

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/chat",
    "/library", 
    "/practice",
    "/settings",
    "/live",
    "/modules",
    "/organization",
    "/upload",
    "/leaderboard",
    "/queries",
    "/quiz-history",
    "/shopify",
    "/users"
  ];
  const adminRoutes = [ 
    "/upload",
    "/shopify",
    "/live",
    "/users",
  ]

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if current path is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect non-admin users trying to access admin routes to /chat
  if (isAdminRoute && isAuthenticated && userRole !== 'admin') {
    return NextResponse.redirect(new URL("/chat", request.url));
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"
  ]
}