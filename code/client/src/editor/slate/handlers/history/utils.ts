import { BaseOperation } from 'slate';
import { HistoryOperation } from '@editor/domain/document/history/types';

const reverseTypes: { [key: string]: HistoryOperation['type'] } = {
  insert_text: 'remove_text',
  remove_text: 'insert_text',
  insert_node: 'remove_node',
  remove_node: 'insert_node',
  merge_node: 'split_node',
  split_node: 'merge_node',
  set_node: 'unset_node',
};

export const getReverseType = (type: BaseOperation['type']) => reverseTypes[type] || type;
