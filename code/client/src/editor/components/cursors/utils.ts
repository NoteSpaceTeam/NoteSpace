export function getCursorPosition(textarea: HTMLTextAreaElement) {
  const selectionStart = textarea.selectionStart;
  const lines = textarea.value.substring(0, selectionStart).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}
