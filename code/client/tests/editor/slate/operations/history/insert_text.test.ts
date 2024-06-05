import {HistoryTestPipeline} from "@tests/editor/slate/operations/history/HistoryTestPipeline";
import {FugueUtils} from "@tests/editor/fugue/utils";
import {BlockStyleOperation, Operation} from "@notespace/shared/src/document/types/operations";
import {BaseOperation} from "slate";
import {BlockStyles} from "@notespace/shared/src/document/types/styles";

let pipeline : HistoryTestPipeline;

beforeEach(() => {
    pipeline = new HistoryTestPipeline();
})

describe("Undo text insertion", () => {
    describe("Start of the line", () => {
        describe("No style line", () => {
            it("no inline style", () => {
                // Take snapshot for comparison
                const snapshot = pipeline.takeSnapshot();
                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_text", path: [0, 0], offset: 0, text: "cd" },
                ]
                // Equivalent Fugue operations
                pipeline.fugue.insertLocal({line: 0, column: 0}, ..."cd".split(""));

                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const newSnapshot = pipeline.takeSnapshot();
                expect(newSnapshot).toEqual(snapshot);
            })
            it("inline style", () => {
                // Take snapshot for comparison
                const beforeSnapshot = pipeline.takeSnapshot();
                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_node", path: [0, 0], node: { type: "bold", text: "cd" } },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 0},
                    {value: "c", styles: ["bold"]},
                    {value: "d", styles: ["bold"]}
                );
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
        })
        describe("Style line", () => {
            it("no inline style", () => {
                // Apply block line style
                const blockStyle : BlockStyleOperation = {
                    append: false,
                    style: BlockStyles.h1,
                    type: 'block-style',
                    line: 0
                }
                pipeline.setupEditor(blockStyle);
                const beforeSnapshot = pipeline.takeSnapshot();

                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_text", path: [0, 0], offset: 0, text: "cd" },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 0}, ..."cd".split(""));
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
            it("inline style", () => {
                // Apply block line style
                const blockStyle : BlockStyleOperation = {
                    append: false,
                    style: BlockStyles.h1,
                    type: 'block-style',
                    line: 0
                }
                pipeline.setupEditor(blockStyle);
                const beforeSnapshot = pipeline.takeSnapshot();

                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_node", path: [0, 0], node: { type: "bold", text: "cd" } },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 0},
                    {value: "c", styles: ["bold"]},
                    {value: "d", styles: ["bold"]}
                );
                pipeline.applyOperations(slateOperations);

                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
        })
    })
    describe("Middle of the line", () => {
        describe("No style line", () => {
            it("no inline style", () => {
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
                const beforeSnapshot = pipeline.takeSnapshot();
                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_text", path: [0, 0], offset: 1, text: "cd" },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 1}, ..."cd".split(""));
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
            it("inline style", () => {
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
                const beforeSnapshot = pipeline.takeSnapshot();
                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    {type: "split_node", path: [0, 0], position: 1, properties: {type: "paragraph"}},
                    { type: "insert_node", path: [0, 1], node: { type: "bold", text: "cd" } },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 1},
                    {value: "c", styles: ["bold"]},
                    {value: "d", styles: ["bold"]}
                );
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
        })
        describe("Style line", () => {
            it("no inline style", () => {
                // Apply block line style
                const blockStyle : BlockStyleOperation = {
                    append: false,
                    style: BlockStyles.h1,
                    type: 'block-style',
                    line: 0
                }

                const id1 = FugueUtils.id("user-1", 0);
                const id2 = FugueUtils.id("user-1", 1);
                const operations : Operation[] = [
                    blockStyle,
                    FugueUtils.insertText(id1, { value: "a" }),
                    FugueUtils.insertText(id2,
                        { value: "b", parent: id1 }
                    ),
                ]
                pipeline.setupEditor(...operations);
                const beforeSnapshot = pipeline.takeSnapshot();

                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_text", path: [0, 0], offset: 1, text: "cd" },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 1}, ..."cd".split(""));
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);

            })
            it("inline style", () => {
                // Apply block line style
                const blockStyle : BlockStyleOperation = {
                    append: false,
                    style: BlockStyles.h1,
                    type: 'block-style',
                    line: 0
                }

                const id1 = FugueUtils.id("user-1", 0);
                const id2 = FugueUtils.id("user-1", 1);
                const operations : Operation[] = [
                    blockStyle,
                    FugueUtils.insertText(id1, { value: "a" }),
                    FugueUtils.insertText(id2,
                        { value: "b", parent: id1 }
                    ),
                ]
                pipeline.setupEditor(...operations);
                const beforeSnapshot = pipeline.takeSnapshot();

                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    {type: "split_node", path: [0, 0], position: 1, properties: {type: "paragraph"}},
                    { type: "insert_node", path: [0, 1], node: { type: "bold", text: "cd" } },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 1},
                    {value: "c", styles: ["bold"]},
                    {value: "d", styles: ["bold"]}
                );
                pipeline.applyOperations(slateOperations);

                // Extract undo operations
                pipeline.extractUndoOperations();
                // ...
                // Redo the undo operations
                pipeline.extractRedoOperations(); // implicitly redoes the undo operation
                // Test
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
        })
    })
    describe("End of the line", () => {
        describe("No style line", () => {
            it("no inline style", () => {
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
                const beforeSnapshot = pipeline.takeSnapshot();
                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_text", path: [0, 0], offset: 2, text: "cd" },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 2}, ..."cd".split(""));
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
            it("inline style", () => {
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
                const beforeSnapshot = pipeline.takeSnapshot();
                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_node", path: [0, 1], node: { type: "bold", text: "cd" } },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 2},
                    {value: "c", styles: ["bold"]},
                    {value: "d", styles: ["bold"]}
                );
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
        })
        describe("Style line", () => {
            it("no inline style", () => {
                // Apply block line style
                const blockStyle : BlockStyleOperation = {
                    append: false,
                    style: BlockStyles.h1,
                    type: 'block-style',
                    line: 0
                }
                const id1 = FugueUtils.id("user-1", 0);
                const id2 = FugueUtils.id("user-1", 1);

                const operations : Operation[] = [
                    blockStyle,
                    FugueUtils.insertText(id1, { value: "a" }),
                    FugueUtils.insertText(id2,
                        { value: "b", parent: id1 }
                    ),
                ]
                pipeline.setupEditor(...operations);
                const beforeSnapshot = pipeline.takeSnapshot();

                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_text", path: [0, 0], offset: 2, text: "cd" },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 2}, ..."cd".split(""));
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                pipeline.extractUndoOperations();
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
            it("inline style", () => {
                // Apply block line style
                const blockStyle : BlockStyleOperation = {
                    append: false,
                    style: BlockStyles.h1,
                    type: 'block-style',
                    line: 0
                }

                const id1 = FugueUtils.id("user-1", 0);
                const id2 = FugueUtils.id("user-1", 1);
                const operations : Operation[] = [
                    blockStyle,
                    FugueUtils.insertText(id1, { value: "a" }),
                    FugueUtils.insertText(id2,
                        { value: "b", parent: id1 }
                    ),
                ]
                pipeline.setupEditor(...operations);
                const beforeSnapshot = pipeline.takeSnapshot();

                // Apply editor operations
                const slateOperations : BaseOperation[] = [
                    { type: "insert_node", path: [0, 1], node: { type: "bold", text: "cd" } },
                ]
                pipeline.fugue.insertLocal({line: 0, column: 2},
                    {value: "c", styles: ["bold"]},
                    {value: "d", styles: ["bold"]}
                );
                pipeline.applyOperations(slateOperations);
                // Extract undo operations
                const batch = pipeline.extractUndoOperations();
                // Apply history operations
                pipeline.applyHistoryOperations(...batch.operations);
                // Compare snapshots
                const afterSnapshot = pipeline.takeSnapshot();
                expect(afterSnapshot).toEqual(beforeSnapshot);
            })
        })
    })
})
