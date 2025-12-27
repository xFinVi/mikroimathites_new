import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { LoginForm } from "./login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <PageWrapper>
      <Container className="py-16">
        <Suspense fallback={<div className="text-center py-8">Φόρτωση...</div>}>
          <LoginForm />
        </Suspense>
      </Container>
    </PageWrapper>
  );
}
