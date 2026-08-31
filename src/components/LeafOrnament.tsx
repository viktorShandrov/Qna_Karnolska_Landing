import React from 'react';

interface LeafOrnamentProps {
  className?: string;
  color?: string;
}

export const LeafOrnament: React.FC<LeafOrnamentProps> = ({ 
  className = "w-6 h-6", 
  color = "currentColor" 
}) => {
  return (
    <div className="flex items-center justify-center my-3 gap-2 opacity-85">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ color }}
      >
        <path
          d="M12 36C12 36 14 26 24 20C34 14 42 12 42 12C42 12 39 22 31 28C23 34 16 36 12 36Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 33C22 28 29 23 38 16"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M21 28C23 25 26 23 29 22"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
