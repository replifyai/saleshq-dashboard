import React, { memo } from 'react';
import { NodeCircle } from './NodeCircle';
import { UserCountBadge } from './UserCountBadge';
import { TypeBadge } from './TypeBadge';
import { ActionButtons } from './ActionButtons';
import { NodeGradients } from './NodeGradients';

interface CustomNodeElementProps {
  nodeDatum: {
    name: string;
    attributes?: {
      type: string;
      userCount: number;
      description?: string;
      location?: string;
      budget?: number;
      level: number;
      nodeId: string;
    };
  };
  onNodeClick: (nodeId: string) => void;
  onNodeEdit: (nodeId: string) => void;
  onAddChild: (nodeId: string) => void;
  onUserAssign: (nodeId: string) => void;
  selectedNodeId?: string;
  isAdmin: boolean;
}

export const CustomNodeElement: React.FC<CustomNodeElementProps> = memo((props) => {
  const { 
    nodeDatum, 
    onNodeClick, 
    onNodeEdit, 
    onAddChild, 
    onUserAssign, 
    selectedNodeId,
    isAdmin 
  } = props;
  
  const nodeId = nodeDatum.attributes?.nodeId || '';
  const isSelected = selectedNodeId === nodeId;
  const userCount = nodeDatum.attributes?.userCount || 0;
  const level = nodeDatum.attributes?.level || 0;
  const type = nodeDatum.attributes?.type || 'Unit';

  return (
    <g>
      <NodeGradients nodeId={nodeId} level={level} />
      
      <NodeCircle
        nodeId={nodeId}
        level={level}
        isSelected={isSelected}
        onNodeClick={onNodeClick}
        name={nodeDatum.name}
      />

      <UserCountBadge userCount={userCount} />

      <TypeBadge type={type} />

      <ActionButtons
        isSelected={isSelected}
        isAdmin={isAdmin}
        nodeId={nodeId}
        onNodeEdit={onNodeEdit}
        onAddChild={onAddChild}
        onUserAssign={onUserAssign}
      />
    </g>
  );
});

CustomNodeElement.displayName = 'CustomNodeElement';

export default CustomNodeElement;