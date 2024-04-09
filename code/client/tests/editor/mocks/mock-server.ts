import handlers from './mock-handlers';
import { mockServer } from '../../mocks/global-mocks';

export const server = mockServer(...handlers);
