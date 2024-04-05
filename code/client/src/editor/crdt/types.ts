import { type InlineStyle } from '@notespace/shared/types/styles.ts';
import { Node } from '@notespace/shared/crdt/types/nodes.ts';

export type NodeInsert = {
  value: string;
  styles: InlineStyle[];
};

export type FugueNode = Node<string>;
