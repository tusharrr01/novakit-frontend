'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Calendar, Type, Palette, Sun, Moon, Check, User } from 'lucide-react';
import type { FestivalVariant, AnnouncementsSettings } from '@/src/lib/announcements';
import { Toggle, LabeledInput, LabeledTextarea, LabeledColor } from './FormElements';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/elements/ui/select';

export function FestivalEditor({
  draft,
  setDraft,
}: {
  draft: AnnouncementsSettings;
  setDraft: (v: AnnouncementsSettings) => void;
}) {
  const festivalData = draft.popup.festival || {
    activeFestivalId: 'diwali',
    festivals: [],
  };

  const festivals = festivalData.festivals || [];
  const activeFestivalId = festivalData.activeFestivalId || (festivals[0]?.id || '');
  const activeFestival = festivals.find((f) => f.id === activeFestivalId) || festivals[0];

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFestName, setNewFestName] = useState('');
  const [newFestDate, setNewFestDate] = useState('10-24');

  const patchFestival = (patch: Partial<FestivalVariant>) => {
    if (!activeFestival) return;
    const updated = festivals.map((f) => (f.id === activeFestival.id ? { ...f, ...patch } : f));
    setDraft({
      ...draft,
      popup: {
        ...draft.popup,
        festival: {
          ...festivalData,
          festivals: updated,
        },
      },
    });
  };

  const setActiveId = (id: string) => {
    setDraft({
      ...draft,
      popup: {
        ...draft.popup,
        festival: {
          ...festivalData,
          activeFestivalId: id,
        },
      },
    });
  };

  const handleAddFestival = () => {
    if (!newFestName.trim()) return;
    const id = newFestName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const newFestival: FestivalVariant = {
      id,
      name: newFestName.trim(),
      date: newFestDate.trim() || '11-01',
      enabled: true,
      title: `🪔 Happy ${newFestName.trim()}, {name}! ✨`,
      body: `Wishing you a joyful ${newFestName.trim()}! Enjoy our special offers today.`,
      ctaLabel: 'Explore Offers',
      ctaUrl: '/products',
      accentColor: '#f59e0b',
      darkAccentColor: '#fbbf24',
    };

    const updated = [...festivals, newFestival];
    setDraft({
      ...draft,
      popup: {
        ...draft.popup,
        festival: {
          activeFestivalId: id,
          festivals: updated,
        },
      },
    });

    setNewFestName('');
    setIsAddingNew(false);
  };

  const handleRemoveFestival = (id: string) => {
    if (festivals.length <= 1) return;
    const updated = festivals.filter((f) => f.id !== id);
    const nextActive = updated[0]?.id || '';
    setDraft({
      ...draft,
      popup: {
        ...draft.popup,
        festival: {
          activeFestivalId: nextActive,
          festivals: updated,
        },
      },
    });
  };

  const insertNamePlaceholder = (field: 'title' | 'body') => {
    if (!activeFestival) return;
    const currentVal = activeFestival[field] || '';
    if (currentVal.includes('{name}')) return;
    patchFestival({ [field]: `${currentVal} {name}`.trim() });
  };

  if (!activeFestival) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header Selector Bar */}
      <div className="admin-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Select Festival Template</h3>
              <p className="text-xs text-muted-foreground">
                Choose a festival to configure its date trigger, title, body, and colors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Festival Dropdown */}
            <Select value={activeFestival.id} onValueChange={setActiveId}>
              <SelectTrigger className="w-56 h-10 border-border bg-background">
                <SelectValue placeholder="Select festival" />
              </SelectTrigger>
              <SelectContent>
                {festivals.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="cursor-pointer py-2.5 pl-2.5 pr-10 my-1 rounded-lg">
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="font-medium text-sm">{f.name}</span>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded font-mono">
                        {f.date}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add New Festival Button */}
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand/10 border border-brand/20 px-3.5 text-xs font-semibold text-brand hover:bg-brand/20 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Festival
            </button>
          </div>
        </div>

        {/* Add New Festival Inline Form */}
        {isAddingNew && (
          <div className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand">Create New Festival Template</h4>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <LabeledInput
                  label="Festival Name"
                  value={newFestName}
                  onChange={setNewFestName}
                  placeholder="e.g. Holi, Eid, Halloween..."
                />
              </div>
              <div>
                <LabeledInput
                  label="Trigger Date (MM-DD)"
                  value={newFestDate}
                  onChange={setNewFestDate}
                  placeholder="e.g. 03-25 or 11-01"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleAddFestival}
                disabled={!newFestName.trim()}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-gradient px-4 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" /> Save Festival
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Festival Config Form */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Content & Trigger Date */}
        <div className="admin-card p-5 lg:col-span-2 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Type className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{activeFestival.name} Configuration</h3>
                <p className="text-xs text-muted-foreground">
                  Triggers automatically on arrival when today's date matches the festival date.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Toggle
                checked={activeFestival.enabled}
                onChange={(v) => patchFestival({ enabled: v })}
                label={activeFestival.enabled ? 'Enabled' : 'Disabled'}
              />
              {festivals.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFestival(activeFestival.id)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <LabeledInput
                label="Festival Name"
                value={activeFestival.name}
                onChange={(v) => patchFestival({ name: v })}
              />
            </div>
            <div>
              <LabeledInput
                label="Trigger Date (MM-DD or YYYY-MM-DD)"
                value={activeFestival.date}
                onChange={(v) => patchFestival({ date: v })}
                placeholder="11-01"
              />
            </div>
            <div className="flex items-end pb-1 text-xs text-muted-foreground">
              <span>📅 Shows only on this exact date (24h).</span>
            </div>
          </div>

          {/* Title & Body */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-foreground">Title</label>
                <button
                  type="button"
                  onClick={() => insertNamePlaceholder('title')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline cursor-pointer"
                >
                  <User className="h-3 w-3" /> Insert &#123;name&#125; variable
                </button>
              </div>
              <input
                type="text"
                value={activeFestival.title}
                onChange={(e) => patchFestival({ title: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-foreground">Body</label>
                <button
                  type="button"
                  onClick={() => insertNamePlaceholder('body')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline cursor-pointer"
                >
                  <User className="h-3 w-3" /> Insert &#123;name&#125; variable
                </button>
              </div>
              <textarea
                rows={3}
                value={activeFestival.body}
                onChange={(e) => patchFestival({ body: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledInput
                label="CTA label"
                value={activeFestival.ctaLabel}
                onChange={(v) => patchFestival({ ctaLabel: v })}
              />
              <LabeledInput
                label="CTA URL"
                value={activeFestival.ctaUrl}
                onChange={(v) => patchFestival({ ctaUrl: v })}
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="admin-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Palette className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Appearance</h3>
              <p className="text-xs text-muted-foreground">Accent color used by the popup in light and dark mode.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4 bg-background/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                <Sun className="h-3.5 w-3.5 text-amber-500" /> Light Mode Accent
              </div>
              <LabeledColor
                label="Accent color"
                value={activeFestival.accentColor || '#f59e0b'}
                onChange={(v) => patchFestival({ accentColor: v })}
              />
            </div>
            <div className="rounded-xl border border-border p-4 bg-background/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                <Moon className="h-3.5 w-3.5 text-indigo-400" /> Dark Mode Accent
              </div>
              <LabeledColor
                label="Accent color"
                value={activeFestival.darkAccentColor || activeFestival.accentColor || '#fbbf24'}
                onChange={(v) => patchFestival({ darkAccentColor: v })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
