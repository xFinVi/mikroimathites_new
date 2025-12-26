"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Star, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface NewsletterSectionProps {
  source?: string;
}

function hashStringToSeed(input: string): number {
  // Deterministic hash (fast, good enough for UI positioning)
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRand(seed: number) {
  // Mulberry32
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
    return Array.from({ length: 14 }).map((_, i) => ({
      key: `star-${i}`,
      left: `${Math.round(rnd() * 100)}%`,
      top: `${Math.round(rnd() * 100)}%`,
      delay: `${(rnd() * 3).toFixed(2)}s`,
      variant: i % 3,
    }));
  }, [seed]);

  const celebrationSparkles = useMemo(() => {
    const rnd = seededRand(seed + 999);
    return Array.from({ length: 28 }).map((_, i) => ({
      key: `sparkle-${i}`,
      left: `${Math.round(rnd() * 100)}%`,
      top: `${Math.round(rnd() * 100)}%`,
      delay: `${(rnd() * 2).toFixed(2)}s`,
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

      setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
    } catch (err: any) {
      setError(err.message || "Κάτι πήγε στραβά");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state - Night sky celebration
  if (isSubmitted) {
    return (
      <div className="relative w-full min-h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Night Sky Background */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/starsSky.png"
            alt="Night sky with stars"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Moon */}
        <div className="absolute top-6 right-6 md:top-8 md:right-10 z-10">
          <div className="relative animate-moon-glow">
            <Image
              src="/images/moon.png"
              alt="Moon"
              width={150}
              height={150}
              className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Rocket - Moving Up and Down */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-15 pointer-events-none">
          <div className="relative animate-rocket-up-down">
            <Image
              src="/images/rocket.png"
              alt="Rocket"
              width={200}
              height={200}
              className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 object-contain drop-shadow-lg rotate-45"
            />
          </div>
        </div>

        {/* Celebration Sparkles */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {celebrationSparkles.map((s) => (
            <div
              key={s.key}
              className="absolute animate-celebration-sparkle"
              style={{ left: s.left, top: s.top, animationDelay: s.delay }}
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent-yellow" />
            </div>
          ))}
        </div>

        {/* Success Message */}
        <div className="relative z-30 flex items-center justify-center min-h-[500px] px-4 md:px-6 lg:px-8">
          <div className="relative animate-fade-in-up">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border-2 border-accent-yellow animate-pulse-glow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center mb-4 animate-jump-celebration">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-accent-yellow/40">
                    <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-primary-pink" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-dark mb-2 animate-bounce-gentle">
                  Ευχαριστούμε! 🎉
                </h3>
                <p className="text-lg md:text-xl text-text-medium mb-1">
                  Έχετε εγγραφεί στο newsletter μας!
                </p>
                <p className="text-sm md:text-base text-text-light mt-2">
                  Θα λάβετε τα νέα μας σύντομα 📮
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  {["🎨", "📚", "🎮", "🎭"].map((emoji, i) => (
                    <span
                      key={i}
                      className="text-2xl md:text-3xl animate-bounce-gentle inline-block"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
      {/* Night Sky Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/starsSky.png"
          alt="Night sky with stars"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Moon - Top Right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-10 z-10">
        <div className="relative animate-moon-glow">
          <Image
            src="/images/moon.png"
            alt="Moon"
            width={150}
            height={150}
            className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain drop-shadow-2xl"
          />
        </div>
      </div>


      {/* Twinkling Stars Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {stars.map((s) => (
          <div
            key={s.key}
            className="absolute animate-star-twinkle"
            style={{ left: s.left, top: s.top, animationDelay: s.delay }}
          >
            <Star
              className={
                s.variant === 0
                  ? "w-2 h-2 md:w-3 md:h-3 text-accent-yellow fill-accent-yellow/50"
                  : s.variant === 1
                  ? "w-2 h-2 md:w-3 md:h-3 text-white fill-white/30"
                  : "w-2 h-2 md:w-3 md:h-3 text-primary-pink fill-primary-pink/30"
              }
            />
          </div>
        ))}
      </div>

      {/* Submitting overlay (rocket launch) */}
      {isSubmitting && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0b1028]/55 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-auto px-6">
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl">
              <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary-pink/25 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent-yellow/20 blur-3xl" />

              <div className="relative flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />
                  <Image
                    src="/images/rocket.png"
                    alt="Rocket"
                    width={160}
                    height={160}
                    className="relative w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-xl rotate-45 animate-rocket-up-down"
                    priority
                  />
                </div>

                <div>
                  <p className="text-white text-base md:text-lg font-semibold">
                    Απογείωση σε εξέλιξη… ✨
                  </p>
                  <p className="text-white/80 text-sm mt-1">
                    Ολοκληρώνουμε την εγγραφή σας στο newsletter
                  </p>
                </div>

                <div className="w-full">
                  <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary-pink via-accent-yellow to-accent-green animate-pulse" />
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2 text-white/80 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Παρακαλώ περιμένετε…</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-30 flex items-center justify-center min-h-[520px] px-4 md:px-6 lg:px-10">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center">
          {/* Left: Card */}
          <div className="relative">
            {/* Glass card */}
            <div className="relative rounded-3xl bg-white/12 backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl">
                {/* soft blobs */}
                <div className="absolute -top-28 -left-28 h-64 w-64 rounded-full bg-primary-pink/20 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

                <div className="relative p-6 md:p-8 lg:p-10">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
                      <Mail className="w-6 h-6 text-primary-pink" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                        Εγγραφείτε στο Newsletter <span className="inline-block">📬</span>
                      </h3>
                      <p className="mt-2 text-sm md:text-base lg:text-lg text-white/85 leading-relaxed">
                        Νέα άρθρα, δραστηριότητες και μικρά tips που εφαρμόζονται εύκολα στην καθημερινότητα.
                        <span className="ml-2 inline-flex gap-1">
                          {['✨','🎨','📚'].map((emoji, i) => (
                            <span key={i} className="inline-block animate-star-twinkle" style={{ animationDelay: `${i * 0.3}s` }}>
                              {emoji}
                            </span>
                          ))}
                        </span>
                      </p>
                    </div>
                  </div>


                  {/* Form */}
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {error && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100 flex items-start gap-2"
                      >
                        <AlertCircle className="w-5 h-5 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Label htmlFor="newsletter-email" className="sr-only">Email</Label>
                        <div className="relative">
                          <Mail
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                              isFocused ? "text-primary-pink scale-110" : "text-white/60"
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
                            inputMode="email"
                            aria-invalid={!!error}
                            aria-describedby="newsletter-hint"
                            className={`h-12 md:h-14 pl-11 pr-4 text-base rounded-xl border bg-white/10 text-white placeholder:text-white/55 shadow-lg backdrop-blur-md transition-all duration-300 ${
                              isFocused
                                ? "border-primary-pink/70 ring-4 ring-primary-pink/20"
                                : "border-white/20 focus:border-primary-pink/70 focus:ring-2 focus:ring-primary-pink/20"
                            }`}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="h-12 md:h-14 px-6 md:px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-primary-pink to-primary-pink/90 hover:from-primary-pink/90 hover:to-primary-pink text-white shadow-lg hover:shadow-xl transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group whitespace-nowrap"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Εγγραφή…
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 group-hover:animate-spin-slow" />
                              Εγγραφή
                              <span className="text-lg group-hover:animate-bounce-gentle inline-block">✨</span>
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block">🔒</span>
                        <span>Ασφαλές</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block">✨</span>
                        <span>Χωρίς spam</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block">📧</span>
                        <span>Ακυρώσιμο</span>
                      </div>
                    </div>

                    <p id="newsletter-hint" className="text-center text-xs text-white/55">
                      Με την εγγραφή, συμφωνείτε να λαμβάνετε email ενημερώσεις. Μπορείτε να κάνετε απεγγραφή οποιαδήποτε στιγμή.
                    </p>
                  </form>
                </div>
            </div>
          </div>

          {/* Right: Character */}
          <div className="relative flex items-start justify-start">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -bottom-6 -right-6 w-72 h-72 md:w-80 md:h-80 bg-primary-pink/18 rounded-full blur-3xl animate-pulse" />

              <Image
                src="/images/rocketVictoria.png"
                alt="Victoria in rocket"
                width={520}
                height={520}
                className="w-72 h-72 md:w-[22rem] md:h-[22rem] lg:w-[26rem] lg:h-[26rem] object-cover drop-shadow-2xl"
                priority
              />

              {/* Floating sparkles */}
              <div className="absolute -top-3 -right-3 animate-spin-slow">
                <Sparkles className="w-6 h-6 text-accent-yellow drop-shadow-lg" />
              </div>
              <div className="absolute -bottom-3 -left-3 animate-pulse">
                <Star className="w-5 h-5 text-primary-pink fill-primary-pink/50 drop-shadow-lg" />
              </div>
              <div className="absolute top-1/3 -left-5 animate-star-twinkle">
                <Sparkles className="w-4 h-4 text-accent-yellow" />
              </div>
              <div className="absolute bottom-1/4 -right-5 animate-star-twinkle" style={{ animationDelay: "1s" }}>
                <Star className="w-4 h-4 text-primary-pink fill-primary-pink/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
