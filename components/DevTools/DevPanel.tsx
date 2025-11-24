
import React, { useState } from 'react';
import { AiGraphExpander } from '../AiGraphExpander';
import { DocumentImporter } from '../DocumentImporter';
import { JsonEditor } from './JsonEditor';
import { Database, FileText, BrainCircuit } from 'lucide-react'; // Removed X icon as it's not used in this component

export const DevPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'import' | 'data'>('ai');

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] text-gray-300 border-l border-gray-700 shadow-2xl">
      {/* Dev Header */}
      <div className="bg-[#2D2D2D] p-4 flex items-center justify-between border-b border-gray-700">
        <h2 className="font-mono font-bold text-green-400 flex items-center gap-2">
          <span className="animate-pulse">●</span> DEV_MODE :: SYSTEM
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'ai' ? 'bg-[#1E3A5F] text-white' : 'hover:bg-[#333]'
          }`}
        >
          <BrainCircuit size={14} />
          AI Agents
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'import' ? 'bg-[#1E3A5F] text-white' : 'hover:bg-[#333]'
          }`}
        >
          <FileText size={14} />
          Ingest
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'data' ? 'bg-[#1E3A5F] text-white' : 'hover:bg-[#333]'
          }`}
        >
          <Database size={14} />
          Raw Data
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#1E1E1E]">
        {activeTab === 'ai' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#252526] p-4 rounded border border-gray-700">
              <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase">Graph Intelligence</h3>
              <AiGraphExpander isDev={true} />
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="p-4">
            <DocumentImporter isDev={true} />
          </div>
        )}

        {activeTab === 'data' && (
          <div className="h-full flex flex-col">
             <JsonEditor />
          </div>
        )}
      </div>
    </div>
  );
};
