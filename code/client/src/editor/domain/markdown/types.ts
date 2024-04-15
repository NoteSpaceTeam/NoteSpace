import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Selection } from '@notespace/shared/types/cursor';

export type BlockHandler = (style: BlockStyle, line: number) => void;
export type InlineHandler = (style: InlineStyle, triggerLength: number, selection: Selection) => void;
export type DeleteHandler = (selection: Selection) => void;
type ApplyBlockStyleHandler = (style: BlockStyle, line: number) => void;
type ApplyInlineStyleHandler = (style: InlineStyle, selection: Selection) => void;

export type MarkdownHandlers = {
  blockHandler: BlockHandler;
  inlineHandler: InlineHandler;
  deleteHandler: DeleteHandler;
  applyBlockStyleHandler: ApplyBlockStyleHandler;
  applyInlineStyleHandler: ApplyInlineStyleHandler;
};
