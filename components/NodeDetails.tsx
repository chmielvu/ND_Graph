
import React from 'react';
import { X, Calendar, Book, Users, Network, Sigma } from 'lucide-react'; // Added Network and Sigma icons
import { useGraphStore } from '../store';
import { NodeData } from '../types';

export const NodeDetails: React.FC = () => {
  const { selectedNode, setSelectedNode, nodes } = useGraphStore();

  if (!selectedNode) return null;

  // Find other community members if analysis has been run
  const communityMembers = selectedNode.community !== undefined && selectedNode.community !== null
    ? nodes
        .filter(n => n.community === selectedNode.community && n.id !== selectedNode.id)
        .sort((a, b) => (b.centrality || 0) - (a.centrality || 0)) // Sort by importance
        .slice(0, 5) // Show top 5
    : [];

  return (
    <div className="absolute top-6 right-6 w-80 bg-[#FBFBF8] border-4 border-[#1E3A5F] shadow-2xl z-20 animate-in fade-in slide-in-from-right-4 duration-300 max-h-[85vh] flex flex-col">
      {/* Decorative corners */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[#D4AF37]" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-[#D4AF37]" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-[#D4AF37]" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[#D4AF37]" />

      <div className="bg-[#1E3A5F] p-3 flex justify-between items-start shrink-0">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
            {selectedNode.type}
          </span>
          <h2 className="text-xl text-white font-serif font-bold leading-tight mt-1">
            {selectedNode.label}
          </h2>
        </div>
        <button 
          onClick={() => setSelectedNode(null)}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
        
        {selectedNode.dates && (
          <div className="flex items-center gap-2 text-sm font-mono text-[#DC143C] mb-4 bg-red-50 p-2 rounded border border-red-100">
            <Calendar size={14} />
            <span>{selectedNode.dates}</span>
          </div>
        )}

        {/* Global Analysis Data Display */}
        {(selectedNode.community !== undefined && selectedNode.community !== null) || selectedNode.centrality !== undefined ? (
           <div className="mb-4 bg-green-50 p-3 rounded border border-green-200">
             <h4 className="text-xs font-bold text-green-800 uppercase mb-2 flex items-center gap-1">
               <Network size={12} /> Analiza Strukturalna
             </h4>
             <div className="text-xs text-gray-700 space-y-1">
               {(selectedNode.community !== undefined && selectedNode.community !== null) && (
                 <p>Społeczność (Cluster ID): <span className="font-mono font-bold">{selectedNode.community}</span></p>
               )}
               {selectedNode.centrality !== undefined && (
                 <p>Centralność (Betweenness): <span className="font-mono">{selectedNode.centrality.toFixed(4)}</span></p>
               )}
             </div>
             
             {communityMembers.length > 0 && (
               <div className="mt-2 pt-2 border-t border-green-200">
                 <p className="text-[10px] font-semibold text-green-700 mb-1">Inni kluczowi w tej grupie ({selectedNode.community}):</p>
                 <ul className="text-xs text-gray-600 list-disc list-inside">
                   {communityMembers.map(m => (
                     <li key={m.id} className="truncate cursor-pointer hover:text-[#DC143C] transition-colors" onClick={() => setSelectedNode(m)}>
                       {m.label}
                     </li>
                   ))}
                 </ul>
               </div>
             )}
           </div>
        ) : (
          // Placeholder or message if no analysis data
          <div className="mb-4 bg-yellow-50 p-3 rounded border border-yellow-200 text-xs text-yellow-800">
            <p className="flex items-center gap-1"><Sigma size={12} /> Brak danych analizy strukturalnej.</p>
            <p className="mt-1">Uruchom globalną analizę w trybie deweloperskim.</p>
          </div>
        )}

        <div className="prose prose-sm text-[#1A1A1A] mb-4 font-serif leading-relaxed">
          {selectedNode.description}
        </div>

        {selectedNode.roles && (
          <div className="mb-4">
             <h4 className="text-xs font-bold text-[#1E3A5F] uppercase mb-2 flex items-center gap-1">
               <Users size={12} /> Role
             </h4>
             <div className="flex flex-wrap gap-1">
               {selectedNode.roles.map((role: string) => (
                 <span key={role} className="text-xs bg-[#E8DCC0] text-[#5A4A2A] px-2 py-1 rounded-full">
                   {role}
                 </span>
               ))}
             </div>
          </div>
        )}

        {selectedNode.sources && selectedNode.sources.length > 0 && (
          <div className="border-t-2 border-[#E8DCC0] pt-3 mt-2">
            <h4 className="text-xs font-bold text-[#1E3A5F] uppercase mb-2 flex items-center gap-1">
              <Book size={12} /> Źródła Historyczne
            </h4>
            <ul className="space-y-2">
              {selectedNode.sources.map((src: any, idx: number) => (
                <li key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 italic">
                  {src.author ? <span className="font-semibold">{src.author}, </span> : ''}
                  "{src.title}"
                  {src.year ? ` (${src.year})` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
