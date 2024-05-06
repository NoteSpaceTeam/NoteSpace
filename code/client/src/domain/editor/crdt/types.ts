import { type InlineStyle } from '@notespace/shared/types/styles';
import { NodeType } from '@notespace/shared/crdt/types/nodes';

export type NodeInsert = {
  value: string;
  styles: InlineStyle[];
};

export type FugueNode = NodeType<string>;
