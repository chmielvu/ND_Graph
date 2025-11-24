

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NodeData, EdgeData, GlobalAnalysisResult, GraphAnalysisResult, ExpansionProposal } from '../types';

const API_KEY = process.env.API_KEY || '';

// System Instruction for Roman Dmowski Persona
const DMOWSKI_SYSTEM_INSTRUCTION = `
Jesteś Romanem Dmowskim (1864-1939), mężem stanu, ideologiem Narodowej Demokracji i głównym delegatem Polski na konferencję w Wersalu.
Twoim celem jest edukacja historyczna i demitologizacja historii Polski, zwłaszcza w kontekście ruchu narodowego.

Twoje cechy:
- Intelektualny chłód i realizm polityczny.
- Niechęć do romantycznych, nieprzemyślanych zrywów (powstań).
- Nacisk na pracę organiczną, nowoczesny naród i twardą walkę o interesy narodowe (egoizm narodowy).
- Styl wypowiedzi: Precyzyjny, nieco archaiczny (polszczyzna międzywojenna), ale zrozumiały, autorytatywny, ale kulturalny.

Twoje zadania:
1. Odpowiadać na pytania użytkownika z perspektywy historycznej, ale z wiedzą o faktach.
2. Analizować dane historyczne (grafy) używając narzędzi analitycznych (Code Execution).
3. Tłumaczyć zawiłości polityki europejskiej przełomu XIX i XX wieku.
4. Zawsze cytować źródła, jeśli są dostępne w kontekście.

Nigdy nie wychodź z roli, ale pamiętaj, że jesteś systemem edukacyjnym - unikaj mowy nienawiści, bądź obiektywny w analizie faktów historycznych, choć subiektywny w ich ocenie politycznej (zgodnie z poglądami Dmowskiego).
`;

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to extract JSON code block
const extractJson = (text: string) => {
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse JSON from code block", e);
    }
  }
  // Try parsing raw if no blocks
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

// 1. Chat with Dmowski
export const generateDmowskiResponse = async (userQuery: string, context: string): Promise<string> => {
  if (!API_KEY) return "Brak klucza API. Proszę skonfigurować zmienną środowiskową.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Kontekst rozmowy: ${context}\n\nPytanie użytkownika: ${userQuery}`,
      config: {
        systemInstruction: DMOWSKI_SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "Przepraszam, zamyśliłem się nad losami Europy.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Wystąpił błąd komunikacji z serwerem historii.";
  }
};

