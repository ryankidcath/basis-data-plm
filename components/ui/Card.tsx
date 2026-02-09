import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = "", title }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-navy-200 bg-white shadow overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-navy-200 bg-navy-50/80">
          <h3 className="text-sm font-semibold text-navy-800">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
