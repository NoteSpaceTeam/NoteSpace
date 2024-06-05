import {Fugue} from "@domain/editor/fugue/Fugue";
import {Descendant, Editor, Operation} from "slate";

import { Operation as FugueOperation } from "@notespace/shared/src/document/types/operations";
import {buildEditor, descendant, toSlate} from "@domain/editor/slate/utils/slate";
import {last} from "lodash";
import {toHistoryOperations} from "@domain/editor/slate/operations/history/toHistoryOperations";
import {withReact} from "slate-react";
import {withHistory} from "slate-history";
import historyDomainOperations from "@domain/editor/fugue/operations/history/operations";
import {mockSocket} from "@tests/editor/domain/document/history/utils";
import {HistoryOperation} from "@domain/editor/fugue/operations/history/types";

/**
 * Pipeline for testing history operations in a more controlled environment
 */
export class HistoryTestPipeline {
    private _fugue : Fugue = new Fugue();
    private slate : Editor = buildEditor(withReact, withHistory);
    private domainOperations = historyDomainOperations(this._fugue, mockSocket)

    private snapshots : Descendant[][] = []

    constructor() {
        this.slate.children = [descendant("paragraph", "")]
    }

    // Receives fugue operations, applies them and updates the editor with the new fugue
    setupEditor(...operations : FugueOperation[]){
        this._fugue.applyOperations(operations, true)
        this.slate.children = toSlate(this._fugue)
    }

    // Receives slate operations and applies them to the editor
    applyOperations(operations : Operation[]){
        operations.forEach(operation => {
            this.slate.apply(operation)
        })
    }

    // Receives history operations, applies them and updates the editor with the new fugue
    applyHistoryOperations(...operations : HistoryOperation[]){
        this.domainOperations.applyHistoryOperation(operations)
        this.slate.children = toSlate(this._fugue)
    }

    // Extracts the undo operations from the editor
    extractUndoOperations(){
        const batch = last(this.slate.history.undos)
        const operations = toHistoryOperations(this.slate, batch, true);
        return { operations, batch };
    }

    // Extracts the redo operations from the editor
    extractRedoOperations(){
        this.slate.undo()
        const batch = last(this.slate.history.redos);
        const operations = toHistoryOperations(this.slate, batch, false);
        return { operations, batch };
    }

    takeSnapshot(){
        this.snapshots.push(this.slate.children)
        return this.slate.children
    }

    restoreSnapshot(){
        this.slate.children = this.snapshots.pop() || []
    }

    clearSnapshots(){
        this.snapshots = []
    }

    getSnapshots(){
        return this.snapshots
    }

    getLatestSnapshot(){
        return last(this.snapshots)
    }

    get fugue(){
        return this._fugue
    }
}