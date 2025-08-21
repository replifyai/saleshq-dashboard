import React from 'react';

interface ActionButtonsProps {
  isSelected: boolean;
  isAdmin: boolean;
  nodeId: string;
  onNodeEdit: (nodeId: string) => void;
  onAddChild: (nodeId: string) => void;
  onUserAssign: (nodeId: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSelected,
  isAdmin,
  nodeId,
  onNodeEdit,
  onAddChild,
  onUserAssign
}) => {
  if (!isSelected || !isAdmin) {
    return null;
  }

  return (
    <g style={{ opacity: 0, animation: 'chartFadeIn 0.5s ease-out 0.3s forwards' }}>
      {/* Edit Button */}
      <g style={{ cursor: 'pointer' }} onClick={(e) => {
        e.stopPropagation();
        onNodeEdit(nodeId);
      }}>
        {/* Button glow */}
        <circle
          cx="-40"
          cy="0"
          r="15"
          fill="url(#editButtonGlow)"
          opacity="0.4"
        />
        {/* Button shadow */}
        <circle
          cx="-39"
          cy="1"
          r="11"
          fill="rgba(0,0,0,0.15)"
        />
        {/* Button gradient background */}
        <circle
          cx="-40"
          cy="0"
          r="10"
          fill="url(#editButtonGradient)"
          stroke="white"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2))' }}
        />
        {/* Button inner highlight */}
        <circle
          cx="-40"
          cy="0"
          r="7"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        {/* Button icon */}
        <text
          x="-40"
          y="0"
          dy=".35em"
          textAnchor="middle"
          fill="white"
          style={{ 
            fontSize: '9px', 
            pointerEvents: 'none', 
            fontWeight: '600',
            textShadow: 'none'
          }}
        >
          ✏️
        </text>
      </g>

      {/* Add Child Button */}
      <g style={{ cursor: 'pointer' }} onClick={(e) => {
        e.stopPropagation();
        onAddChild(nodeId);
      }}>
        {/* Button glow */}
        <circle
          cx="40"
          cy="0"
          r="15"
          fill="url(#addButtonGlow)"
          opacity="0.4"
        />
        {/* Button shadow */}
        <circle
          cx="41"
          cy="1"
          r="11"
          fill="rgba(0,0,0,0.15)"
        />
        {/* Button gradient background */}
        <circle
          cx="40"
          cy="0"
          r="10"
          fill="url(#addButtonGradient)"
          stroke="white"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2))' }}
        />
        {/* Button inner highlight */}
        <circle
          cx="40"
          cy="0"
          r="7"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        {/* Button icon */}
        <text
          x="40"
          y="0"
          dy=".35em"
          textAnchor="middle"
          fill="white"
          style={{ 
            fontSize: '9px', 
            pointerEvents: 'none', 
            fontWeight: '600',
            textShadow: 'none'
          }}
        >
          ➕
        </text>
      </g>

      {/* Assign User Button */}
      <g style={{ cursor: 'pointer' }} onClick={(e) => {
        e.stopPropagation();
        onUserAssign(nodeId);
      }}>
        {/* Button glow */}
        <circle
          cx="0"
          cy="40"
          r="15"
          fill="url(#assignButtonGlow)"
          opacity="0.4"
        />
        {/* Button shadow */}
        <circle
          cx="1"
          cy="41"
          r="11"
          fill="rgba(0,0,0,0.15)"
        />
        {/* Button gradient background */}
        <circle
          cx="0"
          cy="40"
          r="10"
          fill="url(#assignButtonGradient)"
          stroke="white"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.2))' }}
        />
        {/* Button inner highlight */}
        <circle
          cx="0"
          cy="40"
          r="7"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        {/* Button icon */}
        <text
          x="0"
          y="40"
          dy=".35em"
          textAnchor="middle"
          fill="white"
          style={{ 
            fontSize: '9px', 
            pointerEvents: 'none', 
            fontWeight: '600',
            textShadow: 'none'
          }}
        >
          👤
        </text>
      </g>
    </g>
  );
};

export default ActionButtons;