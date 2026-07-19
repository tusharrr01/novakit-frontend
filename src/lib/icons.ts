import * as Lucide from 'lucide-react';

export function getIconComponent(name?: string) {
  if (!name) return Lucide.HelpCircle;
  // Look up icon in Lucide namespace
  const Component = (Lucide as any)[name];
  return Component || Lucide.HelpCircle;
}

export default getIconComponent;
