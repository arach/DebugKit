import React from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'llm' | 'output';
  label: string;
  description?: string;
  position: Position;
  color: string;
  inputs: string[];
  outputs: string[];
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}