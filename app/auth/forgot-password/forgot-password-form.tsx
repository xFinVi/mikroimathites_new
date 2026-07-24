"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.");
        setIsLoading(false);
        return;
      }

      // Success - show success message
      setIsSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError("Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-background-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-dark mb-2">
              Email στάλθηκε!
            </h1>
            <p className="text-text-medium mb-6">
              Έχουμε στείλει email στο <strong>{email}</strong> με οδηγίες για
              την επαναφορά του password σας.
            </p>
            <p className="text-sm text-text-light mb-6">
              Ελέγξτε το inbox σας (και το spam folder αν δεν το βρείτε).
            </p>
            <Link href="/auth/login">
              <Button className="w-full">Επιστροφή στη σύνδεση</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-background-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Επαναφορά Password
          </h1>
          <p className="text-text-medium">
            Εισάγετε το email σας και θα σας στείλουμε οδηγίες για την
            επαναφορά του password
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1"
              placeholder="your@email.com"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Αποστολή..." : "Στείλε Email"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-text-medium">
          <Link
            href="/auth/login"
            className="text-primary-pink hover:underline font-semibold"
          >
            ← Επιστροφή στη σύνδεση
          </Link>
        </div>
      </div>
    </div>
  );
}
