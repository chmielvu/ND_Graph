

export interface NodeData {
  id: string;
  label: string;
  type: 'person' | 'organization' | 'event' | 'publication' | 'concept';
  dates?: string;
  birth_date?: string;
  death_date?: string;
  description: string;
  roles?: string[];
  importance?: number;
  centrality?: number; // Betweenness or Degree (from NetworkX)
  community?: number; // Community ID from NetworkX
  sources?: Array<{ title: string; author?: string; year?: number; archive?: string }>;
  [key: string]: any;
}

export interface EdgeData {
  source: string;
  target: string;
  relationship: string;
  dates?: string;
  description?: string;
}

export interface Myth {
  id: string;
  title: string;
  claim: string;
  truth: string;
  sources: string[];
  severity: 'niskie' | 'średnia' | 'wysoka' | 'krytyczna';
  relatedNodes: string[];
  category: string;
}

export interface TimelineEvent {
  year: number;
  label: string;
  nodeId: string;
  description: string;
}

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
  myths: Myth[];
  timeline: TimelineEvent[];
  metadata: any;
}

// Single Node Analysis
export interface GraphAnalysisResult {
  node_info?: any;
  degree_analysis?: {
    in_degree: number;
    out_degree: number;
    total_degree: number;
  };
  centrality_metrics?: {
    betweenness_centrality: number;
    pagerank: number;
    in_degree_centrality: number;
    out_degree_centrality: number;
  };
  neighbors?: {
    influences: string[];
    influenced_by: string[];
  };
  community?: {
    id: number | null;
    members: string[];
  };
  graph_stats?: any;
  // Allow for an error field if the Python script returns an error object directly
  error?: string; 
}

// Global Graph Analysis (NEW)
export interface GlobalAnalysisResult {
  communities: Record<string, number>; // nodeId -> communityId
  centrality: Record<string, number>; // nodeId -> score
  stats: {
    modularity?: number;
    total_communities: number;
    density?: number;
  };
  summary: string; // AI commentary
  error?: string;
}

export interface ExpansionProposal {
  new_nodes: NodeData[];
  new_edges: EdgeData[];
  historical_reasoning: string;
}