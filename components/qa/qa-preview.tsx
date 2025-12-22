"use client";

import { QAItem } from "@/lib/content";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

interface QAPreviewProps {
  items: QAItem[];
}

export function QAPreview({ items }: QAPreviewProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-text-dark mb-2">Συχνές Ερωτήσεις</h3>
        <p className="text-text-medium">
          Απαντήσεις σε ερωτήσεις που έχουν υποβληθεί από άλλους γονείς
        </p>
      </div>
      <Accordion>
        {items.map((item) => (
          <AccordionItem
            key={item._id}
            question={item.question}
            answer={
              item.answer ? (
                      <PortableText value={item.answer as PortableTextBlock[]} />
              ) : null
            }
            category={item.category?.title}
          />
        ))}
      </Accordion>
    </section>
  );
}

