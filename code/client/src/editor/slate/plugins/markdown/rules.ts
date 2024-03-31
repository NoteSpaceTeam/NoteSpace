import { createSetBlockApply, createSetInlineApply } from '@editor/slate/plugins/markdown/applyOperations.ts';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles.ts';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function blockRules(type: BlockStyle, ...triggerCharacters: string[]) {
  const triggers = triggerCharacters.map(trigger => new RegExp(`^(${escapeRegExp(trigger)})$`));
  const apply = createSetBlockApply(type);
  return { triggers, apply };
}

export function inlineRules(type: InlineStyle, ...triggerCharacters: string[]) {
  const triggers = triggerCharacters.map(trigger => {
    const escaped = escapeRegExp(trigger);
    return new RegExp(`(${escaped}).+?(${escaped})$`);
  });
  const triggerLength = triggerCharacters[0].length;
  const apply = createSetInlineApply(type, triggerLength);
  return { triggers, apply };
}
