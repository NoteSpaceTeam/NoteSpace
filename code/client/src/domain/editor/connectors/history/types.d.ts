import {HistoryOperation} from "@domain/editor/slate/operations/history/types";

export type HistoryConnector = {
  applyHistoryOperation: ApplyHistory;
};

export type ApplyHistory = (operations: HistoryOperation[]) => void;
