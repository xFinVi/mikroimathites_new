import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { getPrintableBySlug, getPrintables } from "@/lib/content";
import { generateImageUrl } from "@/lib/sanity/image-url";
import { DRASTIRIOTITES_CONSTANTS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { PrintableContent } from "@/components/printables/printable-content";
import { PrintableMeta } from "@/components/printables/printable-meta";
import { ShareButtons } from "@/components/articles/share-buttons";
import { ContentTracker } from "@/components/analytics/content-tracker";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const printables = await getPrintables();
  return printables.map((printable) => ({
    slug: printable.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const printable = await getPrintableBySlug(slug);

  if (!printable) {
    return {
      title: "Εκτυπώσιμο δεν βρέθηκε",
    };
  }

  const seo = printable.seo;
  const ogImage = generateImageUrl(
    printable.coverImage,
    DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.OG_IMAGE.width,
    DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.OG_IMAGE.height
  );

  return {
    title: seo?.title || printable.title,
    description: seo?.description || printable.summary || undefined,
    openGraph: {
      title: seo?.title || printable.title,
      description: seo?.description || printable.summary || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || printable.title,
      description: seo?.description || printable.summary || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: seo?.noIndex ? "noindex, nofollow" : undefined,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
  };
}

export default async function PrintablePage({ params }: PageProps) {
  const { slug } = await params;
  const printable = await getPrintableBySlug(slug);

  if (!printable) {
    notFound();
  }

  const coverImageUrl = generateImageUrl(
    printable.coverImage,
    DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.HERO.width,
    DRASTIRIOTITES_CONSTANTS.IMAGE_SIZES.HERO.height
  );

  return (
    <PageWrapper>
      <ContentTracker
        content_type="printable"
        content_slug={slug}
      />
      <article className="bg-background-light">
        {/* Hero Section */}
        {coverImageUrl && (
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={printable.title}
              fill
              className="object-cover"
              style={{ objectPosition: 'center top' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-light" />
          </div>
        )}

        <Container className={`py-8 sm:py-12 md:py-16 ${!coverImageUrl ? 'pt-16 sm:pt-20 md:pt-24' : ''}`}>
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/drastiriotites"
              className="inline-flex items-center gap-2 text-text-medium hover:text-primary-pink transition mb-6 relative z-10 cursor-pointer py-2 -ml-2 pl-2 pr-4 rounded-md hover:bg-background-white"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Επιστροφή στα εκτυπώσιμα
            </Link>

            {/* Printable Header */}
            <header className="mb-8 space-y-4">
              {/* Printables don't have categories, so skip category display */}

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark">
                {printable.title}
              </h1>

              {printable.summary && (
                <p className="text-xl text-text-medium leading-relaxed">
                  {printable.summary}
                </p>
              )}

              <PrintableMeta printable={printable} />
            </header>

            {/* Printable Content */}
            <PrintableContent printable={printable} />

            {/* Share Buttons */}
            <ShareButtons
              title={printable.title}
              url={`/drastiriotites/printables/${printable.slug}`}
            />
          </div>
        </Container>
      </article>
    </PageWrapper>
  );
}

