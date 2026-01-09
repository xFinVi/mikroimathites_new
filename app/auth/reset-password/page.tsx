import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

function ResetPasswordFormWrapper() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-light py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-text-medium">Φόρτωση...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordFormWrapper />
    </Suspense>
  );
}
