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
        scale: 8,
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

  // Organizational Box Component - BIGGER BOXES AND FONTS
  const OrgBox = ({ node, isCEO = false }: { node: OrgNodeType; isCEO?: boolean }) => (
    <div
      className={`relative z-10 flex flex-col justify-center items-center text-center rounded-lg border-2 ${
        isCEO 
          ? 'bg-blue-500 text-white border-blue-600 font-semibold' 
          : 'bg-white text-gray-700 border-gray-300'
      }`}
      style={{
        width: '250px',
        height: '100px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        padding: '16px',
        fontSize: '20px',
        lineHeight: '1.4'
      }}
    >
      <div className={`font-semibold ${isCEO ? 'text-white' : 'text-blue-600'} mb-1`}>
        {node.title}
      </div>
      <div className={`${isCEO ? 'text-white' : 'text-gray-800'} text-base font-medium`}>
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

      <div className="flex items-center justify-center p-16 min-h-full">
        <div 
          ref={chartRef}
          className="inline-block bg-white p-24 rounded-xl"
        >
          <div className="relative mx-auto" style={{ width: '1800px', height: '1000px' }}>
          
          {/* CEO - Level 1 */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '50px' }}>
            <OrgBox node={getNode('1')!} isCEO={true} />
          </div>

          {/* CEO to Level 2 connector - FIXED ALIGNMENT */}
          <Line top={150} left={650} height={50} />

          {/* Level 2 - HRO and Pathologist */}
          <div className="absolute" style={{ top: '220px', left: '300px' }}>
            <OrgBox node={getNode('2')!} />
          </div>
          <div className="absolute" style={{ top: '220px', left: '900px' }}>
            <OrgBox node={getNode('3')!} />
          </div>

          {/* Level 2 horizontal connector */}
          <Line top={200} left={425} width={575} horizontal={true} />
          <Line top={200} left={425} height={20} />
          <Line top={200} left={1025} height={20} />

          {/* Level 2 to Level 3 connectors */}
          <Line top={320} left={425} height={60} />
          <Line top={320} left={1025} height={80} />

          {/* Level 3 - Lab Manager, Account Manager, Lab Technologist */}
          <div className="absolute" style={{ top: '400px', left: '150px' }}>
            <OrgBox node={getNode('4')!} />
          </div>
          <div className="absolute" style={{ top: '400px', left: '500px' }}>
            <OrgBox node={getNode('5')!} />
          </div>
          <div className="absolute" style={{ top: '400px', left: '900px' }}>
            <OrgBox node={getNode('6')!} />
          </div>

          {/* Level 3 horizontal connectors */}
          <Line top={380} left={275} width={350} horizontal={true} />
          <Line top={380} left={275} height={20} />
          <Line top={380} left={625} height={20} />

          <Line top={380} left={1025} height={20} />

          {/* Moon Anwar to subordinates connector */}
          <Line top={500} left={1025} height={180} />

          {/* Level 4 - All 5 subordinates under Moon Anwar */}
          <div className="absolute left-1/2 -translate-x-1/2" 
               style={{ top: '680px', display: 'grid', gridTemplateColumns: 'repeat(5, 250px)', columnGap: '75px' }}>
            <OrgBox node={getNode('7')!} />
            <OrgBox node={getNode('8')!} />
            <OrgBox node={getNode('9')!} />
            <OrgBox node={getNode('10')!} />
            <OrgBox node={getNode('11')!} />
          </div>

          {/* PERFECT CONNECTIONS: Moon Anwar to all 5 subordinates */}
          <Line top={680} left={275} width={1300} horizontal={true} />
          <Line top={680} left={275} height={20} />
          <Line top={680} left={587} height={20} />
          <Line top={680} left={900} height={20} />
          <Line top={680} left={1212} height={20} />
          <Line top={680} left={1525} height={20} />

        </div>
      </div>
      </div>
    </div>
  );
}