//
// function useKeyboardInput() {
//   return (handler: (key: string) => void) => {
//     const handleInput = (ev: Event) => {
//       const e = ev as InputEvent;
//       let key: string | null = null;
//       if (e.inputType === 'deleteContentBackward') {
//         key = 'Backspace';
//       } else if (e.inputType === 'insertLineBreak') {
//         key = '\n';
//       } else if (e.data !== null) {
//         key = e.data;
//       }
//       if (key !== null) {
//         handler(key);
//       }
//     };
//
//     window.addEventListener('input', handleInput);
//     return () => {
//       window.removeEventListener('input', handleInput);
//     };
//   };
// }
//
// export default useKeyboardInput;
