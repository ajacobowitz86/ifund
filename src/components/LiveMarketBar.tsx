'use client';

import { useMemo } from 'react';
import { usePpeRates } from '@/hooks/usePpeRates';
import { directionFromChange } from '@/lib/ppe-rates';

const DISPLAY_RATES = [
  {
    id: 'conventional-30',
    sourceId: 'conv-30',
    label: 'Conventional 30-Year',
    adjustment: 0,
  },
  {
    id: 'fha-30',
    sourceId: 'fha-30',
    label: 'FHA 30-Year',
    adjustment: 0,
  },
  {
    id: 'conventional-15',
    sourceId: 'conv-15',
    label: 'Conventional 15-Year',
    adjustment: 0,
  },
  {
    id: 'refinance-30',
    sourceId: 'conv-30',
    label: '30-Year Refinance',
    adjustment: 0.125,
  },
  {
    id: 'refinance-15',
    sourceId: 'conv-15',
    label: '15-Year Refinance',
    adjustment: 0.125,
  },
  {
    id: 'cash-out-30',
    sourceId: 'conv-30',
    label: '30-Year Cash-Out Refinance',
    adjustment: 0.25,
  },
  {
    id: 'cash-out-15',
    sourceId: 'conv-15',
    label: '15-Year Cash-Out Refinance',
    adjustment: 0.25,
  },
] as const;

function formatSignedChange(change: number) {
  if (change === 0) return '0.000';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(3)}`;
}

export default function LiveMarketBar() {
  const { products, fetchedAt, loading, error } = usePpeRates();

  const featuredRates = useMemo(() => {
    return DISPLAY_RATES.flatMap((displayRate) => {
      const source = products.find((item) => item.id === displayRate.sourceId);
      if (!source) return [];

      return [{
        ...source,
        id: displayRate.id,
        product: displayRate.label,
        rate: source.rate + displayRate.adjustment,
        direction: directionFromChange(source.change),
      }];
    });
  }, [products]);

  return (
    <div className="live-market-bar" aria-label="Live mortgage rates">
      <div className="live-market-bar__inner">
        <div className="live-market-bar__label">
          <span className="live-market-bar__pulse" aria-hidden="true" />
          <span>Live Rates</span>
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          {error && products.length === 0 ? (
            <div className="flex h-full items-center px-4 text-[0.7rem] text-white/70">
              Live rates unavailable
            </div>
          ) : loading && products.length === 0 ? (
            <div className="flex h-full items-center px-4 text-[0.7rem] text-white/70">
              Loading live rates…
            </div>
          ) : (
            <div className="live-market-bar__track">
              {featuredRates.map((item) => (
                <div key={item.id} className="live-market-bar__item">
                  <span className="live-market-bar__product">{item.product}</span>
                  <span className="live-market-bar__figures">
                    <span className="live-market-bar__rate">
                      {item.rate.toFixed(3)}%
                    </span>
                    <span
                      className={`live-market-bar__change live-market-bar__change--${item.direction}`}
                    >
                      {item.direction === 'up'
                        ? '▲'
                        : item.direction === 'down'
                          ? '▼'
                          : '•'}{' '}
                      {formatSignedChange(item.change)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="hidden shrink-0 items-center border-l border-white/10 px-3 text-[0.65rem] tracking-wide text-white/55 md:flex">
          {fetchedAt
            ? `Board ${fetchedAt.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })} · 24h`
            : '24h board'}
        </div>
      </div>
    </div>
  );
}
