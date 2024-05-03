import { type InlineStyle } from '@notespace/shared/types/styles';
import { NodeType } from '@notespace/shared/crdt/utils';

export type NodeInsert = {
  value: string;
  styles: InlineStyle[];
};

export type FugueNode = NodeType<string>
