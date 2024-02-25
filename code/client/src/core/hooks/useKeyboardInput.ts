import {useEffect, useState} from "react";

function useKeyboardInput() {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {

    const onInput = (e : InputEvent) => {
        console.log('input', e);
        const textarea = e.target as HTMLTextAreaElement;

        if(e.inputType === 'deleteContentBackward') {
            setKey('Backspace');
            return;
        }
        if (e.inputType === 'insertLineBreak') {
            setKey('Enter');
            return;
        }
        console.log('beforeinput', e, textarea.selectionStart, textarea.selectionEnd);
        setKey(e.data);
    }

    window.addEventListener('input', onInput);
    // window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('input', onInput);
      //window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return [key, setKey] as const;
}

export default useKeyboardInput;
