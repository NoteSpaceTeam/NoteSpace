import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Selection } from '@notespace/shared/types/cursor';

export type MarkdownHandlers = {
  applyBlockStyle: ApplyBlockStyleHandler;
  applyInlineStyle: ApplyInlineStyleHandler;
  deleteBlockStyles: DeleteBlockStylesHandler;
};

export type ApplyBlockStyleHandler = (style: BlockStyle, line: number, deleteTriggerNodes?: boolean) => void;
export type ApplyInlineStyleHandler = (
  style: InlineStyle,
  selection: Selection,
  value: boolean,
  triggerLength?: number
) => void;
export type DeleteBlockStylesHandler = (selection: Selection) => void;
