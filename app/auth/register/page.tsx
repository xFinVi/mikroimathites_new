"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (password !== confirmPassword) {
      setError("Τα passwords δεν ταιριάζουν");
      return;
    }

    if (password.length < 8) {
      setError("Το password πρέπει να έχει τουλάχιστον 8 χαρακτήρες");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Αποτυχία δημιουργίας λογαριασμού");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login?registered=true");
      }, 2000);
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
                Δημιουργία Admin Λογαριασμού
              </h1>
              <p className="text-text-medium">
                Δημιουργήστε έναν νέο admin λογαριασμό
              </p>
            </div>

            {success ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-card p-4 text-sm text-green-800">
                  ✅ Ο λογαριασμός δημιουργήθηκε επιτυχώς! Ανακατεύθυνση στη σελίδα σύνδεσης...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/40 rounded-card p-4 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold text-text-dark">
                    Όνομα (Προαιρετικό)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Το όνομά σας"
                    disabled={isLoading}
                    className="h-12"
                  />
                </div>

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
                    minLength={8}
                  />
                  <p className="text-xs text-text-medium">
                    Τουλάχιστον 8 χαρακτήρες
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-base font-semibold text-text-dark">
                    Επιβεβαίωση Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="h-12"
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary-pink hover:bg-primary-pink/90 text-white text-lg font-semibold"
                >
                  {isLoading ? "Δημιουργία..." : "Δημιουργία Λογαριασμού"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center space-y-2">
              <Link
                href="/auth/login"
                className="text-sm text-text-medium hover:text-primary-pink transition block"
              >
                Έχετε ήδη λογαριασμό; Συνδεθείτε
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

