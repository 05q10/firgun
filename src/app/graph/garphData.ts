// Define TypeScript interfaces for our graph data
interface Node {
    id: string;
    label: string;
    name: string;
    color?: string;
    x?: number;
    y?: number;
  }
  
  interface Link {
    source: string;
    target: string;
    type: string;
  }
  
  interface GraphData {
    nodes: Node[];
    links: Link[];
  }
  
  // Neo4j database data (mocked for demo)
  export const graphData: GraphData = {
    nodes: [
      { id: '1', label: 'Character', name: 'Harry Potter' },
      { id: '2', label: 'Location', name: 'Hogwarts' },
      { id: '3', label: 'Object', name: 'Wand' },
      { id: '4', label: 'Character', name: 'Voldemort' },
      { id: '5', label: 'Location', name: 'Forbidden Forest' }
    ],
    links: [
      { source: '1', target: '2', type: 'Attends' },
      { source: '1', target: '3', type: 'Owns' },
      { source: '4', target: '3', type: 'Seeks' },
      { source: '4', target: '5', type: 'HidesIn' }
    ]
  };