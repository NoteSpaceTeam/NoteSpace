import { BlockStyles, InlineStyles } from '@notespace/shared/document/types/styles';
import { blockRules, inlineRules } from '@domain/editor/slate/plugins/markdown/rules';

export const shortcuts = [
  blockRules(BlockStyles.h1, '#'),
  blockRules(BlockStyles.h2, '##'),
  blockRules(BlockStyles.h3, '###'),
  blockRules(BlockStyles.h4, '####'),
  blockRules(BlockStyles.h5, '#####'),
  blockRules(BlockStyles.h6, '######'),
  blockRules(BlockStyles.blockquote, '>'),
  blockRules(BlockStyles.li, '-'),
  blockRules(BlockStyles.li, '*'),
  blockRules(BlockStyles.num, '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.'),
  blockRules(BlockStyles.code, '```'),
  blockRules(BlockStyles.hr, '---'),
  blockRules(BlockStyles.checked, '-[x]'),
  blockRules(BlockStyles.unchecked, '-[]'),
  inlineRules(InlineStyles.bold, '**', '__'),
  inlineRules(InlineStyles.italic, '*', '_'),
  inlineRules(InlineStyles.strikethrough, '~~'),
  inlineRules(InlineStyles.underline, '=='),
];
