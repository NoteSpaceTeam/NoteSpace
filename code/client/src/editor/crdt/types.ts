import { type Style } from '@notespace/shared/crdt/styles';

export interface InsertNode {
  value: string;
  styles: Style[];
}
