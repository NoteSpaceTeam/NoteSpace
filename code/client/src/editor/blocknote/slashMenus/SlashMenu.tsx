import { BlockNoteEditor, filterSuggestionItems } from '@blocknote/core';
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController } from '@blocknote/react';
import menuItems from './SlashMenuItems.tsx';

function getDefaultReactSlashMenuItemsByGroup(editor: BlockNoteEditor): Record<string, DefaultReactSuggestionItem[]> {
  return {
    ...getDefaultReactSlashMenuItems(editor).reduce(
      (acc, item) => {
        if (!item.group) return acc;
        if (!acc[item.group]) {
          acc[item.group] = [];
        }
        acc[item.group].push(item);
        return acc;
      },
      {} as Record<string, DefaultReactSuggestionItem[]>
    ),
  };
}

function getCustomSlashMenuItems(editor: BlockNoteEditor): DefaultReactSuggestionItem[] {
  const customItems = menuItems.map(item => item(editor));
  const defaultItems = getDefaultReactSlashMenuItemsByGroup(editor);
  customItems.forEach(item => {
    defaultItems[item.group!].push(item);
  });
  return Object.values(defaultItems).flat();
}

type CustomSlashMenuProps = {
  editor: BlockNoteEditor;
};

function SlashMenu({ editor }: CustomSlashMenuProps) {
  return (
    <SuggestionMenuController
      triggerCharacter={'/'}
      getItems={async query => filterSuggestionItems(getCustomSlashMenuItems(editor), query)}
    />
  );
}

export default SlashMenu;
