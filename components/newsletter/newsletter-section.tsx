"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Sparkles, Star, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface NewsletterSectionProps {
  source?: string;
}

function hashStringToSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRand(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function NewsletterSection({ source = "homepage" }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const seed = useMemo(() => hashStringToSeed(`newsletter:${source}`), [source]);
  const stars = useMemo(() => {
    const rnd = seededRand(seed);
    return Array.from({ length: 30 }).map((_, i) => ({
      key: `star-${i}`,
      left: `${Math.round(rnd() * 100)}%`,
      top: `${Math.round(rnd() * 100)}%`,
      delay: `${(rnd() * 3).toFixed(2)}s`,
      size: Math.round(rnd() * 2) + 1, // 1-3px
      opacity: rnd() * 0.5 + 0.5, // 0.5-1.0
    }));
  }, [seed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Κάτι πήγε στραβά");
      }

      setIsSubmitted(true);
      setEmail("");
      toast.success("Εγγραφή επιτυχής! 🚀", {
        description: "Έχετε εγγραφεί στο newsletter μας. Θα λάβετε τα νέα μας σύντομα!",
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err: any) {
      const errorMsg = err.message || "Κάτι πήγε στραβά";
      setError(errorMsg);
      toast.error("Αποτυχία εγγραφής", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state - Space celebration
  if (isSubmitted) {
    return (
      <div className="relative w-full min-h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Space background image - full section */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/rocketVictoria.png"
            alt="Space background"
            fill
            className="object-cover object-center opacity-20"
            priority
            sizes="100vw"
          />
          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/95 via-[#1a1f3a]/90 to-[#0d1330]/95" />
        </div>

        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden z-10">
          {stars.map((s) => (
            <div
              key={s.key}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: s.left,
                top: s.top,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>

        {/* Success content */}
        <div className="relative z-30 flex items-center justify-center min-h-[500px] px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-accent-green/20 to-accent-green/10 rounded-full flex items-center justify-center shadow-2xl border-2 border-accent-green/50 backdrop-blur-sm">
                <CheckCircle2 className="w-12 h-12 md:w-14 md:h-14 text-accent-green" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Ευχαριστούμε! 🚀
            </h3>
            <p className="text-lg md:text-xl text-white/90 mb-2">
              Έχετε εγγραφεί στο newsletter μας!
            </p>
            <p className="text-sm md:text-base text-white/70">
              Θα λάβετε τα νέα μας σύντομα 📮
            </p>
            <div className="flex justify-center gap-3 mt-6">
              {["🚀", "⭐", "🌙", "✨"].map((emoji, i) => (
                <span
                  key={i}
                  className="text-3xl animate-bounce inline-block"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Space background image - full section */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/rocketVictoria.png"
          alt="Space background"
          fill
          className="object-cover object-center opacity-20"
          priority
          sizes="100vw"
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/95 via-[#1a1f3a]/90 to-[#0d1330]/95" />
      </div>

      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden z-10">
        {stars.map((s) => (
          <div
            key={s.key}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      {/* Planets/decorative circles */}
      <div className="absolute top-10 right-20 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Submitting overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0a0e27]/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary-pink animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-semibold">
              Απογείωση σε εξέλιξη… 🚀
            </p>
            <p className="text-white/70 text-sm mt-2">
              Ολοκληρώνουμε την εγγραφή σας
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center p-6 md:p-8 lg:p-12 min-h-[500px]">
        {/* Left: Newsletter Form Card */}
        <div className="relative">
          {/* Glassmorphism card with space theme */}
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Glow effects */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-pink/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-yellow/20 rounded-full blur-3xl" />
            
            <div className="relative p-6 md:p-8 lg:p-10 z-30">
              {/* Header */}
              <div className="flex items-start gap-3 mb-6">
                <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary-pink to-primary-pink/80 flex items-center justify-center shadow-lg border border-white/20">
                  <Mail className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Εγγραφείτε στο Newsletter <span className="inline-block">📬</span>
                  </h3>
                  <p className="text-base text-white/85">
                    Νέα άρθρα, δραστηριότητες και μικρά tips που εφαρμόζονται εύκολα στην καθημερινότητα.
                    <span className="ml-2 inline-flex gap-1">
                      {['✨', '📚', '🎨'].map((emoji, i) => (
                        <span key={i} className="inline-block">{emoji}</span>
                      ))}
                    </span>
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-200 flex items-start gap-2 backdrop-blur-sm"
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Label htmlFor="newsletter-email" className="sr-only">
                      Email
                    </Label>
                    <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        isFocused ? "text-primary-pink" : "text-white/60"
                      }`}
                    />
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="Το email σας"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      required
                      autoComplete="email"
                      className={`h-12 md:h-14 pl-11 pr-4 text-base rounded-xl border-2 bg-white/10 backdrop-blur-md text-white placeholder:text-white/50 transition-all ${
                        isFocused
                          ? "border-primary-pink ring-4 ring-primary-pink/20 bg-white/15"
                          : "border-white/20 focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20"
                      }`}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="h-12 md:h-14 px-6 md:px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-primary-pink to-primary-pink/90 hover:from-primary-pink/90 hover:to-primary-pink text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap border border-white/20"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Εγγραφή...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Εγγραφή
                        <span className="text-lg">✨</span>
                      </span>
                    )}
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70 pt-2">
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>Ασφαλές</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✨</span>
                    <span>Χωρίς spam</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <span>Ακυρώσιμο</span>
                  </div>
                </div>

                <p className="text-center text-xs text-white/60">
                  Με την εγγραφή, συμφωνείτε να λαμβάνετε email ενημερώσεις. Μπορείτε να κάνετε απεγγραφή οποιαδήποτε στιγμή.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Right: Rocket with Victoria */}
        <div className="relative flex items-center justify-center lg:justify-end z-20">
          <div className="relative">
            {/* Glow effect behind rocket */}
            <div className="absolute -bottom-8 -right-8 w-72 h-72 md:w-96 md:h-96 bg-primary-pink/25 rounded-full blur-3xl animate-pulse" />
            
            {/* Rocket exhaust glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-t from-orange-500/40 via-yellow-500/30 to-transparent rounded-full blur-2xl" />
            
            <Image
              src="/images/rocketVictoria.png"
              alt="Victoria in rocket"
              width={520}
              height={520}
              className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
              priority
            />

            {/* Floating stars around rocket */}
            <div className="absolute -top-4 -right-4 animate-pulse">
              <Star className="w-6 h-6 text-accent-yellow fill-accent-yellow/50 drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-pulse" style={{ animationDelay: "0.5s" }}>
              <Sparkles className="w-5 h-5 text-primary-pink drop-shadow-lg" />
            </div>
            <div className="absolute top-1/3 -left-6 animate-pulse" style={{ animationDelay: "1s" }}>
              <Star className="w-4 h-4 text-white fill-white/30" />
            </div>
            <div className="absolute bottom-1/4 -right-6 animate-pulse" style={{ animationDelay: "1.5s" }}>
              <Sparkles className="w-4 h-4 text-accent-yellow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
