import React from 'react';
import { getNodeColor } from '../utils/chartUtils';

interface NodeGradientsProps {
  nodeId: string;
  level: number;
}

export const NodeGradients: React.FC<NodeGradientsProps> = ({ nodeId, level }) => {
  const nodeColor = getNodeColor(level);

  return (
    <defs>
      {/* Node gradients */}
      <radialGradient id={`nodeGradient-${nodeId}`} cx="30%" cy="30%">
        <stop offset="0%" stopColor={`${nodeColor}dd`} />
        <stop offset="70%" stopColor={nodeColor} />
        <stop offset="100%" stopColor={`${nodeColor}bb`} />
      </radialGradient>
      <radialGradient id={`outerGlow-${nodeId}`} cx="50%" cy="50%">
        <stop offset="0%" stopColor={nodeColor} stopOpacity="0" />
        <stop offset="70%" stopColor={nodeColor} stopOpacity="0.1" />
        <stop offset="100%" stopColor={nodeColor} stopOpacity="0.3" />
      </radialGradient>

      {/* Badge gradients */}
      <radialGradient id="badgeGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="50%" stopColor="#1F2937" />
        <stop offset="100%" stopColor="#111827" />
      </radialGradient>
      <radialGradient id="badgeGlow" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
        <stop offset="70%" stopColor="#6366F1" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3" />
      </radialGradient>

      {/* Action button gradients */}
      <radialGradient id="editButtonGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#2563EB" />
      </radialGradient>
      <radialGradient id="editButtonGlow" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
        <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
      </radialGradient>
      
      <radialGradient id="addButtonGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </radialGradient>
      <radialGradient id="addButtonGlow" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
        <stop offset="70%" stopColor="#10B981" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
      </radialGradient>
      
      <radialGradient id="assignButtonGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </radialGradient>
      <radialGradient id="assignButtonGlow" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
        <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
      </radialGradient>
    </defs>
  );
};

export default NodeGradients;