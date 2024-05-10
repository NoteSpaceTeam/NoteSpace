import { type InlineStyle } from '@notespace/shared/document/types/styles';
import { NodeType } from '@notespace/shared/document/types/nodes';

export type NodeInsert = {
  value: string;
  styles: InlineStyle[];
};

export type FugueNode = NodeType<string>;
