"use client";

import { Printable } from "@/lib/content";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image-url";
import Image from "next/image";
import { PrintableDownloadButton } from "./printable-download-button";
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
  return (
    <div className="space-y-8">
      {/* Download Button - Mobile Only (Desktop has it in sidebar) */}
      {printable.file && (
        <div className="lg:hidden bg-gradient-to-br from-primary-pink to-accent-yellow rounded-2xl shadow-2xl border-2 border-white/50 p-4 sm:p-6 text-white text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Κατεβάστε το εκτυπώσιμο</h3>
          <p className="text-white/90 text-sm mb-4">
            Κάντε κλικ στο παρακάτω κουμπί για να κατεβάσετε το PDF
          </p>
          <div className="flex justify-center">
            <PrintableDownloadButton slug={printable.slug} variant="gradient" />
          </div>
        </div>
      )}

      {/* Instructions */}
      {printable.instructions && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-white/50 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-pink/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-text-dark">Οδηγίες</h3>
          </div>
          <div className="prose prose-lg max-w-none text-text-dark">
            <PortableText
              value={printable.instructions as PortableTextBlock[]}
              components={portableTextComponents}
            />
          </div>
        </div>
      )}

      {/* Goals */}
      {printable.goals && printable.goals.length > 0 && (
        <div className="bg-gradient-to-br from-accent-green/10 to-secondary-blue/10 rounded-2xl shadow-xl border-2 border-accent-green/30 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-text-dark">Στόχοι</h3>
          </div>
          <ul className="space-y-3">
            {printable.goals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-3 text-text-dark bg-white/50 rounded-lg p-4">
                <span className="text-accent-green mt-0.5 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-base leading-relaxed">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

