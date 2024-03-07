import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { FaListCheck } from 'react-icons/fa6';
import { DefaultReactSuggestionItem } from '@blocknote/react';

const ICON_SIZE = 18;

function checkListItem(editor: BlockNoteEditor): DefaultReactSuggestionItem {
  return {
    title: 'Check list',
    onItemClick: () => {
      const currentBlock = editor.getTextCursorPosition().block;
      const checkListBlock: PartialBlock = {
        type: 'paragraph',
        content: [{ type: 'text', text: '- [ ] ', styles: {} }],
      };
      editor.insertBlocks([checkListBlock], currentBlock, 'before');
      editor.setTextCursorPosition(editor.getTextCursorPosition().prevBlock!, 'end');
    },
    aliases: ['check', 'todo', 'task', 'checklist', 'checkbox', 'list'],
    group: 'Basic blocks',
    icon: <FaListCheck size={ICON_SIZE} />,
    subtext: 'Insert a new check list item',
  };
}

export default [checkListItem];
