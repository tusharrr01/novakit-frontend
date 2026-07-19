'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { useGetSettingsQuery } from '@/src/redux/api/settingsApi';
import { useAppDispatch } from '@/src/redux/hooks';
import { setSetting } from '@/src/redux/reducers/settingSlice';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

interface DynamicSettingsProviderProps {
  children: ReactNode;
}

const DEFAULT_FAVICON = '/favicon.ico';

function applyFavicon(href: string) {
  if (typeof window === 'undefined' || !href) return;
  try {
    const links = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']");
    if (links.length > 0) {
      links.forEach((link: any) => {
        link.href = href;
      });
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = href;
      document.head.appendChild(link);
    }
  } catch (error) {
    console.error('Error applying favicon:', error);
  }
}

const DynamicSettingsProvider = ({ children }: DynamicSettingsProviderProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  const { data: settingsData, isLoading } = useGetSettingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update Redux state when settings are loaded
  useEffect(() => {
    if (settingsData?.data) {
      dispatch(setSetting(settingsData.data));
    }
  }, [settingsData, dispatch]);

  // Dynamically update page title, description, favicon, and default theme
  useEffect(() => {
    if (!mounted || !settingsData?.data) return;

    const data = settingsData.data;

    // Theme Mode Config
    if (data.default_theme) {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme || savedTheme === 'system') {
        setTheme(data.default_theme);
      }
    }

    // Tab Title Config
    const baseTitle = data.site_name || 'NovaKit';
    const fullTitle = `${baseTitle} | Premium Components & Templates Marketplace`;
    if (document.title !== fullTitle) {
      document.title = fullTitle;
    }

    // Meta Description Config
    const description = data.site_description;
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    // Favicon Config
    const resolvedFavicon = data.favicon_url || DEFAULT_FAVICON;
    applyFavicon(resolvedFavicon);
  }, [settingsData, pathname, mounted, setTheme]);

  // Maintenance screen fallback
  if (mounted && settingsData?.data?.maintenance_mode) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative max-w-md w-full border border-neutral-800 rounded-3xl bg-neutral-900/60 p-8 backdrop-blur-md shadow-2xl">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-amber-500 text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">System Under Maintenance</h1>
          <p className="mt-3 text-neutral-400 text-sm leading-relaxed">
            We are currently executing scheduled upgrades to our network settings. We expect to be back online shortly. Thank you for your patience!
          </p>
          <div className="mt-8 border-t border-neutral-800 pt-6 text-[10px] text-neutral-500 tracking-wider uppercase">
            NovaKit Engine
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DynamicSettingsProvider;
export { DynamicSettingsProvider };
