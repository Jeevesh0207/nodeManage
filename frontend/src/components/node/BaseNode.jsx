import React from 'react';
import { Handle } from 'reactflow';
import styled from 'styled-components';

const NodeWrapper = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-width: 150px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
`;

const NodeHeader = styled.div`
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NodeContent = styled.div`
  font-size: 14px;
`;

const BaseNode = ({ 
  data,
  inputHandles = [],
  outputHandles = [],
  children,
  className,
  icon: Icon
}) => {
  return (
    <NodeWrapper className={className} style={data.style}>
      <NodeHeader>
        {Icon && <Icon size={18} />}
        {data.label}
      </NodeHeader>
      
      {inputHandles.map((handle, index) => (
        <Handle
          key={`input-${handle.id}`}
          type="target"
          position="left"
          id={handle.id}
          style={{ top: `${(index + 1) * 25}%` }}
        />
      ))}
      
      <NodeContent>{children}</NodeContent>
      
      {outputHandles.map((handle, index) => (
        <Handle
          key={`output-${handle.id}`}
          type="source"
          position="right"
          id={handle.id}
          style={{ top: `${(index + 1) * 25}%` }}
        />
      ))}
    </NodeWrapper>
  );
};

export const createNode = (type, config) => {
  return {
    type,
    data: {
      label: config.label,
      icon: config.icon,
      style: config.style,
      inputs: {},
      ...config.data
    },
    position: { x: 0, y: 0 },
    ...config
  };
};

export default BaseNode;