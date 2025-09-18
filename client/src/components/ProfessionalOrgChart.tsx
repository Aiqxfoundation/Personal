import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { OrgNode as OrgNodeType } from "@shared/schema";

interface ProfessionalOrgChartProps {
  nodes: OrgNodeType[];
}

type TreeNode = OrgNodeType & { children: TreeNode[] };

export default function ProfessionalOrgChart({ nodes }: ProfessionalOrgChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const buildTree = (nodes: OrgNodeType[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

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

  const downloadChart = async () => {
    if (!chartRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        width: chartRef.current.scrollWidth,
        height: chartRef.current.scrollHeight
      });
      
      const link = document.createElement('a');
      link.download = 'organizational-chart.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to download chart:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderOrgNode = (node: TreeNode, isRoot = false) => {
    return (
      <Card
        key={node.id}
        className={`min-w-[180px] p-4 text-center transition-all hover-elevate ${
          isRoot ? 'bg-primary text-primary-foreground' : 'bg-card'
        }`}
        data-testid={`professional-node-${node.id}`}
      >
        <div className="space-y-1">
          <div className={`text-sm font-semibold ${
            isRoot ? 'text-primary-foreground' : 'text-primary'
          }`}>
            {node.title}
          </div>
          <div className={`text-sm ${
            isRoot ? 'text-primary-foreground' : 'text-foreground'
          }`}>
            {node.name}
          </div>
        </div>
      </Card>
    );
  };

  const renderTreeNode = (node: TreeNode, level = 0) => {
    const isRoot = level === 0;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {renderOrgNode(node, isRoot)}
        
        {hasChildren && (
          <>
            <div className="w-0.5 h-8 bg-primary/40" />
            
            {node.children.length > 1 && (
              <div 
                className="h-0.5 bg-primary/40"
                style={{
                  width: `${(node.children.length - 1) * 220}px`
                }}
              />
            )}
            
            <div className="flex gap-8 mt-4">
              {node.children.map(child => (
                <div key={child.id} className="relative">
                  <div className="w-0.5 h-4 bg-primary/40 absolute top-[-1rem] left-1/2 transform -translate-x-1/2" />
                  {renderTreeNode(child, level + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const tree = buildTree(nodes);

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-background dark:to-secondary/20 relative">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          onClick={downloadChart}
          disabled={isDownloading}
          className="bg-primary hover:bg-primary/90"
          data-testid="button-download-chart"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download Chart'}
        </Button>
      </div>

      <div 
        ref={chartRef} 
        className="w-full h-full flex items-center justify-center p-16 overflow-auto"
        data-testid="chart-container"
      >
        {tree.length > 0 ? (
          <div className="flex flex-col gap-12">
            {tree.map(root => renderTreeNode(root))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No organizational data available</p>
          </div>
        )}
      </div>
    </div>
  );
}