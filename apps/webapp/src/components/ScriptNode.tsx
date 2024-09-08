import { useQuery } from '@tanstack/react-query';
import {
    ReactFlow,
    Node,
    Handle,
    Position,
} from '@xyflow/react';
import { NodeProps } from "@xyflow/react";
import { useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// Custom node properties
type ScriptNodeProps = Node<{
    agentId: string,
    ipfs: string,
    onIpfsChange: (ipfs: string) => void;
}>



// Custom node component
const ScriptNode: React.FC<NodeProps<ScriptNodeProps>> = (props: NodeProps<ScriptNodeProps>) => {
    const { agentId, ipfs = 'QmaFkvER6xxJcYjwjpUwmtXrsN7CcQyYAoZTA1Tzrm5zQ5', onIpfsChange = () => { } } = props?.data;


    const fetchIpfs = () => {
        const ipfsUrl = `https://black-tragic-booby-340.mypinata.cloud/ipfs/${ipfs}`;
        return fetch(ipfsUrl)
            .then((res) => res.text())
    }

    const { data: ipfsContent, isLoading, error, refetch } = useQuery({
        queryKey: ['fetchScriptIpfs'],
        queryFn: fetchIpfs,
        refetchOnMount: true
    });


    useEffect(() => {
        refetch();
    }, [ipfs])


    const codeString = '(num) => num + 1';

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable
            />
            <div className="gradient wrapper">
                <div className="inner">
                    <h3 className="text-lg">Script</h3>
                    <div className="p-2 bg-white text-black rounded shadow h-full w-11/12 pb-4 g-2">
                        <div className="flex gap-2 align-middle items-center ">
                            <span>
                                Script IPFS
                            </span>
                            <input
                                type="text"
                                value={ipfs}
                                onChange={(e) => onIpfsChange(e.target.value)}
                                // onChange={(e) => onNameChange(agent.id, e.target.value)}
                                className="mb-4 p-2 border rounded text-white w-3/4"
                                placeholder="Agent Name"
                            />
                            <br />
                        </div>


                        {isLoading ? 'Loading...' : (
                            ipfsContent && (
                                <SyntaxHighlighter language="javascript" style={docco}>
                                    {ipfsContent}
                                </SyntaxHighlighter>
                            )

                        )}

                    </div>
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable
            />

        </>

    );
};

export default ScriptNode;