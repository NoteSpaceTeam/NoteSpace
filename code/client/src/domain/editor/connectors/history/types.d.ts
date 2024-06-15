import { HistoryOperation } from '@domain/editor/shared/historyTypes';

export type HistoryConnector = {
  applyHistoryOperation: ApplyHistory;
};

export type ApplyHistory = (operations: HistoryOperation[]) => void;
