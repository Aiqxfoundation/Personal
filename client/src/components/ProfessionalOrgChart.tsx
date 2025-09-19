import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { OrgNode as OrgNodeType } from "@shared/schema";

interface ProfessionalOrgChartProps {
  nodes: OrgNodeType[];
}

export default function ProfessionalOrgChart({ nodes }: ProfessionalOrgChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadChart = async () => {
    if (!chartRef.current) return;
    
    setIsDownloading(true);
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 4,
        useCORS: true,
        allowTaint: false,
        width: chartRef.current.scrollWidth,
        height: chartRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: chartRef.current.scrollWidth,
        windowHeight: chartRef.current.scrollHeight,
        logging: false
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

  // Create a lookup for easy node access
  const nodeMap = new Map<string, OrgNodeType>();
  nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });

  // Find nodes by ID
  const getNode = (id: string) => nodeMap.get(id);

  // Organizational Box Component
  const OrgBox = ({ node, isCEO = false }: { node: OrgNodeType; isCEO?: boolean }) => (
    <div
      className={`relative z-10 flex flex-col justify-center items-center text-center rounded-lg border-2 ${
        isCEO 
          ? 'bg-blue-500 text-white border-blue-600 font-semibold' 
          : 'bg-white text-gray-700 border-gray-300'
      }`}
      style={{
        width: '180px',
        height: '60px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '8px',
        fontSize: '12px',
        lineHeight: '1.2'
      }}
    >
      <div className={`font-semibold ${isCEO ? 'text-white' : 'text-blue-600'} mb-1`}>
        {node.title}
      </div>
      <div className={`${isCEO ? 'text-white' : 'text-gray-800'} text-xs`}>
        {node.name}
      </div>
    </div>
  );

  // Connector Line Component
  const Line = ({ width, height, top, left, horizontal = false }: {
    width?: number;
    height?: number;
    top: number;
    left: number;
    horizontal?: boolean;
  }) => (
    <div
      className="absolute bg-blue-400 z-0"
      style={{
        width: horizontal ? `${width}px` : '2px',
        height: horizontal ? '2px' : `${height}px`,
        top: `${top}px`,
        left: `${left}px`
      }}
    />
  );

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
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download Chart'}
        </Button>
      </div>

      <div 
        ref={chartRef}
        className="flex items-center justify-center p-16 min-h-full"
      >
        <div className="relative" style={{ width: '1200px', height: '800px' }}>
          
          {/* CEO - Level 1 */}
          <div className="absolute" style={{ top: '50px', left: '510px' }}>
            <OrgBox node={getNode('1')!} isCEO={true} />
          </div>

          {/* CEO to Level 2 connector */}
          <Line top={110} left={600} height={40} />

          {/* Level 2 - HRO and Pathologist */}
          <div className="absolute" style={{ top: '170px', left: '240px' }}>
            <OrgBox node={getNode('2')!} />
          </div>
          <div className="absolute" style={{ top: '170px', left: '780px' }}>
            <OrgBox node={getNode('3')!} />
          </div>

          {/* Level 2 horizontal connector */}
          <Line top={150} left={330} width={540} horizontal={true} />
          <Line top={150} left={330} height={20} />
          <Line top={150} left={870} height={20} />

          {/* Level 2 to Level 3 connectors */}
          <Line top={230} left={330} height={40} />
          <Line top={230} left={870} height={40} />

          {/* Level 3 - Lab Manager, Account Manager, Lab Technologist */}
          <div className="absolute" style={{ top: '290px', left: '60px' }}>
            <OrgBox node={getNode('4')!} />
          </div>
          <div className="absolute" style={{ top: '290px', left: '420px' }}>
            <OrgBox node={getNode('5')!} />
          </div>
          <div className="absolute" style={{ top: '290px', left: '960px' }}>
            <OrgBox node={getNode('6')!} />
          </div>

          {/* Level 3 horizontal connectors */}
          <Line top={270} left={150} width={360} horizontal={true} />
          <Line top={270} left={150} height={20} />
          <Line top={270} left={510} height={20} />

          <Line top={270} left={1050} height={20} />

          {/* Level 3 to Level 4 connectors */}
          {/* <Line top={350} left={150} height={40} /> */} {/* Lab Manager connector - disconnected */}
          {/* <Line top={350} left={510} height={40} /> */} {/* Account Manager connector - disconnected */}
          <Line top={350} left={1050} height={40} />

          {/* Level 4 - Bottom level positions */}
          <div className="absolute" style={{ top: '410px', left: '60px' }}>
            <OrgBox node={getNode('7')!} />
          </div>
          <div className="absolute" style={{ top: '410px', left: '240px' }}>
            <OrgBox node={getNode('8')!} />
          </div>
          <div className="absolute" style={{ top: '410px', left: '420px' }}>
            <OrgBox node={getNode('9')!} />
          </div>
          <div className="absolute" style={{ top: '410px', left: '780px' }}>
            <OrgBox node={getNode('10')!} />
          </div>
          <div className="absolute" style={{ top: '410px', left: '960px' }}>
            <OrgBox node={getNode('11')!} />
          </div>

          {/* Level 4 horizontal connectors */}
          {/* <Line top={390} left={150} width={180} horizontal={true} /> */} {/* Lab Manager subordinates - disconnected */}
          {/* <Line top={390} left={150} height={20} /> */}
          {/* <Line top={390} left={330} height={20} /> */}

          {/* <Line top={390} left={870} width={180} horizontal={true} /> */} {/* Account Manager subordinates - disconnected */}
          {/* <Line top={390} left={870} height={20} /> */}
          {/* <Line top={390} left={1050} height={20} /> */}

        </div>
      </div>
    </div>
  );
}