"use client";
import { useState } from "react";
import { X, Megaphone } from "lucide-react";

export default function AnnounceBarDefault({ content = {} }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const { message } = content;

  return (
    <div className="bg-primary text-primary-foreground relative w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 py-3 pr-10 sm:pr-0">
          <Megaphone className="hidden h-4 w-4 shrink-0 sm:block" />
          <p className="text-center text-xs leading-relaxed font-medium sm:text-sm">
            {message}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="text-primary-foreground/80 hover:text-primary-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors sm:right-4"
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
