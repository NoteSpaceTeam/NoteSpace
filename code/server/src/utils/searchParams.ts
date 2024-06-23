import { InvalidParameterError } from '@domain/errors/errors';

const DEFAULT_QUERY = '';
const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 10;

export type SearchParams = {
  query: string;
  skip: number;
  limit: number;
};

export function getSearchParams(params: Record<string, any> = {}): SearchParams {
  const { query, skip, limit } = params;
  if ([query, skip, limit].some(param => param !== undefined && typeof param !== 'string')) {
    throw new InvalidParameterError('Invalid search params');
  }
  return {
    query: query ?? DEFAULT_QUERY,
    skip: parseInt(skip ?? '') || DEFAULT_SKIP,
    limit: parseInt(limit ?? '') || DEFAULT_LIMIT,
  };
}
