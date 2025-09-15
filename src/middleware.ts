// middleware.ts

import { NextRequest, NextResponse } from "next/server";

// Helper function to decode JWT payload without verification (for middleware use)
function decodeJWTPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
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
      const { idToken, expiresAt } = tokens;

      // Check if token has expired
      const currentTime = Date.now();
      if (expiresAt && currentTime < expiresAt) {
        // Decode the JWT to get user info
        const payload = decodeJWTPayload(idToken);
        if (payload) {
          userRole = payload.role;
          isAuthenticated = true;
          console.log("🚀 ~ middleware ~ userRole:", userRole);
          console.log("🚀 ~ middleware ~ userId:", payload.user_id);
        }
      } else {
        console.log("🚀 ~ middleware ~ Token expired");
      }
    } catch (error) {
      console.error("🚀 ~ middleware ~ Error parsing auth tokens:", error);
    }
  }

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
    "/shopify"
  ];
  const adminRoutes = [ 
    "/upload",
    "/shopify",
    "/live",
  ]

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if current path is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect non-admin users trying to access admin routes to /chat
  if (isAdminRoute && isAuthenticated && userRole !== 'admin') {
    console.log("🚀 ~ middleware ~ Non-admin user trying to access admin route, redirecting to /chat");
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