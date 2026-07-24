"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);

  useEffect(() => {
    if (!token || !type) {
      setIsInvalidToken(true);
    }
  }, [token, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password.length < 8) {
      setError("Το password πρέπει να έχει τουλάχιστον 8 χαρακτήρες");
      return;
    }

    if (password !== confirmPassword) {
      setError("Τα passwords δεν ταιριάζουν");
      return;
    }

    if (!token || !type) {
      setError("Μη έγκυρος σύνδεσμος επαναφοράς");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          type,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Αποτυχία επαναφοράς password. Ο σύνδεσμος μπορεί να έχει λήξει."
        );
        setIsLoading(false);
        return;
      }

      // Success
      setIsSuccess(true);
      setIsLoading(false);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login?passwordReset=true");
      }, 3000);
    } catch (err) {
      setError("Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.");
      setIsLoading(false);
    }
  };

  if (isInvalidToken) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-background-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-dark mb-2">
              Μη έγκυρος σύνδεσμος
            </h1>
            <p className="text-text-medium mb-6">
              Ο σύνδεσμος επαναφοράς password δεν είναι έγκυρος ή έχει λήξει.
            </p>
            <Link href="/auth/forgot-password">
              <Button className="w-full">Ζητήστε νέο σύνδεσμο</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Password άλλαξε!
            </h1>
            <p className="text-text-medium mb-6">
              Το password σας έχει αλλάξει επιτυχώς. Θα μεταφερθείτε στη σελίδα
              σύνδεσης...
            </p>
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
            Ορισμός Νέου Password
          </h1>
          <p className="text-text-medium">
            Εισάγετε το νέο password σας
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password">Νέο Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1"
              minLength={8}
              placeholder="Τουλάχιστον 8 χαρακτήρες"
            />
            <p className="mt-1 text-xs text-text-light">
              Το password πρέπει να έχει τουλάχιστον 8 χαρακτήρες
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Επιβεβαίωση Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1"
              minLength={8}
              placeholder="Επαναλάβετε το password"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Αλλαγή..." : "Αλλαγή Password"}
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
