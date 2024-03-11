enum InputType {
  "insertText",
  "insertLineBreak",
  "deleteContentBackward",
  "insertFromPaste",
}

function getInputType(inputType: string) {
  return InputType[inputType as keyof typeof InputType];
}

export { InputType, getInputType };