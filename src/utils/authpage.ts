import type { AuthPageContent } from '@/src/lib/auth-content';

export function isAuthContentDirty(draft: AuthPageContent, remote: AuthPageContent): boolean {
  return JSON.stringify(draft) !== JSON.stringify(remote);
}
