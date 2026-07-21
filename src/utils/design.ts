export function newDesignId(): string {
  return `design_${Date.now()}`;
}

export function formatDesignCategory(category: string): string {
  return category.toUpperCase();
}
