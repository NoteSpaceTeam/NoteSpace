import { Cursor } from '@notespace/shared/types/cursor';

export type ShortcutHandlers = {
  onCtrlDeletion: OnCtrlDeletionHandler;
  onFormat: OnFormatHandler;
};

export type OnCtrlDeletionHandler = (cursor: Cursor, reverse: boolean) => void;
export type OnFormatHandler = (key: string, value: boolean) => void;
