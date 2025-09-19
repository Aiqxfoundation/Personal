import { useState } from "react";
import OrgNode from "./OrgNode";
import { OrgNode as OrgNodeType } from "@shared/schema";

interface OrgChartProps {
  nodes: OrgNodeType[];
  onEdit?: (node: OrgNodeType) => void;
  onDelete?: (nodeId: string) => void;
  onAddChild?: (parentId: string) => void;
}

type TreeNode = OrgNodeType & { children: TreeNode[] };

export default function OrgChart({ nodes, onEdit, onDelete, onAddChild }: OrgChartProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Build the tree structure
  const buildTree = (nodes: OrgNodeType[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    
    // Initialize all nodes
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // Build parent-child relationships
    const roots: TreeNode[] = [];
    
    nodes.forEach(node => {
      const nodeWithChildren = nodeMap.get(node.id)!;
      
      if (node.parentId && nodeMap.has(node.parentId)) {
        nodeMap.get(node.parentId)!.children.push(nodeWithChildren);
      } else {
        roots.push(nodeWithChildren);
      }
    });

    return roots;
  };

  const renderNode = (node: TreeNode, level = 0) => {
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col items-center" data-testid={`chart-node-${node.id}`}>
        {/* Node */}
        <OrgNode
          node={node}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
          isSelected={selectedNodeId === node.id}
          onClick={() => setSelectedNodeId(selectedNodeId === node.id ? null : node.id)}
        />

        {/* Children */}
        {hasChildren && (
          <div className="flex flex-col items-center">
            {/* Vertical line down from parent */}
            <div className="w-0.5 h-8 bg-border" />
            
            {/* Connection point for horizontal line */}
            {node.children.length > 1 && (
              <div className="w-0.5 h-4 bg-border" />
            )}
            
            {/* Children container */}
            <div className="relative">
              {/* Horizontal connecting line - spans across all children */}
              {node.children.length > 1 && (
                <div 
                  className="absolute h-0.5 bg-border"
                  style={{
                    top: node.children.length > 1 ? '0px' : '0px',
                    left: '0px',
                    right: '0px'
                  }}
                />
              )}
              
              {/* Children layout */}
              <div className={`flex ${node.children.length === 1 ? 'justify-center' : 'justify-between'} gap-16 pt-4`}>
                {node.children.map((child, index) => (
                  <div key={child.id} className="relative flex flex-col items-center">
                    {/* Vertical line up from horizontal line to child */}
                    <div className="w-0.5 h-4 bg-border" />
                    {/* Child node */}
                    {renderNode(child, level + 1)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(nodes);

  if (nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center" data-testid="empty-chart">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No positions in the organizational chart</p>
          <p className="text-sm text-muted-foreground">Click "Add Position" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto p-8" data-testid="org-chart">
      <div className="flex flex-col gap-12">
        {tree.map(root => renderNode(root))}
      </div>
    </div>
  );
}