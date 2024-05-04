import { MouseEvent, ReactNode, useState } from 'react';
import { Menu, PopoverPosition } from '@mui/material';
import './ContextMenu.scss';

type ContextMenuProps = {
  item: ReactNode;
  children: ReactNode;
};

function ContextMenu({ item, children }: ContextMenuProps) {
  const [mousePosition, setMousePosition] = useState<PopoverPosition | null>(null);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (mousePosition !== null) return; // don't show context menu if it's already open
    e.preventDefault();
    setMousePosition({
      left: e.clientX - 2,
      top: e.clientY - 4,
    });
  };

  const handleClose = () => {
    setMousePosition(null);
  };

  return (
    <div onContextMenu={handleClick}>
      {item}
      <Menu
        className="menu"
        open={mousePosition !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={mousePosition || undefined}
        keepMounted
      >
        <div className="context-menu">{children}</div>
      </Menu>
    </div>
  );
}

export default ContextMenu;
