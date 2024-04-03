import { type Descendant } from 'slate';
import { type BlockStyle } from '../../../../../shared/types/styles.ts';

/**
 * Creates a descendant object.
 * @param type
 * @param children
 * @returns
 */
export const descendant = (type: BlockStyle, ...children: string[]): Descendant => (
  { type, children: children.map(text => ({text}))}
)
