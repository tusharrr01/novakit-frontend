'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/src/redux/store';
import '@/src/lib/i18n';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
