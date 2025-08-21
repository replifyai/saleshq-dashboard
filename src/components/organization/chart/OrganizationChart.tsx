'use client'
import React, { useState, useCallback, useMemo, useEffect, useRef, memo } from 'react';
import Tree from 'react-d3-tree';
import { Eye } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useOrganizationPermissionsRedux } from '@/hooks/useOrganizationRedux';
import { convertToTreeData, chartAnimationStyles } from './utils/chartUtils';
import { CustomNodeElement } from './atoms';
import { NodeDetailsPanel, ChartControls, ChartLegend, FullscreenChart } from './components';

import type { OrganizationNode } from '@/types/organization';

interface OrganizationChartProps {
  nodes: OrganizationNode[];
  onNodeSelect?: (node: OrganizationNode) => void;
  onNodeEdit?: (node: OrganizationNode) => void;
  onAddChild?: (parentId: string) => void;
  onUserAssign?: (nodeId: string) => void;
  className?: string;
}



const OrganizationChartComponent: React.FC<OrganizationChartProps> = ({
  nodes,
  onNodeSelect,
  onNodeEdit,
  onAddChild,
  onUserAssign,
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<OrganizationNode | null>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { canEditNode, canAssignUsers, canCreateNodes } = useOrganizationPermissionsRedux();
  
  // Memoize admin status to prevent re-renders
  const isAdmin = useMemo(() => 
    canEditNode('') || canAssignUsers('') || canCreateNodes(), 
    [canEditNode, canAssignUsers, canCreateNodes]
  );

  // Convert organization nodes to react-d3-tree format
  const treeData = useMemo(() => convertToTreeData(nodes), [nodes]);

  // Initialize tree position - center horizontally, position at top
  useEffect(() => {
    if (!isInitialized && containerRef.current && treeData.length > 0) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      
      // Center horizontally, position near the top
      setTranslate({
        x: containerWidth / 2,
        y: 100  // Position near the top instead of center
      });
      setIsInitialized(true);
    }
  }, [treeData, isInitialized]);

  // Reset initialization when nodes change significantly
  useEffect(() => {
    setIsInitialized(false);
  }, [nodes.length]);

  // Memoize nodes to create stable reference for findNodeById
  const stableNodes = useMemo(() => nodes, [nodes]);
  
  // Find node by ID - memoized with stable nodes reference
  const findNodeById = useMemo(() => {
    const nodeMap = new Map<string, OrganizationNode>();
    
    const buildMap = (nodeList: OrganizationNode[]) => {
      for (const node of nodeList) {
        nodeMap.set(node.id, node);
        buildMap(node.children);
      }
    };
    
    buildMap(stableNodes);
    
    return (nodeId: string): OrganizationNode | null => {
      return nodeMap.get(nodeId) || null;
    };
  }, [stableNodes]);

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    const node = findNodeById(nodeId);
    if (node) {
      setSelectedNode(node);
      if (onNodeSelect) {
        onNodeSelect(node);
      }
    }
  }, [findNodeById, onNodeSelect]);

  // Handle node edit
  const handleNodeEdit = useCallback((nodeId: string) => {
    const node = findNodeById(nodeId);
    if (node && onNodeEdit) {
      onNodeEdit(node);
    }
  }, [findNodeById, onNodeEdit]);

  // Handle add child
  const handleAddChild = useCallback((nodeId: string) => {
    if (onAddChild) {
      onAddChild(nodeId);
    }
  }, [onAddChild]);

  // Handle user assign
  const handleUserAssign = useCallback((nodeId: string) => {
    if (onUserAssign) {
      onUserAssign(nodeId);
    }
  }, [onUserAssign]);

  // Memoize Tree component props to prevent unnecessary re-renders
  const treeProps = useMemo(() => ({
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
  }), [treeData, orientation, translate, zoom]);

  // Memoize custom node element renderer
  const customNodeRenderer = useCallback((nodeProps: any) => (
    <CustomNodeElement
      {...nodeProps}
      onNodeClick={handleNodeClick}
      onNodeEdit={handleNodeEdit}
      onAddChild={handleAddChild}
      onUserAssign={handleUserAssign}
      selectedNodeId={selectedNode?.id}
      isAdmin={isAdmin}
    />
  ), [handleNodeClick, handleNodeEdit, handleAddChild, handleUserAssign, selectedNode?.id, isAdmin]);

  // Memoize tree click handler
  const handleTreeNodeClick = useCallback((nodeData: any) => {
    const nodeId = nodeData.data?.attributes?.nodeId;
    if (nodeId && typeof nodeId === 'string') {
      handleNodeClick(nodeId);
    }
  }, [handleNodeClick]);

  // Chart controls - memoized to prevent re-renders
  const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev * 1.2, 3)), []);
  const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev / 1.2, 0.1)), []);
  const handleReset = useCallback(() => {
    setZoom(1);
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      setTranslate({
        x: containerWidth / 2,
        y: 100  // Reset to top position
      });
    } else {
      setTranslate({ x: 0, y: 0 });
    }
  }, []);
  
  const handleOrientationToggle = useCallback(() => {
    setOrientation(prev => prev === 'vertical' ? 'horizontal' : 'vertical');
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(prev => !prev);
    // Re-initialize positioning when entering/exiting fullscreen
    setIsInitialized(false);
  }, []);



  // If fullscreen is active, render only the fullscreen component
  if (isFullscreen) {
    return (
      <FullscreenChart
        treeData={treeData}
        translate={translate}
        zoom={zoom}
        orientation={orientation}
        selectedNode={selectedNode}
        isAdmin={isAdmin}
        onNodeClick={handleNodeClick}
        onNodeEdit={handleNodeEdit}
        onAddChild={handleAddChild}
        onUserAssign={handleUserAssign}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onOrientationToggle={handleOrientationToggle}
        onFullscreenToggle={handleFullscreenToggle}
        onNodeEditCallback={onNodeEdit}
        onAddChildCallback={onAddChild}
        onUserAssignCallback={onUserAssign}
        setSelectedNode={setSelectedNode}
      />
    );
  }

  return (
    <Card className={`relative organization-chart ${className}`}>
      {/* CSS Animations for chart effects */}
      <style dangerouslySetInnerHTML={{ __html: chartAnimationStyles }} />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Organization Chart</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Interactive hierarchy visualization</p>
            </div>
          </CardTitle>
          
          <ChartControls
            orientation={orientation}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            onOrientationToggle={handleOrientationToggle}
            onFullscreenToggle={handleFullscreenToggle}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        {/* Chart Container */}
        <div 
          ref={containerRef}
          className="w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
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

        {/* Node Details Panel */}
        <NodeDetailsPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onEdit={onNodeEdit}
          onAddChild={onAddChild}
          onUserAssign={onUserAssign}
        />

        <ChartLegend
          zoom={zoom}
          orientation={orientation}
          isAdmin={isAdmin}
        />
      </CardContent>
    </Card>
  );
};

// Memoize the entire component with custom comparison
export const OrganizationChart = memo(OrganizationChartComponent, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.nodes === nextProps.nodes &&
    prevProps.onNodeSelect === nextProps.onNodeSelect &&
    prevProps.onNodeEdit === nextProps.onNodeEdit &&
    prevProps.onAddChild === nextProps.onAddChild &&
    prevProps.onUserAssign === nextProps.onUserAssign &&
    prevProps.className === nextProps.className
  );
});

OrganizationChart.displayName = 'OrganizationChart';

export default OrganizationChart;