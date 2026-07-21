import type { Faq } from '@/src/lib/site-content';

export function newFaqId(): string {
  return `faq_${Date.now()}`;
}

export function exportFaqsCsv(filtered: Faq[]) {
  const rows = [
    ['id', 'question', 'answer', 'category', 'order', 'published'],
    ...filtered.map((f) => [f.id, f.question, f.answer, f.category, String(f.order), String(f.published)]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'faqs.csv';
  a.click();
  URL.revokeObjectURL(url);
}
