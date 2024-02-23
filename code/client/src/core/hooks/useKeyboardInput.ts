import {useEffect, useState} from "react";

function useKeyboardInput() {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      setKey(e.key);
    };

    const onKeyUp = () => {
      setKey(null);
    };

    window.addEventListener('keypress', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keypress', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return [key, setKey] as const;
}

export default useKeyboardInput;
