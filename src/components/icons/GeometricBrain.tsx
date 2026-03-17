import React from 'react';

export const GeometricBrain = ({ size = 24, color = "#800020", className = "" }: { size?: number, color?: string, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2L19 5V11L12 14L5 11V5L12 2Z" />
        <path d="M12 14L19 17V21L12 23L5 21V17L12 14Z" />
        <path d="M19 5L22 8V14L19 17" />
        <path d="M5 5L2 8V14L5 17" />
        <path d="M12 2V14" />
        <path d="M5 11H19" />
        <path d="M8 5L12 8L16 5" />
        <path d="M8 19L12 17L16 19" />
    </svg>
);
