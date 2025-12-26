"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/utils/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    logger.error("Application error:", error);
  }, [error]);

  return (
    <PageWrapper>
      <Container className="py-16 text-center space-y-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
            Κάτι πήγε στραβά
          </h1>
          <p className="text-lg text-text-medium mb-8">
            Συγγνώμη, προέκυψε ένα σφάλμα. Παρακαλώ δοκιμάστε ξανά σε λίγο.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              size="lg"
              className="bg-primary-pink hover:bg-primary-pink/90 text-white"
            >
              Δοκιμάστε ξανά
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg">
                Επιστροφή στην αρχική
              </Button>
            </Link>
          </div>
          {error.digest && (
            <p className="text-sm text-text-light mt-8">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </Container>
    </PageWrapper>
  );
}

