"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  category?: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, category, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-background-white rounded-card border border-border/50 shadow-subtle overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-background-light transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="text-2xl flex-shrink-0">❓</div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-text-dark pr-4">{question}</h4>
            {category && !isOpen && (
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full bg-primary-pink/10 text-primary-pink text-xs font-medium">
                  {category}
                </span>
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-text-medium flex-shrink-0 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0 border-t border-border/50">
          <div className="pt-4 prose prose-sm max-w-none text-text-medium leading-relaxed">
            {answer}
          </div>
          {category && (
            <div className="mt-4">
              <span className="px-3 py-1 rounded-full bg-primary-pink/10 text-primary-pink text-xs font-medium">
                {category}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}

