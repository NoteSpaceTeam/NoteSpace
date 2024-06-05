import { Resource } from '@notespace/shared/src/workspace/types/resource';

export function excludeRoot(wid: string, resources: Resource[]): Resource[] {
  return resources.filter(r => r.id != wid);
}
