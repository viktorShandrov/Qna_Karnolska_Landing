import React from 'react';

interface LeafOrnamentProps {
  className?: string;
  color?: string;
  withLines?: boolean;
}

export const LeafOrnament: React.FC<LeafOrnamentProps> = ({ 
  className = "w-7 h-7", 
  color,
  withLines = true
}) => {
  return (
    <div className="flex items-center justify-center my-4 w-full max-w-xs mx-auto">
      {withLines && (
        <div className="flex-1 h-[1px] bg-current opacity-40"></div>
      )}
      
      <div className="px-3 flex items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={color ? { color } : undefined}
        >
          {/* Stem & Leaves matching reference */}
          <path
            d="M8 30C14 26 21 21 32 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M17 23C16 17 21 13 26 14C26 19 22 23 17 23Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M23 18C23 13 28 10 32 11C32 15 29 19 23 18Z"
            stroke="currentColor"
            strokeWidth="1.3"
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
