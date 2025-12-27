"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown } from "lucide-react";
import { EMAIL_TEMPLATES, getTemplatesByCategory, replaceTemplateVariables, type EmailTemplate } from "@/lib/constants";

interface EmailTemplatesProps {
  submissionType: string;
  submissionName?: string | null;
  submissionMessage: string;
  onInsertTemplate: (text: string) => void;
}

export function EmailTemplates({
  submissionType,
  submissionName,
  submissionMessage,
  onInsertTemplate,
}: EmailTemplatesProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Filter templates by submission type
  const relevantTemplates = getTemplatesByCategory(
    submissionType === "question" ? "question" :
    submissionType === "feedback" ? "feedback" :
    submissionType === "video_idea" ? "video_idea" :
    submissionType === "review" ? "review" :
    "general"
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleTemplateClick = (template: EmailTemplate) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikroimathites.gr";
    
    // Replace template variables with actual values
    const filledTemplate = replaceTemplateVariables(template.body, {
      name: submissionName,
      question: submissionMessage,
      message: submissionMessage,
      siteUrl,
    });
    
    // Insert template
    onInsertTemplate(filledTemplate);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Προτύπα Email
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      
      {open && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-2">
            <div className="px-2 py-1.5 text-sm font-semibold text-gray-700 border-b mb-2">
              Επιλέξτε Πρότυπο
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {relevantTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 transition-colors group"
                >
                  <div className="font-medium text-sm text-gray-900 group-hover:text-primary-pink transition-colors">
                    {template.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-gray-500 px-2">
              Κάντε κλικ σε ένα πρότυπο για να το εισαγάγετε. Μπορείτε να το επεξεργαστείτε μετά.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

