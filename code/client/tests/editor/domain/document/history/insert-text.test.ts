import {describe, test, expect, beforeEach} from "vitest";
import historyOperations from "@domain/editor/operations/history/operations";
import {HistoryDomainOperations} from "@domain/editor/operations/history/types";
import {Fugue} from "@domain/editor/crdt/fugue";
import {mockSocket} from "@tests/editor/domain/document/history/utils";

let fugue : Fugue;

let historyOperation : HistoryDomainOperations;

beforeEach(() => {
    fugue = new Fugue();
    historyOperation = historyOperations(fugue, mockSocket);
});

describe('Insert text', () => {
    test('Should Work', () => {
        expect(true).toBeTruthy();
    });
});
