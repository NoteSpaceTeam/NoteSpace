import { useEffect, useState } from 'react';
import localStorage from '@/utils/localStorage';

function useSidebarState() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [justClosed, setJustClosed] = useState(false);

  useEffect(() => {
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState !== null) {
      setIsOpen(sidebarState);
      setIsLocked(sidebarState);
    }
  }, []);

  useEffect(() => {
    if (isOpen !== isLocked) return;
    localStorage.setItem('sidebarState', isOpen);
  }, [isOpen, isLocked]);

  const handleMouseEnter = () => {
    if (justClosed) return;
    setIsOpen(true);
  };

  const handleClick = () => {
    setIsLocked(!isLocked && isOpen);
    setIsOpen(!isLocked && !isOpen);
    setJustClosed(isLocked);
    localStorage.setItem('sidebarState', isOpen);
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
