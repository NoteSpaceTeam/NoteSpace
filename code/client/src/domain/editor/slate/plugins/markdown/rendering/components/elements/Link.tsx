import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

function Link({ children, ...props }: LinkProps) {
  return <a {...props}>{children}</a>;
}

export default Link;
