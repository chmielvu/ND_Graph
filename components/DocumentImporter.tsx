
import React, { useState } from 'react';
import { DOCUMENTS } from '../data/documents';
import { ingestDocument } from '../services/geminiService';
import { useGraphStore } from '../store';
import { FileText, Loader2, CheckCircle, UploadCloud } from 'lucide-react';

interface Props {
  isDev?: boolean;
}

export const DocumentImporter: React.FC<Props> = ({ isDev = false }) => {
  const { getAllNodes, addNode, addEdges } = useGraphStore();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  // Custom file upload state is now managed directly in the input, no need for customFile state

  // Handle Preset Documents
  const handleIngestPreset = async (doc: typeof DOCUMENTS[0]) => {
    setProcessingId(doc.id);
    setResults(null);
    
    try {
      const existingIds = getAllNodes().map(n => n.id);
      const result = await ingestDocument(doc.content, doc.title, existingIds);
      setResults(result);
    } catch (error) {
      alert("Error processing document");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Real File Upload (Text/MD)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingId('custom_upload');
    setResults(null);

    try {
      const text = await file.text();
      const existingIds = getAllNodes().map(n => n.id);
      const result = await ingestDocument(text, file.name, existingIds);
      setResults(result);
    } catch (error) {
      alert("Error reading or analyzing file.");
      console.error(error);
    } finally {
      setProcessingId(null);
      // Reset input
      e.target.value = '';
    }
  };

  const acceptIngestion = () => {
    if (results && results.proposals) {
      results.proposals.forEach((p: any) => {
        addNode(p.newNode);
        if (p.newEdges) addEdges(p.newEdges);
      });
      setResults(null);
      alert("Dane z dokumentu zostały dodane do grafu.");
    }
  };

  const theme = isDev ? {
    bg: 'bg-[#252526]',
    text: 'text-gray-300',
    border: 'border-gray-700',
    hover: 'hover:bg-[#333]',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-500'
  } : {
    bg: 'bg-white',
    text: 'text-gray-700',
    border: 'border-[#D4AF37]',
    hover: 'hover:bg-gray-100',
    accent: 'bg-[#1E3A5F]',
    accentHover: 'hover:bg-[#2A4A6F]'
  };

  return (
    <div className={`p-4 ${theme.bg} ${!isDev ? 'border-b-4' : ''} ${theme.border}`}>
      <h3 className={`text-lg font-serif font-bold mb-3 flex items-center gap-2 ${isDev ? 'text-gray-200' : 'text-[#1E3A5F]'}`}>
        <FileText size={20} />
        {isDev ? 'Document Ingestion Agent' : 'Archiwium Źródłowe'}
      </h3>
      
      {/* Real File Upload Area */}
      <div className={`mb-4 border-2 border-dashed rounded-lg p-4 text-center ${isDev ? 'border-gray-600 bg-[#1E1E1E]' : 'border-gray-300 bg-gray-50'}`}>
        <label className="cursor-pointer flex flex-col items-center justify-center">
          <UploadCloud size={24} className={isDev ? 'text-gray-400' : 'text-gray-500'} />
          <span className={`text-xs mt-2 font-semibold ${isDev ? 'text-gray-400' : 'text-gray-600'}`}>
            {processingId === 'custom_upload' ? 'Analyzing...' : 'Upload .txt or .md'}
          </span>
          <input 
            type="file" 
            accept=".txt,.md" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={processingId !== null}
          />
        </label>
      </div>

      {/* Preset Documents List */}
      <div className="space-y-2 mb-4">
        {DOCUMENTS.map(doc => (
          <div key={doc.id} className={`flex items-center justify-between p-2 rounded border ${theme.border} ${theme.hover}`}>
            <span className={`text-xs font-medium truncate max-w-[150px] ${theme.text}`} title={doc.title}>
              {doc.title}
            </span>
            <button 
              onClick={() => handleIngestPreset(doc)}
              disabled={processingId !== null}
              className={`text-xs text-white px-2 py-1 rounded disabled:opacity-50 ${isDev ? 'bg-green-700 hover:bg-green-600' : 'bg-[#D4AF37] hover:bg-[#B4941F]'}`}
            >
              {processingId === doc.id ? <Loader2 className="animate-spin" size={12}/> : (isDev ? "Ingest" : "Analizuj")}
            </button>
          </div>
        ))}
      </div>

      {/* Results Preview */}
      {results && (
        <div className={`p-3 rounded border text-xs animate-in slide-in-from-top-2 ${isDev ? 'bg-[#333] border-gray-600 text-gray-300' : 'bg-[#FFF8E1] border-[#FFC107] text-gray-700'}`}>
          <h4 className="font-bold mb-1">Analysis Result:</h4>
          <p className="mb-2 opacity-90">{results.document_summary}</p>
          <div className="flex items-center gap-1 mb-2 font-semibold text-green-600">
             <CheckCircle size={12} />
             Found {results.proposals?.length || 0} entities
          </div>
          <button 
            onClick={acceptIngestion}
            className={`w-full text-white py-1 rounded font-bold ${theme.accent} ${theme.accentHover}`}
          >
            Add to Graph
          </button>
        </div>
      )}
    </div>
  );
};
