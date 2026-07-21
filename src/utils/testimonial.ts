import type { Testimonial } from '@/src/lib/site-content';

export function newTestimonialId(): string {
  return `test_${Date.now()}`;
}

export function exportTestimonialsCsv(filtered: Testimonial[]) {
  const rows = [
    ['id', 'name', 'role', 'company', 'quote', 'rating', 'published', 'featured'],
    ...filtered.map((t) => [
      t.id,
      t.name,
      t.role,
      t.company,
      t.quote,
      String(t.rating),
      String(t.published),
      String(t.featured),
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'testimonials.csv';
  a.click();
  URL.revokeObjectURL(url);
}
