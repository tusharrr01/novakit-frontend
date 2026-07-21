export function formatTemplatePrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

export function getTemplateAnalyticsSummary(views: number, sales: number) {
  const rate = views > 0 ? (sales / views) * 100 : 0;
  return {
    conversionRate: `${rate.toFixed(1)}%`,
    popularity: sales > 10 ? 'High' : 'Normal',
  };
}
