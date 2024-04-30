import handlers from './mock-handlers';
import { mockServer } from '@tests/mocks/global-mocks';

export const server = mockServer(...handlers);
