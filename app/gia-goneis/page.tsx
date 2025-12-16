import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Για Γονείς | Μικροί Μαθητές",
  description: "Σύντομες συμβουλές & πρακτικές ιδέες για την καθημερινότητα με το παιδί",
};

export default function GiaGoneisPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background-light">
        <Container className="py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark mb-4 sm:mb-6">
              Για Γονείς
            </h1>
            <p className="text-lg sm:text-xl text-text-medium mb-8 sm:mb-12">
              Σύντομες συμβουλές & πρακτικές ιδέες για την καθημερινότητα με το παιδί
            </p>
            
            {/* Placeholder content */}
            <div className="bg-background-white rounded-card p-6 sm:p-8 shadow-subtle">
              <p className="text-text-medium">
                Περιεχόμενο σε εξέλιξη...
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

