import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background-light">{children}</main>
      <Footer />
    </div>
  );
}

