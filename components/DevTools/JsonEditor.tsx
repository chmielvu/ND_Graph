
import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store';
import { Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { NodeData, EdgeData } from '../../types'; // Import types

export const JsonEditor: React.FC = () => {
  const { nodes, edges, updateGraphFromRaw } = useGraphStore();
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = { nodes, edges };
    setJsonContent(JSON.stringify(data, null, 2));
  }, [nodes, edges]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.nodes || !Array.isArray(parsed.nodes)) throw new Error("Missing 'nodes' array");
      if (!parsed.edges || !Array.isArray(parsed.edges)) throw new Error("Missing 'edges' array");
      
      // Basic validation for node/edge structure
      parsed.nodes.forEach((node: NodeData) => {
        if (!node.id || !node.label || !node.type) throw new Error(`Invalid node: ${JSON.stringify(node)}`);
      });
      parsed.edges.forEach((edge: EdgeData) => {
        if (!edge.source || !edge.target || !edge.relationship) throw new Error(`Invalid edge: ${JSON.stringify(edge)}`);
      });


      updateGraphFromRaw(parsed.nodes, parsed.edges);
      setError(null);
      alert("Graph data updated successfully!");
    } catch (e: any) {
      setError(`Invalid JSON or data structure: ${e.message}`);
    }
  };

  const handleReset = () => {
    const data = { nodes, edges };
    setJsonContent(JSON.stringify(data, null, 2));
    setError(null);
  };

  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex justify-between items-center mb-2 px-2">
        <span className="text-xs text-gray-500 font-mono">graph_data.json</span>
        <div className="flex gap-2">
          <button 
            onClick={handleReset}
            className="p-1 hover:bg-gray-700 rounded text-gray-400"
            title="Reset to current state"
          >
            <RotateCcw size={14} />
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded font-bold"
          >
            <Save size={14} /> Apply
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/50 text-red-200 p-2 mb-2 rounded text-xs flex items-center gap-2">
          <AlertTriangle size={12} />
          {error}
        </div>
      )}

      <textarea
        value={jsonContent}
        onChange={(e) => setJsonContent(e.target.value)}
        className="flex-1 w-full bg-[#111] text-green-500 font-mono text-xs p-3 border border-gray-700 rounded focus:outline-none focus:border-green-700 resize-none leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
};
