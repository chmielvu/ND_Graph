
import React, { useMemo } from 'react';
import { useGraphStore } from '../store';
import { X, PieChart as PieIcon, Activity, Share2, Database } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';

export const StatisticsPanel: React.FC = () => {
  const { nodes, edges, isStatsOpen, toggleStats } = useGraphStore();

  // --- Calculations ---
  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    nodes.forEach(node => {
      const type = node.type || 'unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    
    // Translation map
    const plLabels: Record<string, string> = {
      person: 'Osoby',
      organization: 'Organizacje',
      event: 'Wydarzenia',
      publication: 'Publikacje',
      concept: 'Koncepcje'
    };

    return Object.entries(counts).map(([name, value]) => ({
      name: plLabels[name] || name,
      value
    })).sort((a, b) => b.value - a.value);
  }, [nodes]);

  const mostConnectedNodes = useMemo(() => {
    const connections: Record<string, number> = {};
    // Calculate degree from current nodes and edges in store
    nodes.forEach(node => {
        connections[node.id] = 0; // Initialize all nodes with 0 connections
    });
    edges.forEach(edge => {
      connections[edge.source] = (connections[edge.source] || 0) + 1;
      connections[edge.target] = (connections[edge.target] || 0) + 1;
    });

    const sorted = Object.entries(connections)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7); // Top 7

    return sorted.map(([id, count]) => {
      const node = nodes.find(n => n.id === id);
      return {
        name: node ? (node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label) : id,
        fullLabel: node?.label || id,
        connections: count
      };
    });
  }, [nodes, edges]);

  const graphDensity = useMemo(() => {
    if (nodes.length <= 1) return 0;
    // Density for directed graph = E / (N * (N-1))
    const maxEdges = nodes.length * (nodes.length - 1);
    // Handle potential division by zero if maxEdges is 0 (e.g., N=1)
    return maxEdges > 0 ? (edges.length / maxEdges).toFixed(4) : 0;
  }, [nodes, edges]);

  // --- Colors for Charts ---
  const COLORS = ['#DC143C', '#1E3A5F', '#D4AF37', '#2E7D32', '#9C27B0', '#FF8042'];

  if (!isStatsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FBFBF8] w-full max-w-5xl max-h-[90vh] rounded-lg shadow-2xl border-4 border-[#1E3A5F] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1E3A5F] p-4 flex justify-between items-center border-b-4 border-[#D4AF37]">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#F5F5DC] rounded-full border border-[#D4AF37]">
               <Activity size={24} className="text-[#1E3A5F]" />
             </div>
             <div>
               <h2 className="text-2xl font-serif font-bold text-[#F5F5DC] tracking-wider">Raport Statystyczny</h2>
               <p className="text-[#D4AF37] text-xs uppercase tracking-widest font-semibold">Analiza Struktury Bazy Wiedzy</p>
             </div>
          </div>
          <button 
            onClick={toggleStats}
            className="text-[#F5F5DC] hover:text-[#DC143C] transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F5F5DC]">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded shadow-md border-l-4 border-[#1E3A5F] flex items-center gap-4">
               <div className="p-3 bg-blue-50 rounded-full text-[#1E3A5F]">
                 <Database size={24} />
               </div>
               <div>
                 <p className="text-sm text-gray-500 uppercase font-semibold">Węzły (Nodes)</p>
                 <p className="text-3xl font-bold text-[#1E3A5F] font-serif">{nodes.length}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded shadow-md border-l-4 border-[#DC143C] flex items-center gap-4">
               <div className="p-3 bg-red-50 rounded-full text-[#DC143C]">
                 <Share2 size={24} />
               </div>
               <div>
                 <p className="text-sm text-gray-500 uppercase font-semibold">Relacje (Edges)</p>
                 <p className="text-3xl font-bold text-[#DC143C] font-serif">{edges.length}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded shadow-md border-l-4 border-[#D4AF37] flex items-center gap-4">
               <div className="p-3 bg-yellow-50 rounded-full text-[#D4AF37]">
                 <Activity size={24} />
               </div>
               <div>
                 <p className="text-sm text-gray-500 uppercase font-semibold">Gęstość Grafu</p>
                 <p className="text-3xl font-bold text-[#D4AF37] font-serif">{graphDensity}</p>
               </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96 mb-6">
            
            {/* Bar Chart - Most Connected */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <h3 className="text-lg font-bold text-[#1E3A5F] mb-4 font-serif border-b-2 border-[#E8DCC0] pb-2">
                🏛️ Najważniejsze Encje (Top Connected)
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mostConnectedNodes}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 11}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FBFBF8', borderColor: '#1E3A5F', borderRadius: '4px' }}
                      cursor={{fill: 'transparent'}}
                      formatter={(value: number, name: string, props: any) => [`${value} połączeń`, props.payload.fullLabel]}
                    />
                    <Bar dataKey="connections" fill="#1E3A5F" radius={[0, 4, 4, 0]} barSize={20} name="Połączenia" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart - Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <h3 className="text-lg font-bold text-[#1E3A5F] mb-4 font-serif border-b-2 border-[#E8DCC0] pb-2">
                📊 Rozkład Typów Węzłów
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FBFBF8', borderColor: '#D4AF37' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 italic">
            Dane generowane na żywo z aktualnego stanu grafu wiedzy.
          </div>

        </div>
      </div>
    </div>
  );
};
