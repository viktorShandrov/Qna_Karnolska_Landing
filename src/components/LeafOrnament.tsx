import React from 'react';

interface LeafOrnamentProps {
  className?: string;
  color?: string;
  withLines?: boolean;
}

export const LeafOrnament: React.FC<LeafOrnamentProps> = ({ 
  className = "w-7 h-7", 
  color,
  withLines = false
}) => {
  return (
    <div className="flex items-center justify-center my-3 w-full max-w-xs mx-auto">
      {withLines && (
        <div className="flex-1 h-[1px] bg-current opacity-40"></div>
      )}
      
      <div className="px-3 flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={color ? { color } : undefined}
        >
          {/* Main Diagonal Stem */}
          <path
            d="M13 36L30 18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Left Leaf Loop */}
          <path
            d="M20 28C16.5 24 14 17 17.5 12.5C21 11.5 25 15.5 26.5 21"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top-Right Center Leaf Loop */}
          <path
            d="M26.5 21C27.5 15 32 8.5 36 10C39.5 11.5 37.5 18 31 22.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom-Right Horizontal Leaf Loop */}
          <path
            d="M23 25.5C27 25 36.5 22.5 39.5 26C40.5 29.5 36 32 20 28.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {withLines && (
        <div className="flex-1 h-[1px] bg-current opacity-40"></div>
      )}
    </div>
  );
};
