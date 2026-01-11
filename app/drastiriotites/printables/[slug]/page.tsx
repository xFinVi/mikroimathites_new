import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageWrapper } from "@/components/pages/page-wrapper";
import { getPrintableBySlug, getPrintables } from "@/lib/content";
import { generateImageUrl, urlFor } from "@/lib/sanity/image-url";
import { DRASTIRIOTITES_CONSTANTS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { PrintableContent } from "@/components/printables/printable-content";
import { PrintableMeta } from "@/components/printables/printable-meta";
import { PrintableDownloadButton } from "@/components/printables/printable-download-button";
import { PrintableColorWrapper } from "@/components/printables/printable-color-wrapper";
import { PrintableHeader } from "@/components/printables/printable-header";
import { DownloadCount } from "@/components/analytics/download-count";
import { ShareButtons } from "@/components/articles/share-buttons";
import { ContentTracker } from "@/components/analytics/content-tracker";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Limit to first 30 printables for faster builds (remaining generated on-demand)
  const printables = await getPrintables();
  return printables.slice(0, 30).map((printable) => ({
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

  // Generate full-size image URL to show complete printable without cropping
  // Use large dimensions with fit('max') to preserve aspect ratio and show full image
  const coverImageUrl = printable.coverImage 
    ? urlFor(printable.coverImage).width(2400).fit('max').auto('format').url()
    : null;

  return (
    <PrintableColorWrapper>
      <PageWrapper>
        <ContentTracker
          content_type="printable"
          content_slug={slug}
        />
        <article className="min-h-screen">
          {/* Full-Width Title Header with Random Bright Color */}
          <PrintableHeader title={printable.title} />
          
          <Container className="pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto">

            {/* Image Preview and Description - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
              {/* Left Column - Image Preview */}
              <div className="space-y-6">
                {/* Cover Image - Large Preview (Old Site Style) */}
                {coverImageUrl && (
                  <div className="bg-white border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg">
                    {/* Red Banner */}
                    <div className="bg-red-600 text-white py-2 px-4 text-center">
                      <p className="font-bold text-sm sm:text-base">Παιδικές Χειροτεχνίες</p>
                    </div>
                    
                    {/* Logo Section */}
                    <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-center gap-2">
                      <Image
                        src="/images/logo.png"
                        alt="Μικροί Μαθητές"
                        width={120}
                        height={40}
                        className="h-6 sm:h-8 w-auto object-contain"
                      />
                      <span className="text-xs sm:text-sm font-bold text-gray-800">ΜΙΚΡΟΙ ΜΑΘΗΤΕΣ</span>
                    </div>
                    
                    {/* Cover Image */}
                    <div className="p-4 bg-white">
                      <div className="w-full bg-white border border-gray-300 rounded overflow-hidden">
                        <div className="w-full flex items-center justify-center p-2">
                          {coverImageUrl && (
                            <Image
                              src={coverImageUrl}
                              alt={printable.title}
                              width={2400}
                              height={3200}
                              className="w-full h-auto object-contain"
                              priority
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              unoptimized={false}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Images Gallery */}
                {printable.previewImages && printable.previewImages.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-xl border-2 border-white/50 p-6">
                    <h3 className="text-xl font-bold text-text-dark mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Προεπισκόπηση ({printable.previewImages.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {printable.previewImages.map((image: any, idx: number) => {
                        const imageUrl = generateImageUrl(image, 400, 600);
                        return (
                          <div key={idx} className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-pink/50 transition-colors">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={`${printable.title} preview ${idx + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 50vw, 25vw"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Combined Meta and Description */}
              <div className="flex flex-col">
                {/* Combined Meta and Description Card - Matches cover image height */}
                <div className="bg-gradient-to-br from-primary-pink/5 via-accent-yellow/5 to-secondary-blue/5 rounded-2xl shadow-xl border-2 border-primary-pink/20 p-6 sm:p-8 flex flex-col h-full min-h-[600px]">
                  {/* Meta Information */}
                  <div className="mb-6">
                    <PrintableMeta printable={printable} />
                  </div>

                  {/* Description */}
                  {printable.summary && (
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-primary-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-lg font-bold text-text-dark">Περιγραφή</h2>
                      </div>
                      <p className="text-base sm:text-lg text-text-dark leading-relaxed flex-1">
                        {printable.summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Download Section - Consistent button across all screen sizes */}
            {printable.file && (
              <div className="flex justify-center mb-8 mt-6">
                <PrintableDownloadButton slug={printable.slug} variant="bright-green" />
              </div>
            )}

            {/* Additional Content - Full Width */}
            <div className="max-w-4xl mx-auto">
              {/* Printable Content Component */}
              <PrintableContent printable={printable} />

              {/* Share Buttons */}
              <div className="mt-12">
                <ShareButtons
                  title={printable.title}
                  url={`/drastiriotites/printables/${printable.slug}`}
                />
              </div>
            </div>
          </div>
        </Container>
        </article>
      </PageWrapper>
    </PrintableColorWrapper>
  );
}

