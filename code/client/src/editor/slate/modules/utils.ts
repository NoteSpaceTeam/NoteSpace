import { Descendant } from 'slate';
import { ElementType } from '@src/editor/slate/modules/Elements.ts';
import { CustomText } from '@src/editor/slate/modules/types';

export const descendant = (type: ElementType, children: CustomText[]): Descendant => {
  return { type, children };
};

export const descendantChildren = (...values: string[]): CustomText[] => {
  return values.map(value => {
    return { text: value };
  });
};
