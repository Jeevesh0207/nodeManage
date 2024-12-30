import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import {InputNode,TextNode,LLMNode,OutputNode} from './node'

const FlowWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
`;

const nodeTypes = {
  input: InputNode,
  text: TextNode,
  llm: LLMNode,
  output: OutputNode
};

const Flow = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) => {
  const handleNodesChange = useCallback(
    (changes) => onNodesChange(applyNodeChanges(changes, nodes)),
    [nodes, onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes) => onEdgesChange(applyEdgeChanges(changes, edges)),
    [edges, onEdgesChange]
  );

  return (
    <FlowWrapper>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </FlowWrapper>
  );
};

export default Flow;