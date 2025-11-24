
import { create } from 'zustand';
import { NodeData, EdgeData, GraphAnalysisResult, GlobalAnalysisResult } from './types';

interface GraphStore {
  nodes: NodeData[];
  edges: EdgeData[];
  selectedNode: NodeData | null;
  visitedNodes: string[];
  expandedMyth: string | null;
  searchQuery: string;
  analysisResult: { result: GraphAnalysisResult | null; commentary: string | null } | null;
  isStatsOpen: boolean;
  isDevMode: boolean; // NEW: Dev mode toggle
  
  setNodes: (nodes: NodeData[]) => void;
  setEdges: (edges: EdgeData[]) => void;
  addNode: (node: NodeData) => void;
  addEdges: (newEdges: EdgeData[]) => void;
  setSelectedNode: (node: NodeData | null) => void;
  addVisitedNode: (id: string) => void;
  setExpandedMyth: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setAnalysisResult: (result: GraphAnalysisResult | null, commentary: string | null) => void;
  toggleStats: () => void;
  toggleDevMode: () => void; // NEW
  
  // Graph Mutations
  applyGlobalAnalysis: (data: GlobalAnalysisResult) => void;
  updateGraphFromRaw: (nodes: NodeData[], edges: EdgeData[]) => void; // NEW
  
  // Helpers
  getNodesMap: () => Map<string, NodeData>;
  getAllNodes: () => NodeData[];
  getAllEdges: () => EdgeData[];
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  visitedNodes: [],
  expandedMyth: null,
  searchQuery: '',
  analysisResult: null,
  isStatsOpen: false,
  isDevMode: false, // Default to User Mode

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) => set((state) => {
    if (state.nodes.some(n => n.id === node.id)) return state;
    return { nodes: [...state.nodes, node] };
  }),

  addEdges: (newEdges) => set((state) => ({
    edges: [...state.edges, ...newEdges.filter(ne => 
      !state.edges.some(e => e.source === ne.source && e.target === ne.target && e.relationship === ne.relationship)
    )]
  })),

  setSelectedNode: (node) => set({ selectedNode: node }),
  
  addVisitedNode: (id) => set((state) => ({ 
    visitedNodes: [...new Set([...state.visitedNodes, id])] 
  })),
  
  setExpandedMyth: (id) => set({ expandedMyth: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setAnalysisResult: (result, commentary) => set({ analysisResult: { result, commentary } }),
  toggleStats: () => set((state) => ({ isStatsOpen: !state.isStatsOpen })),
  toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })), // NEW

  applyGlobalAnalysis: (data) => set((state) => {
    const updatedNodes = state.nodes.map(node => ({
      ...node,
      community: data.communities[node.id],
      centrality: data.centrality[node.id]
    }));
    
    const updatedSelected = state.selectedNode 
      ? updatedNodes.find(n => n.id === state.selectedNode!.id) || null 
      : null;

    return { 
      nodes: updatedNodes,
      selectedNode: updatedSelected
    };
  }),

  updateGraphFromRaw: (newNodes, newEdges) => set({ // NEW
    nodes: newNodes,
    edges: newEdges,
    selectedNode: null // Reset selection to avoid stale state
  }),

  getNodesMap: () => new Map(get().nodes.map(n => [n.id, n])),
  getAllNodes: () => get().nodes,
  getAllEdges: () => get().edges,
}));
