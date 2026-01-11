/**
 * NextAuth Configuration - Authentication setup for admin access
 * 
 * Configures NextAuth.js v5 with credentials provider. Validates admin users
 * against Supabase database and creates secure sessions. Used to protect
 * /admin/* routes via middleware.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

// Validate required environment variables
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!nextAuthSecret) {
  logger.error(
    "❌ NEXTAUTH_SECRET is missing in .env.local\n" +
    "   Generate a secret by running: openssl rand -base64 32\n" +
    "   Or use: https://generate-secret.vercel.app/32"
  );
}

/**
 * NextAuth.js v5 configuration
 * Uses Supabase for user authentication and storage
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (!supabaseAdmin) {
          logger.error("Supabase admin client not configured");
          return null;
        }

        try {
          // Authenticate with Supabase
          const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (error || !data.user) {
            logger.warn("Authentication failed", { email: credentials.email, error });
            return null;
          }

          // Get user role from users table
          const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("id, email, name, role")
            .eq("id", data.user.id)
            .single();

          if (userError || !userData) {
            logger.warn("User not found in users table", { 
              email: credentials.email, 
              userId: data.user.id,
              error: userError 
            });
            
            // Fallback to user_metadata for backwards compatibility
            // Also try to create the user record if it doesn't exist
            const isAdmin = data.user.user_metadata?.role === "admin" || 
                           data.user.user_metadata?.isAdmin === true;
            
            if (!isAdmin) {
              logger.warn("User is not an admin", { email: credentials.email });
              return null;
            }

            // Try to create user record if it doesn't exist (bypass RLS using service role)
            try {
              await supabaseAdmin
                .from("users")
                .upsert({
                  id: data.user.id,
                  email: data.user.email!,
                  name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Admin",
                  role: "admin",
                }, {
                  onConflict: "id"
                });
            } catch (createError) {
              logger.warn("Failed to create user record, continuing with metadata", createError);
            }

            return {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || data.user.email,
              role: "admin",
            };
          }

          // Check if user is admin
          if (userData.role !== "admin") {
            logger.warn("User is not an admin", { 
              email: credentials.email, 
              role: userData.role 
            });
            return null;
          }

          return {
            id: userData.id,
            email: userData.email,
            name: userData.name || userData.email,
            role: userData.role,
          };
        } catch (error) {
          logger.error("Authentication error", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  secret: nextAuthSecret,
  trustHost: true, // Required for NextAuth v5
});

