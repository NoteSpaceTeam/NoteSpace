import {HistoryTestPipeline} from "@tests/editor/slate/operations/history/HistoryTestPipeline";
import {RemoveNodeOperation} from "slate";

let pipeline : HistoryTestPipeline;

beforeEach(() => {
    pipeline = new HistoryTestPipeline();
})

describe('Undo delete line', () => {
    describe('No block styles', () => {
        it('empty line', () => {
            // Setup the editor
            pipeline.fugue.insertLocal({line: 0, column: 0}, "\n")
            pipeline.setupEditor()
            const beforeSnapshot = pipeline.takeSnapshot();
            // Apply the operation
            const slateOperations : RemoveNodeOperation[] = [{
                type: "remove_node",
                path: [0],
                node: {type: "paragraph", children: [{text: ""}]}
            }]
            pipeline.fugue.deleteLocal({start: {line: 1, column: 0}, end: {line: 1, column: 1}})
            pipeline.applyOperations(slateOperations)
            // Extract the undo operations
            const {operations} = pipeline.extractUndoOperations()
            // Apply the undo operations
            pipeline.applyHistoryOperations(...operations)
            const afterSnapshot = pipeline.takeSnapshot()
            // Compare
            expect(afterSnapshot).toEqual(beforeSnapshot)
        })
        it('text with no inline styles', () => {
            // Setup the editor
            pipeline.fugue.insertLocal({line: 0, column: 0}, ..."Hello".split(""))
            pipeline.fugue.insertLocal({line: 0, column: 0}, "\n")
            pipeline.setupEditor()
            const beforeSnapshot = pipeline.takeSnapshot();
            // Apply the operation
            const slateOperations : RemoveNodeOperation[] = [{
                type: "remove_node",
                path: [0],
                node: {type: "paragraph", children: [{text: ""}]}
            }]
            pipeline.fugue.deleteLocal({start: {line: 1, column: 0}, end: {line: 1, column: 1}})
            pipeline.applyOperations(slateOperations)
            // Extract the undo operations
            const {operations} = pipeline.extractUndoOperations()
            // Apply the undo operations
            pipeline.applyHistoryOperations(...operations)
            const afterSnapshot = pipeline.takeSnapshot()
            // Compare
            expect(afterSnapshot).toEqual(beforeSnapshot)
        })
        it('text with inline styles', () => {
            // Setup the editor
            pipeline.fugue.insertLocal({line: 0, column: 0}, ..."Hello".split(""))
            pipeline.fugue.insertLocal({line: 0, column: 0}, "\n")
            pipeline.setupEditor()
            const beforeSnapshot = pipeline.takeSnapshot();
            // Apply the operation
            const slateOperations : RemoveNodeOperation[] = [{
                type: "remove_node",
                path: [0],
                node: {type: "paragraph", children: [{text: ""}]}
            }]
            pipeline.fugue.deleteLocal({start: {line: 1, column: 0}, end: {line: 1, column: 1}})
            pipeline.applyOperations(slateOperations)
            // Extract the undo operations
            const {operations} = pipeline.extractUndoOperations()
            // Apply the undo operations
            pipeline.applyHistoryOperations(...operations)
            const afterSnapshot = pipeline.takeSnapshot()
            // Compare
            expect(afterSnapshot).toEqual(beforeSnapshot)
        })
    })
})