'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'aframe';

// Force Graph has to be imported dynamically to avoid SSR issues
const ForceGraph2D = dynamic(
  () => import('react-force-graph').then(mod => mod.ForceGraph2D),
  { ssr: false }
);

// Define type-safe interfaces
interface GraphNode {
  id: string;
  label: string;
  name: string;
  color?: string;
  val?: number;
  bio?: string;
  recentActivity?: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  color?: string;
}

// Define color scheme for node types
const nodeColors: Record<string, string> = {
  Character: '#ff6b6b',
  Location: '#4ecdc4',
  Object: '#ffd166'
};

// Define relationship colors
const linkColors: Record<string, string> = {
  Attends: '#7f5af0',
  Owns: '#2cb67d',
  Seeks: '#ef4565',
  HidesIn: '#f9c74f',
  Visits: '#8338ec'
};

// Enhanced graph data with bio and recent activity
const graphData = {
  nodes: [
    { 
      id: '1', 
      label: 'Character', 
      name: 'Harry Potter',
      bio: 'The Boy Who Lived and the main protagonist of the series. Known for his lightning-shaped scar, bravery, and connection to Voldemort.',
      recentActivity: 'Recently defeated a boggart in Defense Against the Dark Arts class and practiced Patronus charm.'
    },
    { 
      id: '2', 
      label: 'Location', 
      name: 'Hogwarts',
      bio: 'School of Witchcraft and Wizardry founded by Godric Gryffindor, Helga Hufflepuff, Rowena Ravenclaw, and Salazar Slytherin.',
      recentActivity: 'Currently hosting the Triwizard Tournament with delegations from Beauxbatons and Durmstrang.'
    },
    { 
      id: '3', 
      label: 'Object', 
      name: 'Elder Wand',
      bio: 'One of the three Deathly Hallows, reputed to be the most powerful wand in existence.',
      recentActivity: 'Rumors suggest the wand has been sought after by dark wizards across Europe.'
    },
    { 
      id: '4', 
      label: 'Character', 
      name: 'Voldemort',
      bio: 'Born Tom Marvolo Riddle, he is the main antagonist of the wizard world, feared for his dark magic and quest for immortality.',
      recentActivity: 'Gathering followers and searching for ways to regain physical form after his defeat at Godric\'s Hollow.'
    },
    { 
      id: '5', 
      label: 'Location', 
      name: 'Forbidden Forest',
      bio: 'Ancient forest on the grounds of Hogwarts, home to many magical creatures and forbidden to students without supervision.',
      recentActivity: 'Centaurs have reported unusual activity in the deeper parts of the forest.'
    },
    { 
      id: '6', 
      label: 'Character', 
      name: 'Hermione Granger',
      bio: 'Exceptionally intelligent and talented Muggle-born witch, known for her vast knowledge, logical mind, and commitment to social justice.',
      recentActivity: 'Founded S.P.E.W. (Society for the Promotion of Elfish Welfare) and mastered complex Transfiguration spells ahead of her year.'
    },
    { 
      id: '7', 
      label: 'Character', 
      name: 'Ron Weasley',
      bio: 'Pure-blood wizard from the Weasley family, loyal friend of Harry Potter, and strategic thinker with a talent for wizard chess.',
      recentActivity: 'Serving as Gryffindor Keeper in Quidditch after overcoming performance anxiety issues.'
    },
    { 
      id: '8', 
      label: 'Object', 
      name: 'Invisibility Cloak',
      bio: 'One of the three Deathly Hallows, passed down through generations of the Potter family, it renders the wearer invisible.',
      recentActivity: 'Used by Harry to make unauthorized visits to Hogsmeade through the secret passage.'
    },
    { 
      id: '9', 
      label: 'Location', 
      name: 'Hogsmeade',
      bio: 'The only all-wizard village in Britain, located near Hogwarts School. Famous for shops like Honeydukes and The Three Broomsticks.',
      recentActivity: 'Preparing for the annual winter festival with enhanced security due to recent events.'
    },
    { 
      id: '10', 
      label: 'Object', 
      name: 'Marauders Map',
      bio: 'Magical document created by Messrs. Moony, Wormtail, Padfoot, and Prongs, showing Hogwarts and the location of everyone within it.',
      recentActivity: 'Recently revealed unexpected midnight wanderings of certain professors in the restricted areas of the castle.'
    }
  ],
  links: [
    { source: '1', target: '2', type: 'Attends' },
    { source: '1', target: '3', type: 'Seeks' },
    { source: '4', target: '3', type: 'Seeks' },
    { source: '4', target: '5', type: 'HidesIn' },
    { source: '6', target: '2', type: 'Attends' },
    { source: '7', target: '2', type: 'Attends' },
    { source: '1', target: '8', type: 'Owns' },
    { source: '1', target: '10', type: 'Owns' },
    { source: '6', target: '9', type: 'Visits' },
    { source: '7', target: '9', type: 'Visits' },
    { source: '1', target: '9', type: 'Visits' }
  ]
};

