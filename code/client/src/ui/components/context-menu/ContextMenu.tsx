import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Menu, PopoverPosition } from '@mui/material';
import './ContextMenu.scss';

type ContextMenuProps = {
  item: ReactNode;
  children: ReactNode;
  trigger?: string;
};

function ContextMenu({ item, children, trigger }: ContextMenuProps) {
  const [mousePosition, setMousePosition] = useState<PopoverPosition | null>(null);

  const onOpenMenu = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
      if (mousePosition !== null) {
        // don't show context menu if it's already open
        setMousePosition(null);
        return;
      }
      e.preventDefault();
      setMousePosition({
        left: e.clientX - 2,
        top: e.clientY - 4,
      });
    },
    [mousePosition]
  );

  useEffect(() => {
    if (!trigger) return;

    const triggerButtons = document.querySelectorAll(`.${trigger}`);

    triggerButtons.forEach(triggerButton => {
      (triggerButton as HTMLElement).addEventListener('click', onOpenMenu);
    });

    return () => {
      triggerButtons.forEach(triggerButton => {
        (triggerButton as HTMLElement).removeEventListener('click', onOpenMenu);
      });
    };
  }, [onOpenMenu, trigger]);

  function onClose() {
    console.log('onClose');
    setMousePosition(null);
  }

  return (
    <div onContextMenu={trigger ? undefined : onOpenMenu}>
      {item}
      <Menu
        className="menu"
        open={mousePosition !== null}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={mousePosition || undefined}
        keepMounted
      >
        <div className="menu-items">{children}</div>
      </Menu>
    </div>
  );
}

export default ContextMenu;
