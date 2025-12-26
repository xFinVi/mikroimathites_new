import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  retryAction?: () => void;
  backUrl?: string;
  backLabel?: string;
}

export function ErrorFallback({
  title = "Κάτι πήγε στραβά",
  message = "Δεν μπορέσαμε να φορτώσουμε το περιεχόμενο. Παρακαλώ δοκιμάστε ξανά σε λίγο.",
  showRetry = false,
  retryAction,
  backUrl = "/",
  backLabel = "Επιστροφή στην αρχική",
}: ErrorFallbackProps) {
  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text-dark">{title}</h2>
        <p className="text-lg text-text-medium">{message}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showRetry && retryAction && (
            <Button
              onClick={retryAction}
              size="lg"
              className="bg-primary-pink hover:bg-primary-pink/90 text-white"
            >
              Δοκιμάστε ξανά
            </Button>
          )}
          <Link href={backUrl}>
            <Button variant="outline" size="lg">
              {backLabel}
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

