
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";
import { CircuitBoard, Cpu, Database, Globe, HardDrive, Layers, Monitor, Server, Zap } from 'lucide-react';

function App() {
  const [animationFrames, setAnimationFrames] = useState<number[]>([]);

  useEffect(() => {
    // Generate random animation delays for decorative elements
    const frames = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10));
    setAnimationFrames(frames);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-terminal-black text-terminal-green font-vt323 relative overflow-hidden">
        {/* Left side decorative elements */}
        <div className="fixed left-0 top-0 bottom-0 w-16 md:w-32 z-0 flex flex-col items-center justify-between py-10 overflow-hidden">
          <div className="h-full w-px bg-gradient-to-b from-terminal-purple/0 via-terminal-purple to-terminal-purple/0"></div>
          
          {animationFrames.slice(0, 10).map((delay, i) => (
            <div 
              key={`left-${i}`} 
              className="absolute" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${i * 10}%`,
                animationDelay: `${delay * 0.5}s`
              }}
            >
              {i % 5 === 0 && <CircuitBoard size={16} className="text-terminal-purple/30 animate-pulse-slow" />}
              {i % 5 === 1 && <Database size={16} className="text-terminal-purple/30 animate-pulse-slow" />}
              {i % 5 === 2 && <Server size={16} className="text-terminal-green/30 animate-pulse-slow" />}
              {i % 5 === 3 && <Cpu size={16} className="text-terminal-purple/30 animate-pulse-slow" />}
              {i % 5 === 4 && <HardDrive size={16} className="text-terminal-green/30 animate-pulse-slow" />}
            </div>
          ))}
        </div>
        
        {/* Right side decorative elements */}
        <div className="fixed right-0 top-0 bottom-0 w-16 md:w-32 z-0 flex flex-col items-center justify-between py-10 overflow-hidden">
          <div className="h-full w-px bg-gradient-to-b from-terminal-purple/0 via-terminal-purple to-terminal-purple/0"></div>
          
          {animationFrames.slice(10).map((delay, i) => (
            <div 
              key={`right-${i}`} 
              className="absolute" 
              style={{
                right: `${Math.random() * 100}%`,
                top: `${i * 10}%`,
                animationDelay: `${delay * 0.5}s`
              }}
            >
              {i % 5 === 0 && <Zap size={16} className="text-terminal-cyan/30 animate-pulse-slow" />}
              {i % 5 === 1 && <Globe size={16} className="text-terminal-purple/30 animate-pulse-slow" />}
              {i % 5 === 2 && <Monitor size={16} className="text-terminal-green/30 animate-pulse-slow" />}
              {i % 5 === 3 && <Layers size={16} className="text-terminal-purple/30 animate-pulse-slow" />}
              {i % 5 === 4 && <CircuitBoard size={16} className="text-terminal-cyan/30 animate-pulse-slow" />}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        {/* Background grid overlay */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#9b87f510_1px,transparent_1px),linear-gradient(to_bottom,#9b87f510_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
        
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
