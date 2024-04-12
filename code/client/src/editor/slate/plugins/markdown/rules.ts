import { createSetBlockApply, createSetInlineApply } from '@editor/slate/plugins/markdown/operations/applyOperations';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { BlockCallback, InlineCallback } from '@editor/slate/plugins/markdown/connector/types';
import { Editor, Range } from 'slate';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export enum RuleType {
  Block = 'block',
  Inline = 'inline',

}

export type Rule = {
  type : RuleType;
  triggers : RegExp[];
  apply : ApplyFunction
}

export type ApplyFunction = (callback: BlockCallback | InlineCallback) => (editor: Editor, range : Range) => void;

export function blockRules(type: BlockStyle, ...triggerCharacters: string[]) : Rule {
  const triggers = triggerCharacters.map(trigger => new RegExp(`^(${escapeRegExp(trigger)})$`));
  const apply : ApplyFunction = (callback) =>
    createSetBlockApply(type, callback as BlockCallback);
  return { type: RuleType.Block, triggers, apply };
}

export function inlineRules(type: InlineStyle, ...triggerCharacters: string[]) : Rule {
  const triggers = triggerCharacters.map(trigger => {
    const escaped = escapeRegExp(trigger);
    return new RegExp(`(${escaped}).+?(${escaped})$`);
  });
  const triggerLength = triggerCharacters[0].length;
  const apply : ApplyFunction = (callback) =>
    createSetInlineApply(type, triggerLength, callback as InlineCallback);
  return { type : RuleType.Inline, triggers, apply };
}
