import { icons } from 'lucide-react';
import React from 'react';

export function LucideIcon({ name, className }: { name: string; className?: string }) {

  const normalizedName = name
    .toLowerCase()
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
    
  const IconComponent = icons[normalizedName as keyof typeof icons];
  
  return React.createElement(IconComponent || icons.Share2, {
    size: 22,
    strokeWidth: 1.75,
    className
  });
}
