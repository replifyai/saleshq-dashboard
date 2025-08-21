import React from 'react';

interface TypeBadgeProps {
  type: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const typeText = type.toUpperCase() || 'UNIT';
  // Calculate width based on text length (approximate: 4.5px per character + padding)
  const textWidth = typeText.length * 4.5 + 22;
  const badgeWidth = Math.max(textWidth, 20); // Minimum width of 20px
  const badgeX = -badgeWidth / 2;

  return (
    <g>
      {/* Type badge background */}
      <rect
        x={badgeX}
        y="32"
        width={badgeWidth}
        height="14"
        rx="7"
        ry="7"
        fill="rgba(255,255,255,0.9)"
        stroke="rgba(107,114,128,0.2)"
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))' }}
      />
      {/* Type badge text */}
      <text
        x="0"
        y="39"
        textAnchor="middle"
        fill="#111827"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="0.1"
        alignmentBaseline="middle"
        style={{ 
          fontSize: '8px', 
          fontWeight: '700',
          textShadow: 'none',
          letterSpacing: '0.1px'
        }}
      >
        {typeText}
      </text>
    </g>
  );
};

export default TypeBadge;