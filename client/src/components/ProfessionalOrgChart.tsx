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
        scale: 6,
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
        width: '200px',
        height: '80px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
        padding: '12px',
        fontSize: '16px',
        lineHeight: '1.3'
      }}
    >
      <div className={`font-semibold ${isCEO ? 'text-white' : 'text-blue-600'} mb-1`}>
        {node.title}
      </div>
      <div className={`${isCEO ? 'text-white' : 'text-gray-800'} text-sm`}>
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
          <div className="relative mx-auto" style={{ width: '1300px', height: '750px' }}>
          
          {/* CEO - Level 1 */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '50px' }}>
            <OrgBox node={getNode('1')!} isCEO={true} />
          </div>

          {/* CEO to Level 2 connector */}
          <Line top={110} left={500} height={40} />

          {/* Level 2 - HRO and Pathologist */}
          <div className="absolute" style={{ top: '170px', left: '200px' }}>
            <OrgBox node={getNode('2')!} />
          </div>
          <div className="absolute" style={{ top: '170px', left: '650px' }}>
            <OrgBox node={getNode('3')!} />
          </div>

          {/* Level 2 horizontal connector */}
          <Line top={150} left={290} width={450} horizontal={true} />
          <Line top={150} left={290} height={20} />
          <Line top={150} left={740} height={20} />

          {/* Level 2 to Level 3 connectors */}
          <Line top={230} left={290} height={40} />
          <Line top={230} left={740} height={60} /> {/* Extended line to connect Pathologist to Lab Technologist */}

          {/* Level 3 - Lab Manager, Account Manager, Lab Technologist */}
          <div className="absolute" style={{ top: '290px', left: '60px' }}>
            <OrgBox node={getNode('4')!} />
          </div>
          <div className="absolute" style={{ top: '290px', left: '320px' }}>
            <OrgBox node={getNode('5')!} />
          </div>
          <div className="absolute" style={{ top: '290px', left: '650px' }}>
            <OrgBox node={getNode('6')!} />
          </div>

          {/* Level 3 horizontal connectors */}
          <Line top={270} left={150} width={260} horizontal={true} />
          <Line top={270} left={150} height={20} />
          <Line top={270} left={410} height={20} />

          <Line top={270} left={740} height={20} /> {/* Lab Technologist connector - restored */}

          {/* Level 3 to Level 4 connectors - CLEAR ALL OLD LINES */}
          {/* Moon Anwar (Lab Technologist) to subordinates connector */}
          <Line top={350} left={740} height={110} /> {/* Vertical line down from Moon Anwar to new horizontal line */}

          {/* Level 4 - Bottom level positions - All 5 subordinates under Moon Anwar */}
          <div className="absolute left-1/2 -translate-x-1/2" 
               style={{ top: '480px', display: 'grid', gridTemplateColumns: 'repeat(5, 200px)', columnGap: '50px' }}>
            <OrgBox node={getNode('7')!} /> {/* Mudasir - Senior Technician */}
            <OrgBox node={getNode('8')!} /> {/* Muhammad Adeel - Jr Lab Technician */}
            <OrgBox node={getNode('9')!} /> {/* Saba Noor - Lab Assistant */}
            <OrgBox node={getNode('10')!} /> {/* Sahar Nasir - Lab Technologist */}
            <OrgBox node={getNode('11')!} /> {/* Danish Gill & Bisma - Phlebotomist */}
          </div>

          {/* FIXED CONNECTIONS: Moon Anwar to all 5 subordinates - Recalculated for larger boxes */}
          {/* Horizontal line connecting all 5 subordinates - updated width and positioning */}
          <Line top={460} left={150} width={1000} horizontal={true} />
          
          {/* Vertical lines from horizontal line to each subordinate - aligned to new box centers */}
          <Line top={460} left={150} height={20} />   {/* To Mudasir */}
          <Line top={460} left={400} height={20} />  {/* To Muhammad Adeel */}
          <Line top={460} left={650} height={20} />  {/* To Saba Noor */}
          <Line top={460} left={900} height={20} />  {/* To Sahar Nasir - FIXED ALIGNMENT */}
          <Line top={460} left={1150} height={20} />  {/* To Danish Gill & Bisma */}

        </div>
      </div>
      </div>
    </div>
  );
}