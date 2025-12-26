"use client";

interface SuccessMessageProps {
  title: string;
  message: string;
}

export function SuccessMessage({ title, message }: SuccessMessageProps) {
  return (
    <div className="bg-accent-green/10 border-2 border-accent-green rounded-card p-8 text-center relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => {
          const angle = (i / 50) * 360;
          const distance = 200 + Math.random() * 100;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;
          const rotation = Math.random() * 360;
          const delay = Math.random() * 0.5;
          const duration = 2 + Math.random() * 1;
          
          const colors = [
            "#FF6B9D", // primary-pink
            "#4A90E2", // secondary-blue
            "#FFD93D", // accent-yellow
            "#6BCF7F", // accent-green
            "#FF8C42", // orange
            "#9B59B6", // purple
          ];
          
          return (
            <div
              key={i}
              className="absolute confetti-piece"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%)`,
                "--confetti-x": `${x}px`,
                "--confetti-y": `${y}px`,
                "--confetti-rotation": `${rotation}deg`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                backgroundColor: colors[i % colors.length],
              } as React.CSSProperties}
            />
          );
        })}
      </div>
      
      {/* Success Message with Sliding Text */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-text-dark mb-2 animate-slide-up">
          {title}
        </h3>
        <p className="text-text-medium animate-slide-up-delay">
          {message}
        </p>
      </div>
    </div>
  );
}

