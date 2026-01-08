"use client";

import { useEffect, useState } from "react";
import { getRandomColor } from "@/lib/utils/kid-colors";

interface PrintableColorWrapperProps {
  children: React.ReactNode;
}

export function PrintableColorWrapper({ children }: PrintableColorWrapperProps) {
  const [colorScheme, setColorScheme] = useState<ReturnType<typeof getRandomColor> | null>(null);

  useEffect(() => {
    // Generate random color on mount (each visit gets different color)
    setColorScheme(getRandomColor());
    
    // Override PageWrapper background with higher specificity
    const style = document.createElement('style');
    style.id = 'printable-background-override';
    style.textContent = `
      .printable-page-wrapper main.bg-background-light {
        background: transparent !important;
      }
      .printable-page-wrapper main {
        background: transparent !important;
      }
    `;
    
    // Remove existing style if present
    const existingStyle = document.getElementById('printable-background-override');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    
    // Add class to body for targeting
    document.body.classList.add('printable-page-wrapper');
    
    return () => {
      const styleToRemove = document.getElementById('printable-background-override');
      if (styleToRemove) {
        styleToRemove.remove();
      }
      document.body.classList.remove('printable-page-wrapper');
    };
  }, []);

  if (!colorScheme) {
    // Show default while loading
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorScheme.bg} transition-colors duration-500`}>
      {children}
    </div>
  );
}

