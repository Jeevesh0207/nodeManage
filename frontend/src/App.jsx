import React, { useState, useCallback } from "react";
import styled from "styled-components";
import Flow from "./components/Flow";
import { submitPipeline } from "./utils/submit";

const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 16px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleNodeChange = useCallback((nodeId, value) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, value },
          };
        }
        return node;
      })
    );
  }, []);

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
    };
    setEdges((edges) => [...edges, newEdge]);

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === params.target) {
          const sourceNode = nodes.find((n) => n.id === params.source);
          return {
            ...node,
            data: {
              ...node.data,
              inputs: {
                ...node.data.inputs,
                input: sourceNode.data.value, // Changed to match handle ID
              },
            },
          };
        }
        return node;
      })
    );
  }, []);

  const handleSubmit = useCallback(() => {
    submitPipeline(nodes, edges);
  }, [nodes, edges]);

  const addNode = useCallback(
    (type) => {
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position: { x: 100, y: 100 },
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          onChange: (value) => handleNodeChange(newNode.id, value),
          inputs: {},
        },
      };
      setNodes((nodes) => [...nodes, newNode]);
    },
    [handleNodeChange]
  );

  return (
    <AppWrapper>
      <Toolbar>
        <Button onClick={() => addNode("input")}>Add Input</Button>
        <Button onClick={() => addNode("text")}>Add Text</Button>
        <Button onClick={() => addNode("llm")}>Add LLM</Button>
        <Button onClick={() => addNode("output")}>Add Output</Button>
        <Button onClick={handleSubmit}>Submit Pipeline</Button>
      </Toolbar>
      <Flow
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnect={onConnect}
      />
    </AppWrapper>
  );
};

export default App;
