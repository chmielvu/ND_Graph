
import React, { useState } from 'react';
import { useGraphStore } from '../store';
import { analyzeGraphWithNetworkX, suggestGraphExpansion, runGlobalGraphAnalysis } from '../services/geminiService';
import { BrainCircuit, Network, PlusCircle, Loader2, Globe, Terminal } from 'lucide-react';
import { NodeData } from '../types'; // Import NodeData for explicit typing

interface Props {
  isDev?: boolean;
}

export const AiGraphExpander: React.FC<Props> = ({ isDev = false }) => {
  const { selectedNode, getAllNodes, getAllEdges, addNode, addEdges, applyGlobalAnalysis, setAnalysisResult } = useGraphStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null); // For single node analysis
  const [expansionProposals, setExpansionProposals] = useState<any>(null); // For smart expansion proposals
  const [globalStats, setGlobalStats] = useState<any>(null); // For global analysis results

  // Single Node Analysis
  const handleAnalyze = async () => {
    if (!selectedNode) return;
    setIsAnalyzing(true);
    setAnalysisData(null); // Clear previous single node analysis
    setExpansionProposals(null); // Clear expansion
    
    const graphData = { nodes: getAllNodes(), edges: getAllEdges() };
    const result = await analyzeGraphWithNetworkX(graphData, selectedNode.id);
    
    if (result.error) {
      alert("Błąd analizy węzła: " + result.error);
      console.error(result.raw);
    } else {
      setAnalysisData(result);
      // Optionally update the selected node in the store with new analysis data
      // This would require a new action in the store or updating selectedNode directly
      // For now, just display in the panel
    }
    setIsAnalyzing(false);
  };

  // Smart Expansion
  const handleExpand = async () => {
    if (!selectedNode) return;
    setIsAnalyzing(true);
    setExpansionProposals(null); // Clear previous expansion
    setAnalysisData(null); // Clear single node analysis

    const existingIds = getAllNodes().map(n => n.id);
    const result = await suggestGraphExpansion(selectedNode.id, selectedNode.label, selectedNode.description, existingIds, { nodes: getAllNodes(), edges: getAllEdges() });
    
    if (result && !result.error) {
      setExpansionProposals(result);
    } else {
      alert("Błąd generowania propozycji ekspansji: " + (result?.error || "Nieznany błąd"));
    }
    setIsAnalyzing(false);
  };

  // Global Analysis (Restructuring)
  const handleGlobalAnalysis = async () => {
    setIsAnalyzing(true);
    setGlobalStats(null); // Clear previous global stats
    setAnalysisData(null); // Clear single node analysis
    setExpansionProposals(null); // Clear expansion

    const graphData = { nodes: getAllNodes(), edges: getAllEdges() };
    const result = await runGlobalGraphAnalysis(graphData);

    if (!result.error) {
        setGlobalStats(result);
        applyGlobalAnalysis(result); // Update store with new community IDs and centrality
    } else {
        alert("Błąd analizy globalnej: " + result.error);
    }

    setIsAnalyzing(false);
  };

  const acceptExpansion = () => {
    if (expansionProposals) {
      if (expansionProposals.new_nodes) expansionProposals.new_nodes.forEach((n: NodeData) => addNode(n));
      if (expansionProposals.new_edges) addEdges(expansionProposals.new_edges);
      setExpansionProposals(null);
      alert("Propozycje ekspansji zostały dodane do grafu.");
    }
  };

  // Styles based on mode
  const baseClass = isDev ? "text-gray-200" : "text-[#1E3A5F]";
  const buttonClass = isDev 
    ? "flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 border border-gray-600"
    : "flex-1 bg-[#1E3A5F] text-white py-2 px-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#2A4A6F] transition-colors flex items-center justify-center gap-2 disabled:opacity-50";
  
  const actionButtonClass = isDev
    ? "flex-1 bg-blue-700 hover:bg-blue-600 text-white py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 border border-blue-800"
    : "flex-1 bg-[#DC143C] text-white py-2 px-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#B01030] transition-colors flex items-center justify-center gap-2 disabled:opacity-50";

  const containerClass = isDev 
    ? "bg-transparent" 
    : "p-4 bg-white border-t-4 border-[#1E3A5F] shadow-inner";

  if (!isDev && !selectedNode) {
    return (
      <div className="p-4 bg-gray-50 border-t-2 border-[#1E3A5F] text-center text-sm text-gray-500 font-serif">
        Wybierz węzeł, aby uruchomić analizę AI.
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {!isDev && (
        <h3 className="text-lg font-serif font-bold text-[#1E3A5F] mb-3 flex items-center gap-2">
          <BrainCircuit size={20} className="text-[#DC143C]" />
          Centrum Analiz Strategicznych
        </h3>
      )}
      
      <div className="flex flex-col gap-2 mb-4">
        {/* Global Analysis Button */}
        <button 
            onClick={handleGlobalAnalysis}
            disabled={isAnalyzing}
            className={`${isDev ? 'bg-green-800 hover:bg-green-700 border-green-900' : 'bg-[#2E7D32] hover:bg-[#1B5E20]'} w-full text-white py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50`}
        >
            {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <Globe size={14} />}
            Run Global NetworkX Analysis
        </button>

        {/* Node Actions Row */}
        <div className="flex gap-2">
            <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedNode}
            className={buttonClass}
            title="Analyze selected node"
            >
            {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <Network size={14} />}
            {isDev ? "Node Metrics" : "Analiza Węzła"}
            </button>
            <button 
            onClick={handleExpand}
            disabled={isAnalyzing || !selectedNode}
            className={actionButtonClass}
            title="Expand graph around selection"
            >
            {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <PlusCircle size={14} />}
            {isDev ? "Expand Graph" : "Ekspansja"}
            </button>
        </div>
      </div>

      {/* Global Stats Output */}
      {globalStats && (
          <div className={`p-3 rounded border text-sm mb-4 ${isDev ? 'bg-[#111] border-green-900 text-green-400 font-mono' : 'bg-[#F1F8E9] border-[#2E7D32]'}`}>
             <div className="flex items-center gap-2 mb-2">
                 <Terminal size={14} />
                 <span className="font-bold">ANALYSIS_COMPLETE</span>
             </div>
             <div className="grid grid-cols-2 gap-4 mb-2">
                 <div>Modularity: {globalStats.stats.modularity?.toFixed(4)}</div>
                 <div>Communities: {globalStats.stats.total_communities}</div>
             </div>
             {!isDev && <p className="italic text-gray-800 text-xs">"{globalStats.summary}"</p>}
             {isDev && <p className="text-xs opacity-70">Graph updated with community IDs.</p>}
          </div>
      )}

      {/* Single Analysis Results */}
      {analysisData && (
        <div className={`p-3 rounded border text-sm mb-4 ${isDev ? 'bg-[#111] border-blue-900 text-blue-300 font-mono' : 'bg-[#F5F5DC] border-[#D4AF37]'}`}>
          <h4 className="font-bold mb-2">Node Analysis:</h4>
          {analysisData.error ? (
            <p className="text-red-500">{analysisData.error}</p>
          ) : (
            <>
              <div className="mb-2 text-xs overflow-x-auto">
                {analysisData.analysis?.centrality_metrics && (
                   <ul className="space-y-1">
                     <li>Betweenness: {analysisData.analysis.centrality_metrics.betweenness_centrality?.toFixed(5)}</li>
                     <li>PageRank: {analysisData.analysis.centrality_metrics.pagerank?.toFixed(5)}</li>
                     {/* No longer displaying total_degree here from single node analysis */}
                   </ul>
                )}
              </div>
              {!isDev && (
                  <p className="italic text-gray-800 leading-relaxed border-l-2 border-[#DC143C] pl-2 mt-2">
                    "{analysisData.commentary}"
                  </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Expansion Proposals */}
      {expansionProposals && (
        <div className={`p-3 rounded border text-sm ${isDev ? 'bg-[#111] border-red-900 text-gray-300' : 'bg-[#E8F5E9] border-[#2E7D32]'}`}>
          <h4 className="font-bold mb-2">Expansion Proposals:</h4>
          {!isDev && <p className="mb-2 text-gray-700 italic">{expansionProposals.historical_reasoning}</p>}
          
          <div className="space-y-1 mb-3 font-mono text-xs">
            {expansionProposals.new_nodes?.map((n: any) => (
              <div key={n.id} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DC143C]"></span>
                <span>{n.label}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={acceptExpansion}
            className={`w-full py-1 rounded text-xs font-bold ${isDev ? 'bg-red-800 hover:bg-red-700 text-white' : 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'}`}
          >
            {isDev ? 'COMMIT CHANGES' : 'Zatwierdź i Dodaj'}
          </button>
        </div>
      )}
    </div>
  );
};
