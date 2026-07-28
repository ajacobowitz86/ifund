'use client';

import { useEffect, useState } from 'react';
import type { PpeProduct, PpeRatesPayload } from '@/lib/ppe-rates';

type UsePpeRatesState = {
  products: PpeProduct[];
  fetchedAt: Date | null;
  expiresAt: Date | null;
  source: PpeRatesPayload['source'] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function usePpeRates(): UsePpeRatesState {
  const [products, setProducts] = useState<PpeProduct[]>([]);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [source, setSource] = useState<PpeRatesPayload['source'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ppe/rates', { method: 'GET' });
        const data = (await response.json()) as PpeRatesPayload & {
          message?: string;
        };

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load PPE rates');
        }

        if (cancelled) return;

        setProducts(data.products);
        setFetchedAt(new Date(data.fetchedAt));
        setExpiresAt(new Date(data.expiresAt));
        setSource(data.source);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load PPE rates');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return {
    products,
    fetchedAt,
    expiresAt,
    source,
    loading,
    error,
    refresh: () => setTick((n) => n + 1),
  };
}
