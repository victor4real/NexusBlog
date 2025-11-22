import React from 'react';

interface AdSlotProps {
  format?: 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ format = 'horizontal', className = '' }) => {
  // In a real app, this would inject the Google AdSense script tag
  // e.g. (window.adsbygoogle = window.adsbygoogle || []).push({});
  
  let dimensions = "h-24 w-full";
  if (format === 'rectangle') dimensions = "h-64 w-full";
  if (format === 'vertical') dimensions = "h-full w-40";

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm p-4 ${dimensions} ${className}`}>
      <div className="text-center">
        <span className="font-semibold block mb-1">Advertisement</span>
        <span className="text-xs block">(AdSense Slot: {format})</span>
      </div>
    </div>
  );
};
