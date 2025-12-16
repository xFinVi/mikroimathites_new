import { generateMetadataFor } from "@/lib/seo/generate-metadata";
import { HomePage } from "@/components/home/home-page";

export const metadata = generateMetadataFor("home");

export default function Home() {
  return <HomePage />;
}
