import {
  createSetBlockApply,
  createSetInlineApply,
} from '@pages/editor/slate/plugins/markdown/operations/applyOperations.ts';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles.ts';
import { ApplyBlockStyle, ApplyInlineStyle } from '@pages/editor/domain/document/markdown/types.ts';
import { Editor, Range } from 'slate';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export enum RuleType {
  Block = 'block',
  Inline = 'inline',
}

export type Rule = {
  type: RuleType;
  triggers: RegExp[];
  apply: ApplyFunction;
};

export type ApplyFunction = (handler: ApplyBlockStyle | ApplyInlineStyle) => (editor: Editor, range: Range) => void;

export function blockRules(style: BlockStyle, ...triggerCharacters: string[]): Rule {
  const triggers = triggerCharacters.map(trigger => new RegExp(`^(${escapeRegExp(trigger)})$`));
  const apply: ApplyFunction = handler => createSetBlockApply(style, handler as ApplyBlockStyle);
  return { type: RuleType.Block, triggers, apply };
}

export function inlineRules(style: InlineStyle, ...triggerCharacters: string[]): Rule {
  const triggers = triggerCharacters.map(trigger => {
    const escaped = escapeRegExp(trigger);
    return new RegExp(`(${escaped}).+?(${escaped})$`);
  });
  const triggerLength = triggerCharacters[0].length;
  const apply: ApplyFunction = handler => createSetInlineApply(style, triggerLength, handler as ApplyInlineStyle);
  return { type: RuleType.Inline, triggers, apply };
}
