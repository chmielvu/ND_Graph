import React from 'react';
import { AlertCircle, ChevronRight, Calendar } from 'lucide-react';
import { useGraphStore } from '../store';
import { GRAPH_DATA } from '../data';

export const Sidebar: React.FC = () => {
  const { expandedMyth, setExpandedMyth, visitedNodes, addVisitedNode } = useGraphStore();

  return (
    <aside className="w-96 bg-white border-r-4 border-[#1E3A5F] overflow-y-auto flex flex-col shadow-xl z-10">
      
      {/* Myths Section */}
      <div className="p-4 border-b-4 border-[#D4AF37] bg-[#F9F9F0]">
        <div className="flex items-center gap-2 mb-4 text-[#DC143C]">
          <AlertCircle size={24} />
          <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-[#1E3A5F]">Mity Sowieckie</h2>
        </div>
        
        <div className="space-y-3">
          {GRAPH_DATA.myths.map((myth) => (
            <div key={myth.id} className="group">
              <div 
                onClick={() => setExpandedMyth(expandedMyth === myth.id ? null : myth.id)}
                className={`
                  p-3 cursor-pointer border-l-4 transition-all duration-300 shadow-sm hover:shadow-md bg-white
                  ${myth.severity === 'krytyczna' ? 'border-[#DC143C]' : 
                    myth.severity === 'wysoka' ? 'border-[#B01030]' : 'border-[#D4AF37]'}
                `}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-[#1E3A5F] font-serif group-hover:text-[#DC143C] transition-colors">
                    {myth.title}
                  </h3>
                  <ChevronRight size={16} className={`text-[#D4AF37] transform transition-transform ${expandedMyth === myth.id ? 'rotate-90' : ''}`} />
                </div>
                <p className="text-xs text-red-800 mt-1 line-through decoration-red-500/50">{myth.claim}</p>
              </div>

              {expandedMyth === myth.id && (
                <div className="bg-[#F5F5DC] p-4 border-l-4 border-[#2E7D32] mt-1 text-sm animate-in slide-in-from-top-2 duration-200">
                  <p className="font-bold text-[#2E7D32] mb-2 flex items-center gap-1">
                    <span>✓</span> Rzeczywistość:
                  </p>
                  <p className="text-gray-800 mb-3 leading-relaxed font-serif">{myth.truth}</p>
                  
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <p className="text-xs font-bold text-[#1E3A5F] mb-1">Źródła:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      {myth.sources.map((src, idx) => <li key={idx} className="italic">{src}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Preview Section */}
      <div className="p-4 bg-white flex-1">
        <div className="flex items-center gap-2 mb-4 text-[#1E3A5F]">
          <Calendar size={20} />
          <h2 className="text-lg font-serif font-bold uppercase tracking-wider">Kalendarium</h2>
        </div>
        <div className="relative pl-4 border-l-2 border-[#D4AF37] space-y-6">
          {GRAPH_DATA.timeline.slice(0, 5).map((event, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 bg-[#1E3A5F] border-2 border-[#F5F5DC] rounded-full"></div>
              <span className="text-xs font-bold text-[#DC143C] font-mono">{event.year}</span>
              <p className="text-sm font-bold text-[#1E3A5F] leading-tight">{event.label}</p>
              <p className="text-xs text-gray-500 mt-1">{event.description}</p>
            </div>
          ))}
           <div className="text-center pt-2">
             <span className="text-xs text-gray-400 italic">...i więcej w grafie</span>
           </div>
        </div>
      </div>
    </aside>
  );
};