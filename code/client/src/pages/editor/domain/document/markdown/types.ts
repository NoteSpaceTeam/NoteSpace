import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles.ts';
import { Selection } from '@notespace/shared/types/cursor.ts';

export type MarkdownDomainOperations = {
  applyBlockStyle: ApplyBlockStyle;
  applyInlineStyle: ApplyInlineStyle;
  deleteBlockStyles: DeleteBlockStyles;
};

export type ApplyBlockStyle = (style: BlockStyle, line: number, deleteTriggerNodes?: boolean) => void;

export type ApplyInlineStyle = (
  style: InlineStyle,
  selection: Selection,
  value: boolean,
  triggerLength?: number
) => void;

export type DeleteBlockStyles = (selection: Selection) => void;
