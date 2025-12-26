"use client";

import { Printable } from "@/lib/content";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { PortableTextBlock } from "@portabletext/types";

interface PrintableContentProps {
  printable: Printable;
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value).width(800).height(600).url();
      return (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || "Printable image"}
            width={800}
            height={600}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <p className="text-sm text-text-medium text-center mt-2">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: any }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-secondary-blue hover:text-secondary-blue/80 underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-3xl font-bold text-text-dark mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-2xl font-bold text-text-dark mt-6 mb-3">{children}</h3>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 text-text-dark leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-text-dark">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-text-dark">{children}</ol>
    ),
  },
};

export function PrintableContent({ printable }: PrintableContentProps) {
  const handleDownload = async () => {
    if (printable.file) {
      try {
        // Fetch file URL from API
        const response = await fetch(`/api/printables/${printable.slug}/download`);
        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = data.url;
            link.download = `${printable.slug}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Download Button */}
      {printable.file && (
        <div className="bg-primary-pink/10 border-2 border-primary-pink rounded-card p-6 text-center">
          <h3 className="text-xl font-bold text-text-dark mb-3">Κατεβάστε το εκτυπώσιμο</h3>
          <p className="text-text-medium mb-4">
            Κάντε κλικ στο παρακάτω κουμπί για να κατεβάσετε το PDF
          </p>
          <Button
            onClick={handleDownload}
            size="lg"
            className="bg-primary-pink hover:bg-primary-pink/90 text-white"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Κατεβάστε PDF
          </Button>
        </div>
      )}

      {/* Preview Images */}
      {printable.previewImages && printable.previewImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-dark">Προεπισκόπηση</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {printable.previewImages.map((image: any, idx: number) => {
              const imageUrl = urlFor(image).width(600).height(800).url();
              return (
                <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${printable.title} preview ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      {printable.instructions && (
        <div className="bg-background-white rounded-card p-6 shadow-subtle border border-border/50">
          <h3 className="text-2xl font-bold text-text-dark mb-4">Οδηγίες</h3>
          <div className="prose prose-lg max-w-none">
            <PortableText
              value={printable.instructions as PortableTextBlock[]}
              components={portableTextComponents}
            />
          </div>
        </div>
      )}

      {/* Goals */}
      {printable.goals && printable.goals.length > 0 && (
        <div className="bg-accent-green/10 border-l-4 border-accent-green rounded-r-lg p-6">
          <h3 className="text-lg font-semibold text-text-dark mb-3">Στόχοι</h3>
          <ul className="space-y-2">
            {printable.goals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-text-dark">
                <span className="text-accent-green mt-1">✓</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

