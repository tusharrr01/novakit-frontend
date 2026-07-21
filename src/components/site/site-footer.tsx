import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Logo } from './logo';
import { useI18n } from '@/src/lib/i18n';

export function SiteFooter() {
  const { t } = useI18n();
  const columns = [
    { title: t('Product'), items: [t('Templates'), t('Admin Kit'), t('Auth Flows'), t('Pricing')] },
    { title: t('Company'), items: [t('About'), t('Changelog'), t('Contact'), t('License')] },
  ];
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-3 py-12 sm:px-4 lg:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {t(
                'AI-first templates, dashboards and starters for teams shipping serious products. Beautifully designed. Production ready.',
              )}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-brand/50 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {col.items.map((i) => (
                  <li key={i}>
                    <Link href="/" className="hover:text-foreground">
                      {i}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} NovaKit. {t('All rights reserved.')}</p>
          <p>{t('Built with care · v1.0')}</p>
        </div>
      </div>
    </footer>
  );
}