export default function GraphPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [hoveredLink, setHoveredLink] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [graphInitialized, setGraphInitialized] = useState<boolean>(false);
  const fgRef = useRef<any>(null);
  
  useEffect(() => {
    // Delay setting mounted to create loading animation
    const timer = setTimeout(() => {
      setMounted(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Process nodes and links with colors
  const enhancedGraphData = {
    nodes: graphData.nodes.map(node => ({
      ...node,
      color: nodeColors[node.label] || '#fffffe',
      val: node.label === 'Character' ? 20 : 15, // Size based on node type
      // Add fixed position for initial layout stability
      fx: graphInitialized ? undefined : Math.random() * 800 - 400,
      fy: graphInitialized ? undefined : Math.random() * 600 - 300
    })),
    links: graphData.links.map(link => ({
      ...link,
      color: linkColors[link.type] || '#94a1b2',
      curvature: 0.2 // Slightly curved links for better visibility
    }))
  };

  // Helper function to get node name from id or object
  const getNodeName = (id: any): string => {
    if (typeof id === 'object' && id !== null && id.name) {
      return id.name;
    }
    
    const foundNode = enhancedGraphData.nodes.find(n => n.id === id);
    return foundNode ? foundNode.name : 'Unknown';
  };

  // Handle node click - stop propagation to prevent graph deformation and set selected node
  const handleNodeClick = (node: any, event: any) => {
    if (fgRef.current) {
      // Prevent event from bubbling up
      event.preventDefault();
      event.stopPropagation();
      
      // Save current node positions
      const nodes = fgRef.current.graphData().nodes;
      
      // Center on node without animating physics
      const targetX = node.x;
      const targetY = node.y;
      
      // Gently center the view on node while maintaining graph stability
      fgRef.current.centerAt(targetX, targetY, 800);
    }
    
    setSelectedNode(node);
  };

  // Close detail panel
  const closeDetailPanel = () => {
    setSelectedNode(null);
  };

  // Handle graph initialization
  const handleEngineStop = () => {
    if (!graphInitialized && fgRef.current) {
      // Fit graph to view
      fgRef.current.zoomToFit(400);
      
      // After initial layout, remove fixed positions for natural interaction
      setTimeout(() => {
        if (fgRef.current) {
          const graphData = fgRef.current.graphData();
          const nodes = graphData.nodes.map((node: any) => ({
            ...node,
            fx: undefined,
            fy: undefined
          }));
          
          fgRef.current.graphData({
            nodes,
            links: graphData.links
          });
          
          // Mark graph as initialized
          setGraphInitialized(true);
          
          // Reheat the simulation slightly to settle nodes gently
          fgRef.current.d3Force('charge').strength(-100);
        }
      }, 2000);
    }
  };

  // Simple conditional rendering for loading state
  if (!mounted) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100%', 
        backgroundColor: '#0d1117', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            border: '6px solid rgba(127, 90, 240, 0.3)', 
            borderTopColor: '#7f5af0',
            animation: 'spin 1s ease-in-out infinite'
          }}></div>
        </div>
        <p>Loading Wizarding World Graph...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#0d1117', 
      color: 'white', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'rgba(10, 15, 20, 0.8)', 
        borderBottom: '1px solid #30363d',
        zIndex: 10
      }}>
        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 'bold', 
          margin: '0 0 15px 0', 
          color: '#fffffe', 
          textAlign: 'center' 
        }}>
          Wizarding World Graph Visualization
        </h1>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px', 
          fontSize: '0.9rem', 
          padding: '10px', 
          backgroundColor: 'rgba(13, 17, 23, 0.8)', 
          borderRadius: '8px' 
        }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#94a1b2' }}>Node Types:</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {Object.entries(nodeColors).map(([type, color]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '15px', 
                    height: '15px', 
                    borderRadius: '50%', 
                    backgroundColor: color 
                  }}></span>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#94a1b2' }}>Relationships:</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {Object.entries(linkColors).map(([type, color]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '15px', 
                    height: '15px', 
                    borderRadius: '50%', 
                    backgroundColor: color 
                  }}></span>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        border: '1px solid #30363d', 
        borderRadius: '0 0 8px 8px', 
        overflow: 'hidden', 
        boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.2)' 
      }}>
        {/* Hover Info Panel */}
        {!selectedNode && (hoveredNode || hoveredLink) && (
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '20px', 
            backgroundColor: 'rgba(10, 15, 20, 0.8)', 
            border: '1px solid #30363d', 
            borderRadius: '8px', 
            padding: '15px', 
            minWidth: '200px', 
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', 
            zIndex: 1000
          }}>
            {hoveredNode && (
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#fffffe' }}>
                  {hoveredNode.name}
                </h3>
                <p style={{ margin: '4px 0', color: '#94a1b2' }}>Type: {hoveredNode.label}</p>
                <p style={{ margin: '4px 0', color: '#94a1b2', fontSize: '0.8rem' }}>Click for details</p>
              </div>
            )}
            
            {hoveredLink && (
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#fffffe' }}>
                  {hoveredLink.type}
                </h3>
                <p style={{ margin: '4px 0', color: '#94a1b2' }}>
                  From: {getNodeName(hoveredLink.source)}
                </p>
                <p style={{ margin: '4px 0', color: '#94a1b2' }}>
                  To: {getNodeName(hoveredLink.target)}
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Detailed Node Info Panel */}
        {selectedNode && (
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            backgroundColor: 'rgba(10, 15, 20, 0.95)', 
            border: '1px solid #30363d', 
            borderRadius: '8px', 
            padding: '20px', 
            width: '350px',
            maxHeight: 'calc(100% - 40px)',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', 
            zIndex: 1000
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: '0', fontSize: '1.5rem', color: '#fffffe' }}>
                {selectedNode.name}
              </h2>
              <button 
                onClick={closeDetailPanel} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#94a1b2', 
                  cursor: 'pointer', 
                  fontSize: '1.2rem' 
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ 
              display: 'inline-block', 
              padding: '4px 10px', 
              backgroundColor: nodeColors[selectedNode.label] || '#fffffe', 
              color: '#0d1117', 
              borderRadius: '12px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              fontSize: '0.9rem'
            }}>
              {selectedNode.label}
            </div>
            
            {selectedNode.bio && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#94a1b2' }}>About</h3>
                <p style={{ margin: '0', lineHeight: '1.5', color: '#fffffe' }}>{selectedNode.bio}</p>
              </div>
            )}
            
            {selectedNode.recentActivity && (
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#94a1b2' }}>Recent Activity</h3>
                <p style={{ margin: '0', lineHeight: '1.5', color: '#fffffe' }}>{selectedNode.recentActivity}</p>
              </div>
            )}
            
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#94a1b2' }}>Connections</h3>
              {enhancedGraphData.links
                .filter(link => link.source === selectedNode.id || (typeof link.source === 'object' && link.source.id === selectedNode.id) || 
                                link.target === selectedNode.id || (typeof link.target === 'object' && link.target.id === selectedNode.id))
                .map((link, index) => {
                  const isSource = link.source === selectedNode.id || (typeof link.source === 'object' && link.source.id === selectedNode.id);
                  const otherNode = isSource ? getNodeName(link.target) : getNodeName(link.source);
                  return (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginBottom: '8px',
                      padding: '8px',
                      backgroundColor: 'rgba(13, 17, 23, 0.6)',
                      borderRadius: '4px',
                      border: `1px solid ${linkColors[link.type] || '#30363d'}`
                    }}>
                      <span style={{ 
                        color: linkColors[link.type] || '#94a1b2', 
                        fontWeight: 'bold'
                      }}>
                        {isSource ? '→' : '←'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#fffffe' }}>{otherNode}</div>
                        <div style={{ fontSize: '0.9rem', color: '#94a1b2' }}>
                          {isSource ? `${selectedNode.name} ${link.type} ${otherNode}` : `${otherNode} ${link.type} ${selectedNode.name}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {/* Force Graph */}
        <ForceGraph2D
          ref={fgRef}
          graphData={enhancedGraphData}
          nodeLabel={(node) => `${node.name} (${node.label})`}
          linkLabel={(link) => link.type}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkWidth={(link) => link === hoveredLink ? 3 : 1.5}
          linkDirectionalParticles={3}
          linkDirectionalParticleWidth={(link) => link === hoveredLink ? 3 : 1}
          linkDirectionalParticleSpeed={0.003}
          nodeRelSize={6}
          backgroundColor="#0d1117"
          onNodeHover={setHoveredNode}
          onLinkHover={setHoveredLink}
          onNodeClick={handleNodeClick}
          // Adjust physics for stability
          d3AlphaDecay={0.02} // Higher value = faster stabilization
          d3VelocityDecay={0.3} // Higher value = more damping
          cooldownTime={3000} // Allow more time for initial stabilization
          cooldownTicks={200} 
          onEngineStop={handleEngineStop}
          // Configure forces for a more stable graph
          d3Force={(force) => {
            // Stronger center force to keep nodes better grouped
            force('center').strength(0.05);
            
            // Adjust charge force for better node separation
            force('charge').strength(-80).distanceMax(200);
            
            // Add collide force to prevent node overlap
            force('collide', d3.forceCollide().radius((node) => (node.val || 15) * 1.5));
            
            // Adjust link force to maintain consistent distances
            force('link').distance(() => 100).strength(0.7);
          }}
          nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
            try {
              // Determine if node is selected
              const isSelected = selectedNode && selectedNode.id === node.id;
              
              // Node circle with smoother sizing
              const baseSize = node.val || 15;
              const hoverMultiplier = node === hoveredNode ? 1.2 : 1;
              const size = isSelected ? baseSize * 1.3 : baseSize * hoverMultiplier;
              
              ctx.beginPath();
              ctx.arc(node.x || 0, node.y || 0, size / globalScale, 0, 2 * Math.PI);
              ctx.fillStyle = node.color || '#fffffe';
              ctx.fill();
              
              // Node border when hovered or selected
              if (node === hoveredNode || isSelected) {
                ctx.strokeStyle = isSelected ? "#ffffff" : "#94a1b2";
                ctx.lineWidth = isSelected ? 2 / globalScale : 1.5 / globalScale;
                ctx.stroke();
                
                // Add gentle glow/pulse effect for selected node (much more subtle)
                if (isSelected) {
                  // Use a subtle static glow instead of pulsing
                  ctx.beginPath();
                  ctx.arc(node.x || 0, node.y || 0, (size * 1.4) / globalScale, 0, 2 * Math.PI);
                  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
                  ctx.lineWidth = 3 / globalScale;
                  ctx.stroke();
                  
                  // Second glow ring
                  ctx.beginPath();
                  ctx.arc(node.x || 0, node.y || 0, (size * 1.8) / globalScale, 0, 2 * Math.PI);
                  ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
                  ctx.lineWidth = 2 / globalScale;
                  ctx.stroke();
                }
              }
              
              // Node label
              const label = node.name || '';
              
              // Scale font size based on zoom level for better readability
              const fontSize = 14 / globalScale;
              const cappedFontSize = Math.min(fontSize, 16); // Cap maximum font size
              
              ctx.font = `${cappedFontSize}px Arial, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Show labels only when zoomed in enough, hovered, or selected
              if (globalScale > 0.5 || node === hoveredNode || isSelected) {
                // Background for text to make it readable
                const textWidth = ctx.measureText(label).width;
                const bgPadding = 4;
                
                // Only draw text background when needed
                if (textWidth > 10) {
                  ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
                  ctx.fillRect(
                    (node.x || 0) - textWidth / 2 - bgPadding,
                    (node.y || 0) + size / globalScale + 4,
                    textWidth + bgPadding * 2,
                    cappedFontSize + bgPadding * 2
                  );
                }
                
                // Draw text
                ctx.fillStyle = isSelected ? '#ffffff' : '#fffffe';
                ctx.fillText(label, node.x || 0, (node.y || 0) + size / globalScale + 8 + bgPadding);
              }
            } catch (err) {
              console.error('Error rendering node:', err);
            }
          }}
        />
      </div>
    </div>
  );
}