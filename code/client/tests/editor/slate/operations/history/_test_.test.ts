import {HistoryTestPipeline} from "@tests/editor/slate/operations/history/HistoryTestPipeline";
import {FugueUtils} from "@tests/editor/fugue/utils";
import {Operation} from "@notespace/shared/src/document/types/operations";
import {BaseOperation} from "slate";

describe("test pipeline", () => {
    it("should work", () => {
        const pipeline = new HistoryTestPipeline();

        // Setup editor
        const id1 = FugueUtils.id("user-1", 0);
        const id2 = FugueUtils.id("user-1", 1);
        const operations : Operation[] = [
            FugueUtils.insertText(id1, { value: "a" }),
            FugueUtils.insertText(id2,
                { value: "b", parent: id1 }
            ),
        ]
        pipeline.setupEditor(...operations);

        // Apply editor operations
        const slateOperations : BaseOperation[] = [
            { type: "insert_text", path: [0, 0], offset: 2, text: "cd" },
        ]
        pipeline.applyEditorOperations(...slateOperations);

        // Extract undo operations
        const undoOperations = pipeline.extractUndoOperations();

        // Test
        expect(undoOperations?.operations).toEqual(slateOperations);

        const redoOperations = pipeline.extractRedoOperations();

        expect(redoOperations?.operations).toEqual(slateOperations);
    })
})