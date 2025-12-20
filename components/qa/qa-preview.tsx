import { QAItem } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

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
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item._id} className="bg-background-white shadow-subtle border border-border/50">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">❓</div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-text-dark mb-2">{item.question}</h4>
                  {item.answer && (
                    <div className="prose prose-sm max-w-none text-text-medium leading-relaxed">
                      <PortableText value={item.answer as PortableTextBlock[]} />
                    </div>
                  )}
                  {item.category && (
                    <div className="mt-3">
                      <span className="px-3 py-1 rounded-full bg-primary-pink/10 text-primary-pink text-xs font-medium">
                        {item.category.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

