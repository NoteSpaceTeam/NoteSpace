import { Descendant } from 'slate';
import { CustomText, ElementType } from '@src/editor/slate/model/types.ts';

/**
 * Creates a descendant object.
 * @param type
 * @param children
 * @returns
 */
export const descendant = (type: ElementType, children: CustomText[]): Descendant => {
  return { type, children };
};

/**
 * Creates an array of children for a descendant.
 * @param values
 */
export const children = (...values: string[]): CustomText[] => {
  return values.map(value => {
    return { text: value };
  });
};
