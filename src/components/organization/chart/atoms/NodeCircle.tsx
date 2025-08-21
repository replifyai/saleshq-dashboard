import React from 'react';
import { getNodeColor } from '../utils/chartUtils';

interface NodeCircleProps {
  nodeId: string;
  level: number;
  isSelected: boolean;
  onNodeClick: (nodeId: string) => void;
  name: string;
}

export const NodeCircle: React.FC<NodeCircleProps> = ({
  nodeId,
  level,
  isSelected,
  onNodeClick,
  name
}) => {
  const nodeColor = getNodeColor(level);

  return (
    <g>
      {/* Outer glow effect */}
      <circle
        r={isSelected ? 38 : 32}
        fill={`url(#outerGlow-${nodeId})`}
        opacity="0.3"
      />
      
      {/* Node Circle with gradient */}
      <circle
        r={isSelected ? 32 : 27}
        fill={`url(#nodeGradient-${nodeId})`}
        stroke={isSelected ? '#1F2937' : '#FFFFFF'}
        strokeWidth={isSelected ? 3 : 2}
        style={{ 
          cursor: 'pointer',
          filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))'
        }}
        onClick={() => onNodeClick(nodeId)}
      />
      
      {/* Inner highlight ring */}
      <circle
        r={isSelected ? 28 : 23}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        opacity="0.8"
      />
      
      {/* Selection pulse effect */}
      {isSelected && (
        <circle
          r="35"
          fill="none"
          stroke={nodeColor}
          strokeWidth="2"
          opacity="0.6"
          style={{
            animation: 'chartPulse 2s infinite'
          }}
        />
      )}
      
      {/* Node Label with clean styling */}
      <text
        fill="white"
        strokeWidth="0"
        x="0"
        y="0"
        dy=".35em"
        textAnchor="middle"
        style={{ 
          fontSize: isSelected ? '13px' : '11px', 
          pointerEvents: 'none',
          letterSpacing: '0.3px',
          textTransform: 'uppercase'
        }}
      >
        {name.split(' ').map((word: string) => word[0]).join('').toUpperCase()}
      </text>

      {/* Node subtitle for selected nodes */}
      {isSelected && (
        <text
          fill="white"
          x="0"
          y="15"
          dy=".35em"
          textAnchor="middle"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="0.2"
          style={{ 
            fontSize: '9px', 
            fontWeight: '500',
            pointerEvents: 'none',
            textShadow: 'none'
          }}
        >
          Level {level}
        </text>
      )}
    </g>
  );
};

export default NodeCircle;