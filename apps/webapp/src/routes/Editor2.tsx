import React, { useState, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    NodeTypes,
    MarkerType,
    NodeProps
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';


export function createNodesAndEdges(xNodes = 10, yNodes = 10) {
    const nodes = [];
    const edges = [];
    let nodeId = 1;
    let recentNodeId = null;

    for (let y = 0; y < yNodes; y++) {
        for (let x = 0; x < xNodes; x++) {
            const position = { x: x * 100, y: y * 50 };
            const data = { label: `Node ${nodeId}` };
            const node = {
                id: `stress-${nodeId.toString()}`,
                style: { width: 50, fontSize: 11 },
                data,
                position,
            };
            nodes.push(node);

            if (recentNodeId && nodeId <= xNodes * yNodes) {
                edges.push({
                    id: `${x}-${y}`,
                    source: `stress-${recentNodeId.toString()}`,
                    target: `stress-${nodeId.toString()}`,
                });
            }

            recentNodeId = nodeId;
            nodeId++;
        }
    }

    return { nodes, edges };
}





const StressFlow = () => {


    const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(
        2,
        3,
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (params: any) => setEdges((els) => addEdge(params, els)),
        [],
    );

    const updatePos = useCallback(() => {
        setNodes((nds) => {
            return nds.map((node) => {
                return {
                    ...node,
                    position: {
                        x: Math.random() * 1500,
                        y: Math.random() * 1500,
                    },
                };
            });
        });
    }, []);

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                minZoom={0}
            >
                <Controls />
                <Background />

                <button
                    onClick={updatePos}
                    style={{ position: 'absolute', right: 10, top: 30, zIndex: 4 }}
                >
                    change pos
                </button>
            </ReactFlow>
        </div>
    );
};


export default StressFlow;