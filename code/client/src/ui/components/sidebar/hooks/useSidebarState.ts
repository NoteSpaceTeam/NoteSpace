import { useState } from 'react';

function useSidebarState() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [justClosed, setJustClosed] = useState(false);

  const handleMouseEnter = () => {
    if (justClosed) return;
    setIsOpen(true);
  };

  const handleClick = () => {
    setIsLocked(!isLocked && isOpen);
    setIsOpen(!isLocked && !isOpen);
    setJustClosed(isLocked);
  };

  const handleMouseLeave = () => {
    if (isLocked) return;
    setIsOpen(false);
    setJustClosed(false);
  };

  return {
    isOpen,
    isLocked,
    handleMouseEnter,
    handleClick,
    handleMouseLeave,
  };
}

export default useSidebarState;
