import React from 'react';
import { BannerSize, AdCopy } from '../types';

interface BannerProps {
  size: BannerSize;
  data: AdCopy;
  imageBase64: string;
}

export const Banner: React.FC<BannerProps> = ({ size, data, imageBase64 }) => {
  const { width, height } = size;
  const { headline, subheadline, cta, colors } = data;

  const isTall = height > width;
  const isWide = width > height * 2;
  const isTiny = height < 60;

  // Inline styles for dynamic ad sizing
  const containerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundImage: `url(data:image/jpeg;base64,${imageBase64})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  // Overlay to ensure text readability
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: colors.background, // Fallback color
    opacity: 0.3, // Semi-transparent overlay tint based on brand color
    mixBlendMode: 'multiply',
  };
  
  // Gradient overlay for better text pop
  const gradientStyle: React.CSSProperties = {
     position: 'absolute',
     inset: 0,
     background: `linear-gradient(${isTall ? 'to bottom' : 'to right'}, rgba(0,0,0,0.1), rgba(0,0,0,0.8))`,
  };

  return (
    <div className="flex flex-col gap-2 group">
        <div className="text-xs font-medium text-slate-500 flex justify-between">
            <span>{size.label}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 cursor-pointer">Preview</span>
        </div>
        
        <div 
            style={containerStyle} 
            className="shadow-lg rounded-sm flex-shrink-0 relative select-none transition-transform hover:scale-[1.02] duration-300 ease-out"
        >
        {/* Visual Layers */}
        <div style={overlayStyle} />
        <div style={gradientStyle} />

        {/* Content Layer */}
        <div className={`relative z-10 h-full w-full p-4 flex ${isTall ? 'flex-col justify-end' : isWide ? 'flex-row items-center justify-between px-6' : 'flex-col justify-end'} ${isTiny ? 'px-3 py-0' : ''}`}>
            
            <div className={`flex flex-col ${isWide && !isTiny ? 'max-w-[60%]' : 'w-full'} ${isTiny ? 'justify-center h-full' : ''}`}>
                <h3 
                    style={{ color: colors.text }} 
                    className={`font-bold leading-tight drop-shadow-md ${isTiny ? 'text-sm truncate' : isTall ? 'text-2xl mb-2' : 'text-xl mb-1'}`}
                >
                    {headline}
                </h3>
                
                {!isTiny && (
                    <p 
                        style={{ color: colors.text }} 
                        className={`font-medium opacity-90 drop-shadow-sm leading-snug ${isTall ? 'text-sm mb-4' : 'text-xs mb-0'}`}
                    >
                        {subheadline}
                    </p>
                )}
            </div>

            <div className={`${isWide && !isTiny ? 'flex-shrink-0 ml-4' : 'mt-auto pt-3'} ${isTiny ? 'ml-auto flex items-center' : ''}`}>
                <button
                    style={{ 
                        backgroundColor: colors.primary, 
                        color: colors.buttonText,
                        borderColor: colors.secondary 
                    }}
                    className={`
                        font-bold tracking-wide rounded shadow-md border-b-2 active:border-b-0 active:translate-y-[2px] transition-all
                        ${isTiny ? 'text-xs px-3 py-1 ml-4' : 'text-sm px-5 py-2 w-full'}
                        uppercase
                    `}
                >
                    {cta}
                </button>
            </div>
        </div>
        </div>
    </div>
  );
};