import React from 'react';

interface UserCountBadgeProps {
  userCount: number;
}

export const UserCountBadge: React.FC<UserCountBadgeProps> = ({ userCount }) => {
  if (userCount === 0) {
    return null;
  }

  return (
    <g>
      {/* Badge background gradient */}
      <circle
        cx="20"
        cy="-18"
        r="11"
        fill="url(#badgeGradient)"
        stroke="white"
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' }}
      />
      {/* Badge inner highlight */}
      <circle
        cx="20"
        cy="-18"
        r="8"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      {/* Badge text */}
      <text
        x="20"
        y="-18"
        dy=".35em"
        textAnchor="middle"
        fill="white"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth="0.3"
        style={{ 
          fontSize: '9px', 
          fontWeight: '700',
          textShadow: 'none',
          letterSpacing: '0.1px'
        }}
      >
        {userCount > 99 ? '99+' : userCount}
      </text>
    </g>
  );
};

export default UserCountBadge;