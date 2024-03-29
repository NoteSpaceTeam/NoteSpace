import { Selection } from '@notespace/shared/types/cursor';

type CursorProps = {
  selection: Selection;
  color: string;
};

function Cursor({ selection, color }: CursorProps) {
  // TODO: Get absolute position of cursor in pixels using selection and render cursor/selection accordingly
  console.log(selection);
  return (
    <div
      className="cursor"
      style={{
        position: 'absolute',
        top: `px`,
        left: `px`,
        width: '2px',
        height: '1.5em',
        backgroundColor: color,
      }}
    />
  );
}

export default Cursor;
