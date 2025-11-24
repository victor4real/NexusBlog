
import React, { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID } from '../constants';

interface AdSlotProps {
  adSlot: string; // The specific ID for this ad unit from Google
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  layoutKey?: string; // Only for In-feed ads
}

export const AdSlot: React.FC<AdSlotProps> = ({ 
  adSlot, 
  format = 'auto', 
  className = '',
  layoutKey 
}) => {
  const adRef = useRef<HTMLModElement>(null);
  
  // Safe access to environment variable
  const isDev = React.useMemo(() => {
    try {
      return (import.meta as any).env?.DEV ?? false;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // We only want to push the ad if we are NOT in dev mode
    // because Google scripts often fail or ban localhost requests
    if (!isDev && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [isDev]);

  // -----------------------------------------------------------
  // DEVELOPMENT / PLACEHOLDER MODE
  // -----------------------------------------------------------
  if (isDev) {
    let dimensions = "h-24 w-full";
    if (format === 'rectangle') dimensions = "h-64 w-full";
    if (format === 'vertical') dimensions = "h-full w-40";

    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm p-4 ${dimensions} ${className}`}>
        <div className="text-center">
          <span className="font-semibold block mb-1 text-gray-600">AdSense Placeholder</span>
          <span className="text-xs block font-mono">Slot ID: {adSlot || 'Not Set'}</span>
          <span className="text-xs block text-red-400 mt-2">(Real ads hidden in dev)</span>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // PRODUCTION MODE
  // -----------------------------------------------------------
  return (
    <div className={`ad-container ${className} overflow-hidden text-center my-4`}>
       {/* 
         Google AdSense Element 
         Note: style={{ display: 'block' }} is usually required by responsive ads
       */}
       <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  );
};
