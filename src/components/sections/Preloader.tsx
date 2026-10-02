'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(false), 500); // Wait for fade out
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[#050816] transition-opacity duration-500",
        !isLoading && "opacity-0"
      )}
    >
      <div className="relative w-24 h-24 animate-pulse">
        <Image src="/logo.svg" alt="" width={270} height={262} priority suppressHydrationWarning className="w-full h-full object-contain" />
      </div>
    </div>
  );
}
