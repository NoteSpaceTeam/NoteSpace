import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';


afterEach(cleanup);

function setup(ui: ReactElement, options = {}) {
  return {
    user: userEvent.setup(),
    render: customRender(ui, options),
  };
}

function customRender(ui: ReactElement, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
}

export * from '@testing-library/react';
export { setup, customRender as render, userEvent };
