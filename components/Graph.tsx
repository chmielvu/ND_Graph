
import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { useGraphStore } from '../store';
import { GRAPH_DATA } from '../data';
import { NodeData } from '../types';


export const Graph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const { setSelectedNode, addVisitedNode, searchQuery, nodes, edges, selectedNode } = useGraphStore();
  const [isMounted, setIsMounted] = useState(false);

  // Initialize Cytoscape instance once
  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [], // Will be populated by the next useEffect
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 6,
            'background-color': (ele: any) => {
              const type = ele.data('type');
              switch (type) {
                case 'person': return '#DC143C'; // Crimson
                case 'organization': return '#2E7D32'; // Green
                case 'event': return '#1E3A5F'; // Navy
                case 'publication': return '#D4AF37'; // Gold
                case 'concept': return '#9C27B0'; // Purple
                default: return '#616161';
              }
            },
            'color': '#1E3A5F',
            'font-size': '10px',
            'font-family': 'Inter, sans-serif',
            'width': 30,
            'height': 30,
            'border-width': 2,
            'border-color': '#F5F5DC', // Beige border
            'text-background-color': '#F5F5DC',
            'text-background-opacity': 0.7,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#D4AF37', // Gold border for selected
            'width': 40,
            'height': 40,
            'font-size': '12px',
            'font-weight': 'bold'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#A0A0A0',
            'target-arrow-color': '#A0A0A0',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8
          }
        },
        {
          selector: '.highlighted-search', // For search results
          style: {
            'background-color': '#FFD700', // Yellow for search
            'border-color': '#FFA500',
            'border-width': 3
          }
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.2,
            'text-opacity': 0.2
          }
        },
        {
          selector: '.in-same-community', // NEW: Community highlighting
          style: {
            'border-width': 3,
            'border-style': 'solid',
            'border-color': '#2E7D32', // Darker green for community
            'shadow-blur': 10,
            'shadow-color': '#2E7D32',
            'shadow-opacity': 0.5,
            'z-index': 10 // Bring community members to front
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: false,
        nodeRepulsion: 4500,
        idealEdgeLength: 100,
        edgeElasticity: 0.45,
        nestingFactor: 0.1,
        gravity: 0.25,
        numIter: 2500,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
        randomize: false // Keep consistent layout on updates
      } as any
    });

    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      const data = node.data();
      setSelectedNode(data);
      addVisitedNode(data.id);
    });

    cyRef.current.on('tap', (evt) => {
      if (evt.target === cyRef.current) {
        setSelectedNode(null);
      }
    });

    setIsMounted(true);

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []); // Run once on mount

  // Update Cytoscape elements when store nodes/edges change
  useEffect(() => {
    if (!cyRef.current || !isMounted) return;

    const cy = cyRef.current;

    // Remove elements that are no longer in the store
    cy.remove(cy.nodes().filter((node) => !nodes.some(n => n.id === node.id())));
    cy.remove(cy.edges().filter((edge) => !edges.some(e => e.source === edge.data('source') && e.target === edge.data('target'))));

    // Add new nodes and update existing ones
    nodes.forEach((node: NodeData) => {
      const existingNode = cy.getElementById(node.id);
      if (existingNode.empty()) {
        cy.add({ data: node });
      } else {
        // Update data, especially for community and centrality
        existingNode.data(node);
      }
    });

    // Add new edges
    edges.forEach(edge => {
      const existingEdge = cy.edges(`[source = "${edge.source}"][target = "${edge.target}"]`);
      if (existingEdge.empty()) {
        cy.add({ data: edge });
      } else {
        existingEdge.data(edge);
      }
    });

    // Run layout again to reposition new nodes or adjust to data changes
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 800,
      fit: true, // Fit to new graph extent
      nodeRepulsion: 4500,
      idealEdgeLength: 100,
      edgeElasticity: 0.45,
      nestingFactor: 0.1,
      gravity: 0.25,
      numIter: 2500,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      randomize: false // Keep consistent layout on updates
    } as any).run();

  }, [nodes, edges, isMounted]);

  // Handle Node Selection and Community Highlighting
  useEffect(() => {
    if (!cyRef.current || !isMounted) return;
    const cy = cyRef.current;

    // Clear all existing highlighting classes first
    cy.elements().removeClass('selected highlighted-search dimmed in-same-community');

    if (selectedNode) {
      const clickedNode = cy.getElementById(selectedNode.id);
      
      // 1. Highlight the selected node
      clickedNode.addClass('selected');

      // 2. Identify and highlight nodes in the same community
      let communityMembers = cy.collection();
      if (selectedNode.community !== undefined && selectedNode.community !== null) {
         communityMembers = cy.nodes().filter(n => 
           n.data('community') === selectedNode.community && n.id() !== selectedNode.id
         );
         communityMembers.addClass('in-same-community');
      }

      // 3. Identify direct neighborhood (excluding the selected node itself)
      const neighborhood = clickedNode.neighborhood('node');

      // 4. Combine all active elements for dimming calculation
      const allActive = clickedNode.add(neighborhood).add(communityMembers);
      
      // 5. Dim everything that is not active
      cy.elements().not(allActive).addClass('dimmed');
      
      // Fit to selected node + community members + direct neighbors if present
      const elementsToFit = clickedNode.add(communityMembers).add(neighborhood);
      if (elementsToFit.length > 0) {
        cy.fit(elementsToFit, 50); // Add padding
      }

    } else {
      // If no node is selected, ensure nothing is dimmed or specially highlighted
      cy.elements().removeClass('dimmed in-same-community selected');
      // If a search query is active, re-apply search highlighting
      if (searchQuery) {
        const results = cy.nodes().filter((node) => {
          const label = node.data('label');
          return label && label.toLowerCase().includes(searchQuery.toLowerCase());
        });
        if (results.length > 0) {
          cy.elements().not(results).addClass('dimmed');
          results.addClass('highlighted-search');
        }
      }
    }
  }, [selectedNode, searchQuery, isMounted, nodes]); // Re-run when nodes update (for community data)


  // Search Highlight
  useEffect(() => {
    if (!cyRef.current || !isMounted || selectedNode) return; // Don't run if a node is explicitly selected

    const cy = cyRef.current;
    
    // Clear previous search/dimming
    cy.elements().removeClass('highlighted-search dimmed');

    if (searchQuery) {
      const results = cy.nodes().filter((node) => {
        const label = node.data('label');
        return label && label.toLowerCase().includes(searchQuery.toLowerCase());
      });

      if (results.length > 0) {
        cy.elements().not(results).addClass('dimmed');
        results.addClass('highlighted-search');
        cy.fit(results, 50);
      } else {
        cy.elements().removeClass('dimmed'); // Clear dimming if no results
      }
    } else {
      cy.elements().removeClass('dimmed highlighted-search'); // Clear all if search is empty
    }
  }, [searchQuery, isMounted, selectedNode]); // Added selectedNode to dependencies to avoid conflicts

  return <div ref={containerRef} className="w-full h-full bg-[#FBFBF8]" />;
};
