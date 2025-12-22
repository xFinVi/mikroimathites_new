"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewsletterSectionProps {
  source?: string; // Optional: track where subscription came from (e.g., 'homepage', 'footer')
}

export function NewsletterSection({ source = "homepage" }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Κάτι πήγε στραβά");
      }

      setIsSubmitted(true);
      setEmail("");

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Κάτι πήγε στραβά");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-accent-green/10 border-2 border-accent-green rounded-card p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-lg font-semibold text-text-dark mb-1">
          Ευχαριστούμε!
        </h3>
        <p className="text-sm text-text-medium">
          Έχετε εγγραφεί στο newsletter μας.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-text-dark mb-2">
            Εγγραφείτε στο Newsletter
          </h3>
          <p className="text-text-medium text-sm">
            Λάβετε ενημερώσεις για νέο περιεχόμενο, δραστηριότητες και συμβουλές.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="rounded-card border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="newsletter-email" className="sr-only">
                Email
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Το email σας"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !email}
              className="bg-primary-pink hover:bg-primary-pink/90 text-white h-12 px-6"
            >
              {isSubmitting ? "Εγγραφή..." : "Εγγραφή"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

