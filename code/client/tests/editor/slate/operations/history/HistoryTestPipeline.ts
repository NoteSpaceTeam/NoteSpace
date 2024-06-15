import { Fugue } from '@domain/editor/fugue/Fugue';
import { Descendant, Editor, Operation } from 'slate';
import { buildEditor, descendant, toSlate } from '@domain/editor/slate/utils/slate';
import { last } from 'lodash';
import { toHistoryOperations } from '@domain/editor/slate/operations/history/toHistoryOperations';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { HistoryOperation } from '@domain/editor/shared/historyTypes';
import { mockCommunication } from '@tests/mocks/mockCommunication';
import historyConnector from '@domain/editor/connectors/history/connector';
import serviceConnector from '@domain/editor/connectors/service/connector';
import { HistoryConnector } from '@domain/editor/connectors/history/types';

/**
 * Pipeline for testing history operations in a more controlled environment
 */
export class HistoryTestPipeline {
  private _fugue: Fugue = new Fugue();
  private slate: Editor = buildEditor(withReact, withHistory);
  private historyConnector: HistoryConnector;

  private snapshots: Descendant[][] = [];

  constructor() {
    this.slate.children = [descendant('paragraph', '')];
    const mockServiceConnector = serviceConnector(this._fugue, mockCommunication());
    this.historyConnector = historyConnector(this._fugue, mockServiceConnector);
  }

  // Applies fugue state to the editor / operations are applied to the fugue before calling this
  setupEditor() {
    this.slate.children = toSlate(this._fugue);
  }

  // Receives slate operations and applies them to the editor
  applyOperations(operations: Operation[]) {
    operations.forEach(operation => {
      this.slate.apply(operation);
    });
  }

  // Receives history operations, applies them and updates the editor with the new fugue
  applyHistoryOperations(...operations: HistoryOperation[]) {
    this.historyConnector.applyHistoryOperation(operations);
    this.slate.children = toSlate(this._fugue);
  }

  // Extracts the undo operations from the editor
  extractUndoOperations() {
    const batch = last(this.slate.history.undos);
    const operations = toHistoryOperations(this.slate, batch, true);
    return { operations, batch };
  }

  // Extracts the redo operations from the editor
  extractRedoOperations() {
    this.slate.undo();
    const batch = last(this.slate.history.redos);
    const operations = toHistoryOperations(this.slate, batch, false);
    return { operations, batch };
  }

  takeSnapshot() {
    this.snapshots.push(this.slate.children);
    return this.slate.children;
  }

  restoreSnapshot() {
    this.slate.children = this.snapshots.pop() || [];
  }

  clearSnapshots() {
    this.snapshots = [];
  }

  getSnapshots() {
    return this.snapshots;
  }

  getLatestSnapshot() {
    return last(this.snapshots);
  }

  get fugue() {
    return this._fugue;
  }
}
