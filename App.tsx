
import React, { useEffect } from 'react';
import { Graph } from './components/Graph';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { NodeDetails } from './components/NodeDetails';
import { AiGraphExpander } from './components/AiGraphExpander';
import { DocumentImporter } from './components/DocumentImporter';
import { StatisticsPanel } from './components/StatisticsPanel';
import { DevPanel } from './components/DevTools/DevPanel'; // New Import
import { useGraphStore } from './store';
import { Search, BarChart3, Terminal, Layout } from 'lucide-react';
import { GRAPH_DATA } from './data';

function App() {
  const { 
    searchQuery, 
    setSearchQuery, 
    setNodes, 
    setEdges, 
    nodes, 
    toggleStats, 
    isDevMode, 
    toggleDevMode 
  } = useGraphStore();

  // Load initial data
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes(GRAPH_DATA.nodes);
      setEdges(GRAPH_DATA.edges);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F5F5DC] text-[#1A1A1A] overflow-hidden">
      
      {/* Statistics Modal Overlay */}
      <StatisticsPanel />

      {/* Header - Art Deco Style */}
      <header className="h-16 bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] border-b-4 border-[#D4AF37] flex items-center px-6 justify-between shadow-lg relative z-20">
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-10 h-10 bg-[#F5F5DC] rounded-full border-2 border-[#D4AF37] flex items-center justify-center shadow-inner">
            <span className="text-xl font-serif font-bold text-[#1E3A5F]">E</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#F5F5DC] tracking-widest drop-shadow-md">ENDECJA</h1>
            <p className="text-[9px] text-[#D4AF37] tracking-[0.2em] uppercase font-semibold flex items-center gap-2">
              {isDevMode ? <span className="text-green-400 animate-pulse">● DEV MODE</span> : "System Agentowy • Gemini 3 Pro"}
            </p>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3 z-10">
           {/* Search Bar */}
           <div className="relative w-64 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-[#D4AF37]" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-1.5 border border-[#D4AF37] rounded-md leading-5 bg-[#1E3A5F]/50 text-[#F5F5DC] placeholder-gray-400 focus:outline-none focus:bg-[#1E3A5F] focus:border-white sm:text-xs transition-colors"
              placeholder="Szukaj w bazie wiedzy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dev Mode Toggle */}
          <div className="flex items-center bg-[#152a45] rounded-lg p-0.5 border border-[#D4AF37]/30">
             <button 
               onClick={() => isDevMode && toggleDevMode()}
               className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${!isDevMode ? 'bg-[#F5F5DC] text-[#1E3A5F] shadow' : 'text-gray-400 hover:text-white'}`}
             >
               <Layout size={10} /> USER
             </button>
             <button 
               onClick={() => !isDevMode && toggleDevMode()}
               className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${isDevMode ? 'bg-[#2E7D32] text-white shadow' : 'text-gray-400 hover:text-white'}`}
             >
               <Terminal size={10} /> DEV
             </button>
          </div>

          {/* Stats Button */}
          <button 
            onClick={toggleStats}
            className="flex items-center gap-2 bg-[#D4AF37] text-[#1E3A5F] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#C5A028] transition-colors shadow-sm border border-[#B4941F]"
            title="Pokaż statystyki grafu"
          >
            <BarChart3 size={16} />
            <span className="hidden sm:inline">Statystyki</span>
          </button>
        </div>

      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Sidebar (Myths, Timeline, Documents) */}
        {/* Only show sidebar in User Mode or if screen is wide enough in Dev Mode */}
        <div className={`flex flex-col w-80 border-r-4 border-[#1E3A5F] bg-white z-10 shadow-xl h-full transition-all duration-300 ${isDevMode ? '-ml-80 opacity-50 pointer-events-none hidden' : ''}`}>
           <DocumentImporter isDev={false} />
           <div className="flex-1 overflow-hidden relative">
             <Sidebar />
           </div>
        </div>

        {/* Center: Graph Visualization */}
        <main className="flex-1 relative bg-[#FBFBF8] flex flex-col">
          <div className="flex-1 relative">
            <Graph />
            <NodeDetails />
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-20">
               <h1 className="text-6xl font-serif font-black text-[#E8DCC0] select-none">1893-1939</h1>
            </div>
          </div>
          
          {/* Bottom Panel: AI Tools (User Mode Only) */}
          {!isDevMode && (
            <div className="h-auto z-20">
               <AiGraphExpander isDev={false} />
            </div>
          )}
        </main>

        {/* Right Panel: Chat (User Mode) OR DevPanel (Dev Mode) */}
        <div className={`transition-all duration-300 z-30 shadow-2xl border-l-4 border-[#1E3A5F] flex flex-col ${isDevMode ? 'w-[450px]' : 'w-[380px]'}`}>
          {isDevMode ? (
            <DevPanel />
          ) : (
            <div className="h-full bg-[#F0EAD6]">
              <ChatInterface />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
