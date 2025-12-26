"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const registered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (registered) {
      setShowSuccess(true);
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Λάθος email ή password. Παρακαλώ δοκιμάστε ξανά.");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.");
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container className="py-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-background-white rounded-card p-8 shadow-subtle border border-border/50">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-text-dark mb-2">
                Σύνδεση Admin
              </h1>
              <p className="text-text-medium">
                Συνδεθείτε για πρόσβαση στο admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-card p-4 text-sm text-green-800">
                  ✅ Ο λογαριασμός δημιουργήθηκε επιτυχώς! Μπορείτε να συνδεθείτε τώρα.
                </div>
              )}
              {error && (
                <div className="bg-destructive/10 border border-destructive/40 rounded-card p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-text-dark">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold text-text-dark">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary-pink hover:bg-primary-pink/90 text-white text-lg font-semibold"
              >
                {isLoading ? "Σύνδεση..." : "Σύνδεση"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link
                href="/auth/register"
                className="text-sm text-text-medium hover:text-primary-pink transition block"
              >
                Δεν έχετε λογαριασμό; Δημιουργήστε έναν
              </Link>
              <Link
                href="/"
                className="text-sm text-text-medium hover:text-primary-pink transition block"
              >
                ← Επιστροφή στην αρχική
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}


