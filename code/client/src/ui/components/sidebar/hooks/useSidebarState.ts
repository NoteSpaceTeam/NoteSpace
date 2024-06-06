import { useEffect, useState } from 'react';
import localStorage from '@/utils/localStorage';

const DEFAULT_WIDTH = 20;
const MIN_WIDTH = 0;
const MAX_WIDTH = 40;

function useSidebarState() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [justClosed, setJustClosed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setWidth(isOpen ? DEFAULT_WIDTH : 0);
  }, [isOpen]);

  useEffect(() => {
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState !== null) {
      setIsOpen(sidebarState);
      setIsLocked(sidebarState);
      setIsLoaded(true);
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

  const handleMouseMove = (e: MouseEvent) => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const rect = sidebar.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / window.innerWidth) * 100;
      if (newWidth > MIN_WIDTH && newWidth < MAX_WIDTH) {
        setWidth(newWidth);
      }
    }
  };

  const handleMouseDown = () => {
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.body.style.pointerEvents = 'none';
  };

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.body.style.pointerEvents = 'auto';
  };

  return {
    width: `${width}%`,
    isOpen,
    isLocked,
    isLoaded,
    handlers: {
      handleMouseEnter,
      handleClick,
      handleMouseLeave,
      handleMouseDown,
    },
  };
}

export default useSidebarState;
