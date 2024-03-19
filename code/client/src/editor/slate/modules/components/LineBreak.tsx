import React from "react";

interface LineBreakProps extends React.HTMLAttributes<HTMLHRElement> {}

function LineBreak(props: LineBreakProps) {
  return (
    <div {...props}>
      <hr />
      {props.children}
    </div>
  );
}

export default LineBreak;
