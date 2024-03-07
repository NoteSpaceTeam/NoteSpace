import { BlockNoteView, useCreateBlockNote } from '@blocknote/react';
import { ComponentProps, useCallback, useState } from 'react';
import styles from './BlockNoteEditor.module.css';
import '@blocknote/react/style.css';
import './globals.css';
import './text-editor.css';
import SlashMenu from './slashMenus/SlashMenu.tsx';
import WorkspaceMenu from './slashMenus/WorkspaceMenu.tsx';

interface EditorProps extends Omit<ComponentProps<typeof BlockNoteView>, 'editor'> {
  value: string;
}

export function Editor(props: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'paragraph',
        content: 'Hello, World!',
      },
    ],
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const changeTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  }, [theme]);

  return (
    <div className={styles.container}>
      <div className={styles.editorHeader}>
        <button
          className={'fa fa-moon'}
          onClick={changeTheme}
          aria-label="Switch Theme"
          style={{ background: theme === 'dark' ? 'black' : 'white' }}
        ></button>
      </div>
      <div className={styles.editorPanel}>
        <BlockNoteView
          editor={editor}
          className={styles.editorContainer}
          theme={theme}
          slashMenu={false}
          sideMenu={false}
          spellCheck={false}
          {...props}
        >
          <SlashMenu editor={editor} />
          <WorkspaceMenu editor={editor} />
        </BlockNoteView>
      </div>
    </div>
  );
}

export default Editor;