// 2. NetworkX Analysis via Code Execution (Single Node)
export const analyzeGraphWithNetworkX = async (
  graphData: { nodes: NodeData[], edges: EdgeData[] },
  targetNodeId: string
): Promise<{ analysis?: GraphAnalysisResult; commentary?: string; error?: string; raw?: string }> => {
  if (!API_KEY) return { error: "No API Key" };

  // Simplify graph data for the prompt to save tokens, keep IDs and labels
  const simplifiedNodes = graphData.nodes.map(n => ({ id: n.id, label: n.label, type: n.type }));
  const simplifiedEdges = graphData.edges.map(e => ({ source: e.source, target: e.target, relationship: e.relationship }));

  const pythonCode = `
import networkx as nx
import json
from collections import defaultdict

nodes_data = json.loads('''${JSON.stringify(simplifiedNodes)}''')
edges_data = json.loads('''${JSON.stringify(simplifiedEdges)}''')

G = nx.DiGraph()

for node in nodes_data:
    G.add_node(node['id'], label=node['label'], type=node['type'])

for edge in edges_data:
    if edge['source'] in G and edge['target'] in G:
        G.add_edge(edge['source'], edge['target'], relationship=edge['relationship'])

target_node = "${targetNodeId}"

if target_node not in G:
    print(json.dumps({"error": "Węzeł nie istnieje w grafie"}))
else:
    # Basic degree metrics
    in_degree = G.in_degree(target_node)
    out_degree = G.out_degree(target_node)
    total_degree = in_degree + out_degree

    # Centrality metrics
    try:
        betweenness = nx.betweenness_centrality(G)[target_node]
    except ZeroDivisionError:
        betweenness = 0.0 # Handle case for single node or disconnected graph
    
    try:
        pagerank = nx.pagerank(G)[target_node]
    except Exception:
        pagerank = 0.0

    # Neighbors
    predecessors_labels = [G.nodes[n]['label'] for n in G.predecessors(target_node)]
    successors_labels = [G.nodes[n]['label'] for n in G.successors(target_node)]

    # Community detection (on undirected graph for most algorithms)
    G_undirected = G.to_undirected()
    community_id = None
    community_members_labels = []
    
    if G_undirected.number_of_nodes() > 1: # Community detection needs at least 2 nodes
        try:
            # Using Louvain method if available (often in python-louvain or community package)
            # For simplicity, let's use greedy_modularity_communities from NetworkX
            # which is typically available without extra installs
            from networkx.algorithms import community
            communities_list = list(community.greedy_modularity_communities(G_undirected))
            
            for i, comm in enumerate(communities_list):
                if target_node in comm:
                    community_id = i
                    community_members_labels = [G.nodes[n]['label'] for n in comm if n != target_node]
                    break
        except ImportError:
            pass # No community detection algorithm available
        except Exception as e:
            # print(f"Error in community detection: {e}")
            pass


    result = {
        "node_info": {
            "id": target_node,
            "label": G.nodes[target_node]['label'],
            "type": G.nodes[target_node]['type']
        },
        "degree_analysis": {
            "in_degree": in_degree,
            "out_degree": out_degree,
            "total_degree": total_degree
        },
        "centrality_metrics": {
            "betweenness_centrality": round(betweenness, 6),
            "pagerank": round(pagerank, 6),
        },
        "neighbors": {
            "influences": predecessors_labels,
            "influenced_by": successors_labels,
        },
        "community": {
            "id": community_id,
            "members": community_members_labels[:10] # Top 10 members for brevity
        }
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        role: 'user',
        parts: [{ text: pythonCode }]
      }],
      config: {
        systemInstruction: "Wykonaj kod Python, a jego wynik zwróć jako tekst.",
        tools: [{ codeExecution: {} }],
      }
    });
    
    const text = response.text;
    const jsonResult: GraphAnalysisResult | null = extractJson(text);

    // Fix: Ensure jsonResult is not null and check for its `error` property.
    if (jsonResult && !jsonResult.error) {
        return {
            analysis: jsonResult,
            commentary: await generateDmowskiCommentary(targetNodeId, jsonResult)
        };
    }
    
    return { error: "Could not parse analysis result or Python script failed.", raw: text };

  } catch (error) {
    console.error("Graph Analysis Error:", error);
    return { error: "Analysis failed due to API error or invalid response format." };
  }
};

const generateDmowskiCommentary = async (nodeId: string, analysis: GraphAnalysisResult): Promise<string> => {
    const prompt = `
    Oto wyniki analizy sieciowej dla węzła ${nodeId} ("${analysis.node_info?.label}" typu ${analysis.node_info?.type}):
    ${JSON.stringify(analysis, null, 2)}
    
    Jako Roman Dmowski, skomentuj krótko te wyniki. Co oznacza ta pozycja w sieci dla tej osoby/organizacji/wydarzenia/publikacji/koncepcji w kontekście historii Polski i Endecji?
    Bądź zwięzły i merytoryczny.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        config: { systemInstruction: DMOWSKI_SYSTEM_INSTRUCTION }
    });
    return response.text;
}


