import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  mainClassName?: string;
}

export function PageWrapper({ children, mainClassName }: PageWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn("flex-1 bg-background-light", mainClassName)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

