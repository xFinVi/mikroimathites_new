import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect admin routes
 * Checks if user is authenticated and has admin role
 */
export async function requireAdmin(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null; // User is authorized
}

/**
 * Get current session user
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}


