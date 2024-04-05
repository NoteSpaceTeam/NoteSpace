import handlers from './handlers';
import { mockServer } from '../../mocks/global-mocks';

export const server = mockServer(...handlers);
