import handlers from './mock-handlers.ts';
import { mockServer } from '@tests/mocks/global-mocks.ts';

export const server = mockServer(...handlers);
