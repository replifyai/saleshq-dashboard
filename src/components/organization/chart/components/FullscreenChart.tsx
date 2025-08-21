import React, { useRef, useCallback } from 'react';
import Tree from 'react-d3-tree';
import { Eye } from 'lucide-react';

import { ChartControls } from './ChartControls';
import { ChartLegend } from './ChartLegend';
import { NodeDetailsPanel } from './NodeDetailsPanel';
import { CustomNodeElement } from '../atoms/CustomNodeElement';
import { chartAnimationStyles } from '../utils/chartUtils';

import type { OrganizationNode } from '@/types/organization';
import type { TreeNodeData } from '../utils/chartUtils';

interface FullscreenChartProps {
  treeData: TreeNodeData[];
  translate: { x: number; y: number };
  zoom: number;
  orientation: 'vertical' | 'horizontal';
  selectedNode: OrganizationNode | null;
  isAdmin: boolean;
  onNodeClick: (nodeId: string) => void;
  onNodeEdit: (nodeId: string) => void;
  onAddChild: (nodeId: string) => void;
  onUserAssign: (nodeId: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onOrientationToggle: () => void;
  onFullscreenToggle: () => void;
  onNodeSelect?: (node: OrganizationNode) => void;
  onNodeEditCallback?: (node: OrganizationNode) => void;
  onAddChildCallback?: (parentId: string) => void;
  onUserAssignCallback?: (nodeId: string) => void;
  setSelectedNode: (node: OrganizationNode | null) => void;
}

export const FullscreenChart: React.FC<FullscreenChartProps> = ({
  treeData,
  translate,
  zoom,
  orientation,
  selectedNode,
  isAdmin,
  onNodeClick,
  onNodeEdit,
  onAddChild,
  onUserAssign,
  onZoomIn,
  onZoomOut,
  onReset,
  onOrientationToggle,
  onFullscreenToggle,
  onNodeEditCallback,
  onAddChildCallback,
  onUserAssignCallback,
  setSelectedNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize custom node element renderer
  const customNodeRenderer = useCallback((nodeProps: any) => (
    <CustomNodeElement
      {...nodeProps}
      onNodeClick={onNodeClick}
      onNodeEdit={onNodeEdit}
      onAddChild={onAddChild}
      onUserAssign={onUserAssign}
      selectedNodeId={selectedNode?.id}
      isAdmin={isAdmin}
    />
  ), [onNodeClick, onNodeEdit, onAddChild, onUserAssign, selectedNode?.id, isAdmin]);

  // Memoize tree click handler
  const handleTreeNodeClick = useCallback((nodeData: any) => {
    const nodeId = nodeData.data?.attributes?.nodeId;
    if (nodeId && typeof nodeId === 'string') {
      onNodeClick(nodeId);
    }
  }, [onNodeClick]);

  // Memoize Tree component props
  const treeProps = {
    data: treeData,
    orientation,
    translate,
    zoom,
    scaleExtent: { min: 0.1, max: 3 },
    separation: { siblings: 2.2, nonSiblings: 2.8 },
    nodeSize: { x: 160, y: 120 },
    pathFunc: "diagonal" as const,
    transitionDuration: 500,
    enableLegacyTransitions: true,
    pathClassFunc: () => "stroke-gray-300 dark:stroke-gray-600 stroke-2"
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: chartAnimationStyles }} />
      
      {/* Fullscreen Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Organization Chart - Full Screen</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Interactive hierarchy visualization</p>
          </div>
        </div>
        
        <ChartControls
          orientation={orientation}
          isFullscreen={true}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onReset={onReset}
          onOrientationToggle={onOrientationToggle}
          onFullscreenToggle={onFullscreenToggle}
        />
      </div>

      {/* Fullscreen Chart Container */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={containerRef}
          className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 relative"
        >
          {treeData.length > 0 ? (
            <Tree
              {...treeProps}
              renderCustomNodeElement={customNodeRenderer}
              onNodeClick={handleTreeNodeClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Eye className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No Data Available</h3>
                <p className="text-sm">No organizational data to display in the chart view.</p>
              </div>
            </div>
          )}
        </div>

        <NodeDetailsPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onEdit={onNodeEditCallback}
          onAddChild={onAddChildCallback}
          onUserAssign={onUserAssignCallback}
        />

        <ChartLegend
          zoom={zoom}
          orientation={orientation}
          isAdmin={isAdmin}
          isFullscreen={true}
        />
      </div>
    </div>
  );
};

export default FullscreenChart;