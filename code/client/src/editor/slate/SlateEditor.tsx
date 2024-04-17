import Toolbar from "@editor/components/toolbar/Toolbar";
import EditorTitle from "@editor/components/title/EditorTitle";
import {Editable, Slate} from "slate-react";
import {Editor} from "slate";


type SlateEditorProps = {
    editor?: Editor;
    initialValue: any;
    onCursorChange: (value: any) => void;
    fugue: any;
    getElementRenderer: any;
    getLeafRenderer: any;
    onInput: (e: any) => void;
    onCut: (e: any) => void;
    onPaste: (e: any) => void;
    onShortcut: (e: any) => void;
}


export default function SlateEditor(
    {
        editor,
        initialValue,
        onCursorChange,
        fugue,
        getElementRenderer,
        getLeafRenderer,
        onInput,
        onCut,
        onPaste,
        onShortcut,
    } : SlateEditorProps
) {
    return (
        <Slate editor={editor} initialValue={initialValue} onChange={onCursorChange}>
            <Toolbar fugue={fugue} />
            <EditorTitle placeholder={'Untitled'} />
            <Editable
                className="editable"
                data-testid={'editor'}
                renderElement={getElementRenderer}
                renderLeaf={getLeafRenderer}
                //        decorate={decorate}
                spellCheck={false}
                onDragStart={e => e.preventDefault()}
                placeholder={'Start writing...'}
                onDOMBeforeInput={onInput}
                onCut={onCut}
                onPaste={e => onPaste(e.nativeEvent)}
                onKeyDown={e => onShortcut(e.nativeEvent)}
            />
        </Slate>
    );
}