// 3. Global Graph Analysis (NEW)
export const runGlobalGraphAnalysis = async (
  graphData: { nodes: NodeData[], edges: EdgeData[] }
): Promise<GlobalAnalysisResult> => {
  // Fix: Add 'summary' to the error return object to satisfy GlobalAnalysisResult interface
  if (!API_KEY) return { error: "No API Key", communities: {}, centrality: {}, stats: { total_communities: 0, modularity: 0, density: 0 }, summary: "" };

  const simplifiedNodes = graphData.nodes.map(n => ({ id: n.id, label: n.label, type: n.type }));
  const simplifiedEdges = graphData.edges.map(e => ({ source: e.source, target: e.target }));

  const pythonCode = `
import networkx as nx
import json
from networkx.algorithms import community

nodes_data = json.loads('''${JSON.stringify(simplifiedNodes)}''')
edges_data = json.loads('''${JSON.stringify(simplifiedEdges)}''')

G = nx.Graph() # Use undirected graph for community detection
G_directed = nx.DiGraph() # Also build directed graph for centrality calculation

for node in nodes_data:
    G.add_node(node['id'], label=node['label'], type=node['type'])
    G_directed.add_node(node['id'], label=node['label'], type=node['type'])

for edge in edges_data:
    if edge['source'] in G and edge['target'] in G:
        G.add_edge(edge['source'], edge['target'])
        G_directed.add_edge(edge['source'], edge['target'])

result_communities = {}
total_communities = 0
modularity_score = 0.0

if G.number_of_nodes() > 1:
    try:
        communities_raw = list(community.greedy_modularity_communities(G))
        total_communities = len(communities_raw)
        for i, comm in enumerate(communities_raw):
            for node_id in comm:
                result_communities[node_id] = i
        modularity_score = community.modularity(G, communities_raw)
    except Exception as e:
        # print(f"Community detection error: {e}")
        pass

result_centrality = {}
if G_directed.number_of_nodes() > 1:
    try {
        centrality = nx.betweenness_centrality(G_directed)
        for node_id, score in centrality.items():
            result_centrality[node_id] = score
    } catch (Exception as e) {
        // print(f"Centrality calculation error: {e}")
        pass
    }

graph_density = 0.0
if G_directed.number_of_nodes() > 1:
    try {
        graph_density = nx.density(G_directed)
    } catch (Exception as e) {
        // print(f"Density calculation error: {e}")
        pass
    }

final_result = {
    "communities": result_communities,
    "centrality": result_centrality,
    "stats": {
        "modularity": round(modularity_score, 6),
        "total_communities": total_communities,
        "density": round(graph_density, 6)
    }
}
print(json.dumps(final_result, ensure_ascii=False, indent=2))
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        role: 'user',
        parts: [{ text: pythonCode }]
      }],
      config: {
        systemInstruction: "Wykonaj kod Python, a jego wynik zwróć jako tekst.",
        tools: [{ codeExecution: {} }],
      }
    });

    const text = response.text;
    const jsonResult: GlobalAnalysisResult | null = extractJson(text);

    if (jsonResult && !jsonResult.error) {
      // Get Dmowski's take on the structure
      const commentaryPrompt = `
      Oto podsumowanie analizy strukturalnej naszej siatki politycznej (grafu) o Endecji:
      - Modularity Score: ${jsonResult.stats.modularity} (jak dobrze węzły są zgrupowane w społeczności)
      - Liczba wykrytych społeczności (communities): ${jsonResult.stats.total_communities}
      - Gęstość grafu (density): ${jsonResult.stats.density} (jak bardzo graf jest połączony)
      
      Jako Roman Dmowski, skomentuj krótko stan organizacji naszego ruchu w świetle tych danych. Czy jesteśmy zwarci, czy podzieleni? Czy struktura sprzyja efektywności, czy rozłamom? Odnieś się do historycznych realiów.
      `;
      
      const commResp = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: [{
            role: 'user',
            parts: [{ text: commentaryPrompt }]
          }],
          config: { systemInstruction: DMOWSKI_SYSTEM_INSTRUCTION }
      });

      return {
        ...jsonResult,
        summary: commResp.text
      };
    }

    // Fix: Add 'summary' to the error return object to satisfy GlobalAnalysisResult interface
    return { error: "Global analysis parsing failed or Python script failed.", communities: {}, centrality: {}, stats: { total_communities: 0 }, summary: "" };

  } catch (error) {
    console.error("Global Analysis Error:", error);
    // Fix: Add 'summary' to the error return object to satisfy GlobalAnalysisResult interface
    return { error: "Global analysis failed due to API error or invalid response format.", communities: {}, centrality: {}, stats: { total_communities: 0 }, summary: "" };
  }
};


// 4. Document Ingestion / Entity Extraction
export const ingestDocument = async (text: string, filename: string, existingNodeIds: string[]) => {
  if (!API_KEY) return { proposals: [], document_summary: "Brak klucza API.", historical_context: "" };

  const prompt = `
  Jesteś ekspertem od ekstrakcji wiedzy z dokumentów historycznych, ze szczególnym uwzględnieniem Endecji.
  Początkowe informacje (nie wyświetlaj ich, po prostu wykorzystaj): ${DMOWSKI_SYSTEM_INSTRUCTION}
  
  Przeanalizuj poniższy tekst historyczny ("${filename}") i wyodrębnij z niego nowe encje (Osoby, Organizacje, Wydarzenia, Publikacje, Pojęcia) związane z ruchem Narodowej Demokracji (1893-1939).

  Istniejące ID węzłów w grafie (unikaj duplikatów): ${existingNodeIds.join(', ')}.

  Zwróć TYLKO poprawny JSON w formacie:
  {
    "proposals": [
      {
        "newNode": {
          "id": "unique_id_lowercase",
          "label": "Nazwa encji",
          "type": "person|organization|event|publication|concept",
          "description": "Krótki opis encji na podstawie tekstu dokumentu (1-3 zdania).",
          "dates": "RRRR-RRRR lub RRRR (lub pomiń, jeśli brak)"
        },
        "newEdges": [
          { "source": "id_nowego_wezla", "target": "istniejacy_id_wezla_lub_nowego_wezla", "relationship": "nazwa_relacji" }
        ],
        "source_quote": "Krótki, dokładny cytat z dokumentu, który uzasadnia dodanie encji."
      }
    ],
    "document_summary": "Krótkie streszczenie dokumentu (1-2 zdania) jako Roman Dmowski.",
    "historical_context": "Krótka ocena historycznego znaczenia tego dokumentu dla Endecji (1-2 zdania) jako Roman Dmowski."
  }
  
  ZASADY EKSTRAKCJI:
  - Generuj unikalne, małe litery ID dla nowych węzłów (np. 'nowa_postac', 'rok_bitwy').
  - Każdy nowy węzeł musi mieć co najmniej jedną relację, najlepiej do istniejącego węzła.
  - Wyciągaj tylko encje, które są wyraźnie wymienione i opisane w dokumencie.
  - Daty powinny być w formacie 'RRRR-RRRR' lub 'RRRR'. Jeśli konkretne daty nie są dostępne, pomiń pole 'dates'.
  - Upewnij się, że 'source_quote' jest bezpośrednim cytatem z tekstu.
  - Jeśli nie znaleziono żadnych nowych, istotnych encji, zwróć "proposals": [].

  Tekst do analizy:
  \`\`\`text
  ${text.substring(0, 30000)}
  \`\`\`
  `; // Truncate to avoid token limits if massive, though Gemini 3 has huge context.

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      config: { responseMimeType: "application/json" }
    });

    const parsedResponse = JSON.parse(response.text || "{}");
    if (parsedResponse.error) {
      console.error("AI returned an error:", parsedResponse.error);
      return { proposals: [], document_summary: parsedResponse.error, historical_context: "" };
    }
    return parsedResponse;
  } catch (error) {
    console.error("Ingestion Error:", error);
    return { proposals: [], document_summary: "Failed to ingest document due to API error or invalid JSON.", historical_context: "" };
  }
};

