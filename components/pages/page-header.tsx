interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <div className="mb-8 mt-12 space-y-3 sm:space-y-4">
      {eyebrow && (
        <p className="text-sm font-semibold text-secondary-blue tracking-wide uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-dark">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-text-medium max-w-3xl">{description}</p>
      )}
    </div>
  );
}

