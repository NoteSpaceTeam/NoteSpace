import { useState } from 'react';
import TextArea from '../shared/components/TextArea/TextArea.tsx';
import './DocumentEditor.scss';
import useFugue from './hooks/useFugue.ts';
import useInputHandlers from './hooks/useInputHandlers.ts';
import useEvents from './hooks/useEvents.ts';

function DocumentEditor() {
  const [text, setText] = useState('');
  const fugue = useFugue();
  const { onInput, onSelect, onPaste } = useInputHandlers(fugue);

  useEvents(fugue, () => {
    setText(fugue.toString());
  });

  return (
    <div className="editor">
      <header>
        <span className="fa fa-bars"></span>
        <h1>NoteSpace</h1>
      </header>
      <div className="container">
        <TextArea
          value={text}
          onInput={onInput}
          onSelect={onSelect}
          onChange={e => setText(e.target.value)}
          onPaste={onPaste}
          placeholder={'Start writing...'}
        />
      </div>
    </div>
  );
}

export default DocumentEditor;
