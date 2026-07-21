import { useEffect, useState } from 'react';

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  rating: number; // 1-5
  featured: boolean;
  published: boolean;
};

const FAQ_KEY = 'novakit:faqs';
const TEST_KEY = 'novakit:testimonials';
const EVENT = 'novakit:site-content-changed';

const faqSeed: Faq[] = [
  {
    id: 'f1',
    question: 'What do I get with a NovaKit license?',
    answer:
      'You get every template, dashboard and auth flow in the kit, including future updates and access to AI blocks — all with a commercial license.',
    category: 'Licensing',
    published: true,
    order: 1,
  },
  {
    id: 'f2',
    question: 'Can I use NovaKit for client projects?',
    answer:
      'Yes. The Pro and Studio plans include a commercial license so you can ship client work without restrictions.',
    category: 'Licensing',
    published: true,
    order: 2,
  },
  {
    id: 'f3',
    question: 'Do you offer refunds?',
    answer: 'We offer a 14-day money-back guarantee — no questions asked.',
    category: 'Billing',
    published: true,
    order: 3,
  },
  {
    id: 'f4',
    question: 'Which frameworks are supported?',
    answer:
      'NovaKit ships with React, Next.js, and Tailwind out of the box, and works with any modern bundler.',
    category: 'Product',
    published: true,
    order: 4,
  },
  {
    id: 'f5',
    question: 'Is there a free tier?',
    answer:
      'Yes — the Starter plan is free forever and includes 3 templates and community support.',
    category: 'Pricing',
    published: true,
    order: 5,
  },
];

const testimonialSeed: Testimonial[] = [
  {
    id: 't1',
    name: 'Sofia Martins',
    role: 'Design Engineer',
    company: 'Vertex Labs',
    quote:
      'NovaKit collapsed weeks of work into a single evening. The design system alone is worth the price.',
    rating: 5,
    featured: true,
    published: true,
  },
  {
    id: 't2',
    name: 'Daniel Okafor',
    role: 'Founder',
    company: 'Palette AI',
    quote:
      'We launched our admin dashboard in 48 hours. The AI blocks felt like they were built for our product.',
    rating: 5,
    featured: true,
    published: true,
  },
  {
    id: 't3',
    name: 'Amelia Chen',
    role: 'Head of Product',
    company: 'Northwind',
    quote:
      'The auth flows are the cleanest I\'ve used. Our conversion on sign-up jumped 22% overnight.',
    rating: 5,
    featured: true,
    published: true,
  },
  {
    id: 't4',
    name: 'Marcus Reyes',
    role: 'Indie hacker',
    company: 'Solo',
    quote:
      'Beautiful, thoughtful defaults. NovaKit lets me focus on the product, not the plumbing.',
    rating: 4,
    featured: false,
    published: true,
  },
];

function readFaqs(): Faq[] {
  if (typeof window === 'undefined') return faqSeed;
  try {
    const raw = window.localStorage.getItem(FAQ_KEY);
    return raw ? (JSON.parse(raw) as Faq[]) : faqSeed;
  } catch {
    return faqSeed;
  }
}

function readTestimonials(): Testimonial[] {
  if (typeof window === 'undefined') return testimonialSeed;
  try {
    const raw = window.localStorage.getItem(TEST_KEY);
    return raw ? (JSON.parse(raw) as Testimonial[]) : testimonialSeed;
  } catch {
    return testimonialSeed;
  }
}

function notify() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT));
}

export const faqStore = {
  list: readFaqs,
  save(list: Faq[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAQ_KEY, JSON.stringify(list));
      notify();
    }
  },
  upsert(item: Faq) {
    const list = readFaqs();
    const idx = list.findIndex((f) => f.id === item.id);
    const next = idx >= 0 ? list.map((f) => (f.id === item.id ? item : f)) : [...list, item];
    this.save(next);
  },
  remove(id: string) {
    this.save(readFaqs().filter((f) => f.id !== id));
  },
};

export const testimonialStore = {
  list: readTestimonials,
  save(list: Testimonial[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEST_KEY, JSON.stringify(list));
      notify();
    }
  },
  upsert(item: Testimonial) {
    const list = readTestimonials();
    const idx = list.findIndex((t) => t.id === item.id);
    const next = idx >= 0 ? list.map((t) => (t.id === item.id ? item : t)) : [...list, item];
    this.save(next);
  },
  remove(id: string) {
    this.save(readTestimonials().filter((t) => t.id !== id));
  },
};

export function useFaqs() {
  const [items, setItems] = useState<Faq[]>([]);
  useEffect(() => {
    const sync = () => setItems(readFaqs());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return items;
}

export function useTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  useEffect(() => {
    const sync = () => setItems(readTestimonials());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return items;
}

export function newFaqId() {
  return `f_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

export function newTestimonialId() {
  return `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}
