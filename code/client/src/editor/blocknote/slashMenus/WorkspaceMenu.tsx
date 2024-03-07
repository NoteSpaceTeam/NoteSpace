import { BlockNoteEditor, filterSuggestionItems } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { DefaultReactSuggestionItem, SuggestionMenuController } from '@blocknote/react';
import '@blocknote/react/style.css';
import { IoIosDocument } from 'react-icons/io';
import { FaRegFolderOpen } from 'react-icons/fa6';

const ICON_SIZE = 18;

function getMenuItems(editor: BlockNoteEditor): DefaultReactSuggestionItem[] {
  const resources = [
    { name: 'My Notes', type: 'document' },
    { name: 'University', type: 'workspace' },
    { name: 'To-do', type: 'document' },
    { name: 'Work', type: 'workspace' },
  ];

  return resources.map(resource => ({
    title: resource.name,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: 'link',
          href: `/${resource.type}/${resource.name}`,
          content: [{ type: 'text', text: `@${resource.name}`, styles: {} }],
        },
        ' ',
      ]);
    },
    icon: resource.type === 'document' ? <IoIosDocument size={ICON_SIZE} /> : <FaRegFolderOpen size={ICON_SIZE} />,
  }));
}

type CustomSlashMenuProps = {
  editor: BlockNoteEditor;
};

function WorkspaceMenu({ editor }: CustomSlashMenuProps) {
  return (
    <SuggestionMenuController
      triggerCharacter={'@'}
      getItems={async query => filterSuggestionItems(getMenuItems(editor), query)}
    />
  );
}

export default WorkspaceMenu;
