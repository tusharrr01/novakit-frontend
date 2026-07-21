'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, ShoppingBag, UserPlus, CreditCard, AlertTriangle, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/elements/ui/popover';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  createdAt: number;
  read: boolean;
  type: 'order' | 'user' | 'payment' | 'alert';
};

const STORAGE_KEY = 'admin.notifications.v1';

const seed: Notification[] = [
  {
    id: 'n1',
    type: 'order',
    title: 'New order received',
    description: 'Order #10482 was placed for $129.00',
    time: '2m ago',
    createdAt: Date.now() - 2 * 60_000,
    read: false,
  },
  {
    id: 'n2',
    type: 'user',
    title: 'New user signed up',
    description: 'sarah.miller@example.com just joined',
    time: '18m ago',
    createdAt: Date.now() - 18 * 60_000,
    read: false,
  },
  {
    id: 'n3',
    type: 'payment',
    title: 'Payment successful',
    description: 'Stripe payout of $2,340 completed',
    time: '1h ago',
    createdAt: Date.now() - 60 * 60_000,
    read: false,
  },
  {
    id: 'n4',
    type: 'alert',
    title: 'Low stock warning',
    description: '"Aurora Hoodie" has only 3 units left',
    time: '4h ago',
    createdAt: Date.now() - 4 * 60 * 60_000,
    read: true,
  },
];

const iconFor = (t: Notification['type']) => {
  switch (t) {
    case 'order': return ShoppingBag;
    case 'user': return UserPlus;
    case 'payment': return CreditCard;
    case 'alert': return AlertTriangle;
  }
};

const toneFor = (t: Notification['type']) => {
  switch (t) {
    case 'order': return 'bg-brand/15 text-brand';
    case 'user': return 'bg-blue-500/15 text-blue-500';
    case 'payment': return 'bg-emerald-500/15 text-emerald-500';
    case 'alert': return 'bg-amber-500/15 text-amber-500';
  }
};

export function NotificationsBell() {
  const [items, setItems] = useState<Notification[]>(seed);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const unread = useMemo(() => items.filter(i => !i.read).length, [items]);

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })));
  const markRead = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i));
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearAll = () => setItems([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition hover:bg-muted"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Notifications</div>
            <div className="text-xs text-muted-foreground">
              {unread > 0 ? `${unread} unread` : "You're all caught up"}
            </div>
          </div>
          <button
            onClick={markAllRead}
            disabled={unread === 0}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <div className="rounded-full bg-muted p-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">No notifications</div>
              <div className="text-xs text-muted-foreground">You'll see updates here.</div>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const Icon = iconFor(n.type);
                return (
                  <li
                    key={n.id}
                    className={`group relative flex gap-3 px-4 py-3 transition hover:bg-muted/60 ${!n.read ? 'bg-brand/5' : ''}`}
                  >
                    <div className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneFor(n.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <button
                      onClick={() => markRead(n.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{n.title}</span>
                        {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
                      </div>
                      <div className="line-clamp-2 text-xs text-muted-foreground">{n.description}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{n.time}</div>
                    </button>
                    <button
                      onClick={() => remove(n.id)}
                      aria-label="Dismiss"
                      className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-background hover:text-foreground group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-4 py-2 text-right">
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
