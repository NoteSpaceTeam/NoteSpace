import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Selection } from '@notespace/shared/types/cursor';

export type BlockCallback = (type : BlockStyle, line : number) => void
export type InlineCallback = (key: InlineStyle, triggerLength: number, selection : Selection) => void
export type DeleteCallback = (selection : Selection) => void

export type MarkdownConnector = {
  blockCallback: BlockCallback
  inlineCallback: InlineCallback
  deleteCallback : DeleteCallback
  applyBlockStyle: (type : BlockStyle, line : number) => void
  applyInlineStyle: (key: InlineStyle, selection : Selection) => void
}
