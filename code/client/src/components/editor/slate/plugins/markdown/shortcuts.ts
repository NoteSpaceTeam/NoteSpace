import { BlockStyles, InlineStyles } from '@notespace/shared/types/styles.ts';
import { blockRules, inlineRules } from '@src/components/editor/slate/plugins/markdown/rules.ts';

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
  blockRules(BlockStyles.num, '1.'),
  blockRules(BlockStyles.code, '```'),
  blockRules(BlockStyles.hr, '---'),
  inlineRules(InlineStyles.bold, '**', '__'),
  inlineRules(InlineStyles.italic, '*', '_'),
  inlineRules(InlineStyles.strikethrough, '~~'),
  inlineRules(InlineStyles.underline, '=='),
];
