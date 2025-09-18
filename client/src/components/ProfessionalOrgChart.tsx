import { useState, useRef } from "react";
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

  const downloadChart = async () => {
    if (!chartRef.current) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#e6f0ff',
        scale: 3,
        useCORS: true,
        allowTaint: false,
        width: chartRef.current.scrollWidth,
        height: chartRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: chartRef.current.scrollWidth,
        windowHeight: chartRef.current.scrollHeight
      });
      
      const link = document.createElement('a');
      link.download = 'organizational-chart.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download chart:', error);
    } finally {
      setIsDownloading(false);
    }
  };

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

  const OrgBox = ({ node, isCEO = false }: { node: TreeNode; isCEO?: boolean }) => (
    <div
      className={`relative min-w-[180px] px-4 py-3 text-center rounded-lg border-2 transition-all ${
        isCEO 
          ? 'bg-blue-500 text-white border-blue-600 font-semibold' 
          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
      }`}
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div className={`text-sm font-semibold ${isCEO ? 'text-white' : 'text-blue-600'} mb-1`}>
        {node.title}
      </div>
      <div className={`text-sm ${isCEO ? 'text-white' : 'text-gray-800'}`}>
        {node.name}
      </div>
    </div>
  );

  const renderTree = (node: TreeNode, level = 0): JSX.Element => {
    const isCEO = level === 0;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col items-center">
        <OrgBox node={node} isCEO={isCEO} />
        
        {hasChildren && (
          <div className="relative">
            {/* Always show vertical line from parent to children */}
            <div 
              className="w-0.5 bg-blue-400"
              style={{ height: '32px', margin: '0 auto' }}
            />
            
            {/* Show horizontal line only when there are multiple children */}
            {node.children.length > 1 && (
              <div 
                className="h-0.5 bg-blue-400 absolute"
                style={{
                  width: `${(node.children.length - 1) * 200}px`,
                  left: `${-(node.children.length - 1) * 100}px`,
                  top: '32px'
                }}
              />
            )}
            
            <div 
              className="flex justify-center gap-8 mt-8"
              style={{ gap: '50px' }}
            >
              {node.children.map((child: TreeNode) => (
                <div key={child.id} className="relative">
                  {/* Always show vertical line from horizontal connector to child, except for single children */}
                  {node.children.length > 1 ? (
                    <div 
                      className="w-0.5 h-8 bg-blue-400 absolute left-1/2 transform -translate-x-1/2"
                      style={{ top: '-32px' }}
                    />
                  ) : (
                    // For single child, show connecting line directly
                    <div 
                      className="w-0.5 h-8 bg-blue-400 absolute left-1/2 transform -translate-x-1/2"
                      style={{ top: '-40px' }}
                    />
                  )}
                  {renderTree(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(nodes);

  return (
    <div 
      className="w-full h-full relative overflow-auto"
      style={{
        background: 'linear-gradient(135deg, #e6f0ff 0%, #c9e0ff 100%)',
        minHeight: '100vh'
      }}
    >
      <div className="absolute top-4 left-4 z-20">
        <Button 
          onClick={downloadChart}
          disabled={isDownloading}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          data-testid="button-download-chart"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download Chart'}
        </Button>
      </div>

      <div 
        ref={chartRef}
        className="flex items-center justify-center p-16 min-h-full"
        data-testid="chart-container"
      >
        <div className="flex flex-col items-center">
          {tree.map(root => renderTree(root))}
        </div>
      </div>
    </div>
  );
}