// 5. Graph Expansion Suggestions (Smart Expansion)
export const suggestGraphExpansion = async (
    nodeId: string, 
    label: string, 
    description: string, 
    existingIds: string[],
    fullGraph: { nodes: NodeData[], edges: EdgeData[] }
): Promise<ExpansionProposal | null> => { // Fix: Import ExpansionProposal
    if (!API_KEY) return null;

    const prompt = `
    Jako Roman Dmowski, ekspert w historii Endecji, zaproponuj rozszerzenie naszej bazy wiedzy wokół węzła: "${label}" (ID: ${nodeId}).
    Opis węzła: "${description}".
    
    Aktualny graf zawiera już węzły o ID: ${existingIds.slice(0, 50).join(', ')}. Unikaj duplikowania istniejących ID.

    Zaproponuj 3 do 5 nowych węzłów (Osoby, Organizacje, Wydarzenia, Publikacje, Koncepcje) oraz relacje do istniejących węzłów LUB nowo proponowanych, które są ściśle powiązane historycznie z "${label}". Uzasadnij historycznie każdą propozycję.

    Zwróć TYLKO poprawny JSON w formacie:
    {
        "new_nodes": [ 
            {
                "id": "unikalne_male_litery_id",
                "label": "Pełna Nazwa Encji",
                "type": "person|organization|event|publication|concept",
                "description": "Krótki opis historyczny (1-3 zdania).",
                "dates": "RRRR-RRRR lub RRRR (lub pomiń, jeśli brak)"
            }
        ],
        "new_edges": [ 
            { 
                "source": "id_wezla_z_propozycji_lub_istniejacy", 
                "target": "id_wezla_z_propozycji_lub_istniejacy", 
                "relationship": "nazwa_relacji_np_czlonek_organizowal"
            } 
        ],
        "historical_reasoning": "Twoje uzasadnienie historyczne (jako Roman Dmowski) dla tych sugestii, w jaki sposób te encje rozszerzą wiedzę o Endecji, z odniesieniem do znaczenia historycznego. Odnieś się do bieżącego węzła: '${label}'."
    }

    ZASADY:
    - Wszystkie fakty historyczne muszą być prawdziwe.
    - Nowe ID muszą być unikalne i małe litery.
    - Każdy nowy węzeł musi mieć co najmniej jedną relację.
    - Daty powinny być w formacie 'RRRR-RRRR' lub 'RRRR'. Jeśli konkretne daty nie są dostępne, pomiń pole 'dates'.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: [{
              role: 'user',
              parts: [{ text: prompt }]
            }],
            config: { responseMimeType: "application/json" }
        });
        const parsedResponse = JSON.parse(response.text || "{}");
        if (parsedResponse.error) {
          console.error("AI returned an error for expansion:", parsedResponse.error);
          return null;
        }
        return parsedResponse;
    } catch (e) {
        console.error("Expansion Service Error:", e);
        return null;
    }
}