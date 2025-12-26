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
  const [isHovered, setIsHovered] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="bg-background-white rounded-card border-2 border-transparent shadow-subtle overflow-hidden transition-all duration-300 hover:border-primary-pink/30 hover:shadow-lg hover:scale-[1.01]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full flex items-center justify-between p-6 text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-pink/5 hover:to-purple-50/50"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className={cn(
            "text-3xl flex-shrink-0 transition-all duration-300",
            isHovered && "scale-110 rotate-12",
            isOpen && "text-primary-pink"
          )}>
            ❓
          </div>
          <div className="flex-1">
            <h4 className={cn(
              "text-lg font-semibold pr-4 transition-colors duration-300",
              isHovered ? "text-primary-pink" : "text-text-dark"
            )}>
              {question}
            </h4>
            {category && (
              <div className="mt-2">
                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-pink/20 to-purple-100 text-primary-pink text-xs font-semibold shadow-sm transition-all duration-300 hover:from-primary-pink/30 hover:to-purple-200 hover:scale-105">
                  {category}
                </span>
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out",
            isOpen ? "transform rotate-180 text-primary-pink" : "text-text-medium",
            isHovered && !isOpen && "text-primary-pink scale-110"
          )}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div
            ref={contentRef}
            className="px-6 pb-6 pt-0 border-t border-primary-pink/20 bg-gradient-to-b from-white to-primary-pink/5"
          >
            <div className="pt-4 prose prose-sm max-w-none text-text-medium leading-relaxed">
              {answer}
            </div>
          </div>
        </div>
      </div>
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


