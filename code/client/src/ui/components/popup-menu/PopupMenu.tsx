import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Menu, PopoverPosition } from '@mui/material';
import './PopupMenu.scss';

type PopupMenuProps = {
  item: ReactNode;
  children: ReactNode;
  trigger?: string;
  enabled?: boolean;
};

function PopupMenu({ item, trigger, children, enabled }: PopupMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<PopoverPosition | null>(null);

  const onOpen = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault();
      if (!enabled) return;
      setContextMenuPosition({
        left: event.clientX - 2,
        top: event.clientY - 4,
      });
      setAnchorEl(event.currentTarget as HTMLElement);
    },
    [enabled]
  );

  const onClose = () => {
    setAnchorEl(null);
    setContextMenuPosition(null);
  };

  useEffect(() => {
    if (!trigger) return;
    const triggerElement = document.getElementById(trigger);
    if (!triggerElement) return;
    triggerElement.addEventListener('click', onOpen);
    return () => {
      triggerElement.removeEventListener('click', onOpen);
    };
  }, [onOpen, trigger]);

  return (
    <div onContextMenu={trigger ? () => {} : onOpen} onClick={onClose}>
      {item}
      <Menu
        className="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenuPosition || undefined}
      >
        {children}
      </Menu>
    </div>
  );
}

export default PopupMenu;
