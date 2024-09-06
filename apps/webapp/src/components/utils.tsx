import { NodeProps } from "@xyflow/react";

export const createNodesAndEdges = (xNodes = 10, yNodes = 10, prefix = "node") => {
    const nodes = [];
    const edges = [];
    let nodeId = 1;
    let recentNodeId = null;

    for (let y = 0; y < yNodes; y++) {
        for (let x = 0; x < xNodes; x++) {
            const position = { x: x * 100, y: y * 50 };
            const data = { label: `Node ${nodeId}` };
            const node = {
                id: `${prefix}-${nodeId.toString()}`,
                style: { width: 50, fontSize: 11 },
                data,
                position,
            };
            nodes.push(node);

            if (recentNodeId && nodeId <= xNodes * yNodes) {
                edges.push({
                    id: `${x}-${y}`,
                    source: `${prefix}-${recentNodeId.toString()}`,
                    target: `${prefix}-${nodeId.toString()}`,
                });
            }

            recentNodeId = nodeId;
            nodeId++;
        }
    }

    return { nodes, edges };
}


export const create1ToMNodesWithEdges = (parentNode: any, nodeProps: {
    type: string,
    data?: any
}[], prefix = "node") => {
    const nodes = [parentNode];
    const edges = [];
    let nodeId = 1;


    const { position: positionParent, id: idParent } = parentNode

    console.log('positionParent', positionParent, parentNode)
    for (let i = 0; i < nodeProps.length; i++) {
        const position = { x: positionParent.x + (i + 1) * 100, y: (i + 1) * 30 };
        const node = {
            id: `${prefix}-${nodeId.toString()}`,
            style: { width: 50, fontSize: 11 },
            type: nodeProps?.[i].type,
            data: {
                ...(nodeProps?.[i].data || {})
            },
            position,
        };
        nodes.push(node);

        if (idParent && nodeId <= nodeProps.length) {
            edges.push({
                id: `${prefix}-${i}`,
                source: idParent,
                target: `${prefix}-${nodeId.toString()}`,
            });
        }

        nodeId++;
    }

    return { nodes, edges };
}