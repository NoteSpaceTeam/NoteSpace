import { createSetBlockApply, createSetInlineApply } from '@editor/slate/plugins/markdown/applyOperations';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Fugue } from '@editor/crdt/fugue';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function blockRules(type: BlockStyle, ...triggerCharacters: string[]) {
  const triggers = triggerCharacters.map(trigger => new RegExp(`^(${escapeRegExp(trigger)})$`));
  const apply = (fugue: Fugue) => createSetBlockApply(type, fugue);
  return { triggers, apply };
}

export function inlineRules(type: InlineStyle, ...triggerCharacters: string[]) {
  const triggers = triggerCharacters.map(trigger => {
    const escaped = escapeRegExp(trigger);
    return new RegExp(`(${escaped}).+?(${escaped})$`);
  });
  const triggerLength = triggerCharacters[0].length;
  const apply = (fugue: Fugue) => createSetInlineApply(type, triggerLength, fugue);
  return { triggers, apply };
}
