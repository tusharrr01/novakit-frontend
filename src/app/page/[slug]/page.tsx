import { PublicPage } from '@/src/components/page_management/PublicPage';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicPage slug={slug} />;
}
