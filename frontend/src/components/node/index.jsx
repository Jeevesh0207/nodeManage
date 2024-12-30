import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BaseNode from './BaseNode';

export const InputNode = ({ data }) => {
  return (
    <BaseNode
      data={data}
      outputHandles={[{ id: 'output' }]}
    >
      <input 
        type="text"
        placeholder="Enter input..."
        value={data.value || ''}
        onChange={(e) => data.onChange?.(e.target.value)}
      />
    </BaseNode>
  );
};

const DynamicTextArea = styled.textarea`
  min-width: 200px;
  min-height: 100px;
  resize: both;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
`;

export const TextNode = ({ data }) => {
  const [variables, setVariables] = useState([]);
  const [text, setText] = useState(data.text || '');

  useEffect(() => {
    const matches = text.match(/{{([^}]+)}}/g) || [];
    const vars = matches.map(match => match.slice(2, -2).trim());
    setVariables([...new Set(vars)]);

    if (data.inputs?.input) {
      const processedText = text.replace(/{{input}}/g, data.inputs.input);
      data.onChange?.(processedText);
    }
  }, [text, data.inputs?.input]);

  return (
    <BaseNode
      data={data}
      inputHandles={variables.map(v => ({ id: v }))}
      outputHandles={[{ id: 'output' }]}
    >
      <DynamicTextArea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          data.onChange?.(e.target.value);
        }}
        placeholder="Enter text with {{variables}}..."
      />
      <div style={{ marginTop: '8px' }}>
        Preview: {data.inputs?.input ? text.replace(/{{input}}/g, data.inputs.input) : text}
      </div>
    </BaseNode>
  );
};

// In nodes/index.js
// export const TextNode = ({ data }) => {
//   const [variables, setVariables] = useState([]);
//   const [text, setText] = useState(data.text || '');

//   useEffect(() => {
//     const matches = text.match(/{{([^}]+)}}/g) || [];
//     const vars = matches.map(match => match.slice(2, -2).trim());
//     setVariables([...new Set(vars)]);
//   }, [text]);

//   return (
//     <BaseNode
//       data={data}
//       inputHandles={[{ id: 'input' }]} // Changed this line
//       outputHandles={[{ id: 'output' }]}
//     >
//       <DynamicTextArea
//         value={text}
//         onChange={(e) => {
//           setText(e.target.value);
//           data.onChange?.(e.target.value);
//         }}
//         placeholder="Enter text with {{variables}}..."
//       />
//     </BaseNode>
//   );
// };

export const LLMNode = ({ data }) => {
  return (
    <BaseNode
      data={data}
      inputHandles={[{ id: 'prompt' }, { id: 'system' }]}
      outputHandles={[{ id: 'output' }]}
    >
      <select
        value={data.model}
        onChange={(e) => data.onModelChange?.(e.target.value)}
      >
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-3.5-turbo">GPT-3.5</option>
        <option value="claude-2">Claude 2</option>
      </select>
    </BaseNode>
  );
};

export const OutputNode = ({ data }) => {
  return (
    <BaseNode
      data={data}
      inputHandles={[{ id: 'input' }]}
    >
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {data.inputs?.input || 'Waiting for input...'}
      </pre>
    </BaseNode>
  );
};