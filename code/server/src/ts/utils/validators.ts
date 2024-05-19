import { validate } from 'uuid';
export const isValidUUID = (uuid: string): boolean => validate(uuid);

export const isValidMetaOnlyValue = (metaOnly?: string): boolean => !metaOnly || ['true', 'false'].includes(metaOnly);
