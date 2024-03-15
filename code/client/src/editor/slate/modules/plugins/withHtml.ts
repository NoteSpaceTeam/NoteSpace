import { Editor, Element, Transforms } from 'slate';
import htmlToSlate from '@src/editor/slate/modules/markdown/htmlToSlate.ts';

function withHtml<T extends Editor>(editor: T) {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element: Element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = (element: Element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data: DataTransfer) => {
    const html = data.getData('text/plain');
    if (html) {
      const fragment = htmlToSlate(html);
      Transforms.insertFragment(editor, fragment);
      return;
    }
    insertData(data);
  };
  return editor;
}

export default withHtml;
