from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import defaultdict

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    # Create adjacency list
    graph = defaultdict(list)
    for edge in edges:
        graph[edge['source']].append(edge['target'])
    
    # Keep track of visited nodes and nodes in current path
    visited = set()
    path = set()
    
    def has_cycle(node: str) -> bool:
        if node in path:
            return True
        if node in visited:
            return False
        
        path.add(node)
        visited.add(node)
        
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        
        path.remove(node)
        return False
    
    # Check for cycles starting from each node
    for node in [node['id'] for node in nodes]:
        if node not in visited:
            if has_cycle(node):
                return False
    
    return True

@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: Pipeline):
    try:
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        is_dag_result = is_dag(pipeline.nodes, pipeline.edges)
        
        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag_result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)