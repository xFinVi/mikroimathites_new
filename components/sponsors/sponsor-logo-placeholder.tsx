"use client";

interface SponsorLogoPlaceholderProps {
  name: string;
  color?: string;
}

export function SponsorLogoPlaceholder({ name, color = "#FF6B9D" }: SponsorLogoPlaceholderProps) {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Get first word for display
  const firstWord = name.split(' ')[0];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Logo Circle with Initials */}
      <div 
        className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-md"
        style={{ backgroundColor: color }}
      >
        <span className="text-2xl font-bold text-white">
          {initials}
        </span>
      </div>
    </div>
  );
}

