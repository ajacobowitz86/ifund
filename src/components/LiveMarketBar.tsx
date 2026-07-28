'use client';

import { useMemo } from 'react';
import { usePpeRates } from '@/hooks/usePpeRates';
import { directionFromChange } from '@/lib/ppe-rates';

function formatSignedChange(change: number) {
  if (change === 0) return '0.000';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(3)}`;
}

export default function LiveMarketBar() {
  const { products, fetchedAt, loading, error } = usePpeRates();

  const tickerItems = useMemo(() => {
    const withMeta = products.map((item) => ({
      ...item,
      direction: directionFromChange(item.change),
    }));
    return [...withMeta, ...withMeta];
  }, [products]);

  return (
    <div className="live-market-bar" aria-label="Live PPE mortgage product rates">
      <div className="flex items-stretch">
        <div className="live-market-bar__label">
          <span className="live-market-bar__pulse" aria-hidden="true" />
          <span className="hidden sm:inline">Live PPE</span>
          <span className="sm:hidden">PPE</span>
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          {error && products.length === 0 ? (
            <div className="flex h-full items-center px-4 text-[0.7rem] text-white/70">
              PPE rates unavailable
            </div>
          ) : loading && products.length === 0 ? (
            <div className="flex h-full items-center px-4 text-[0.7rem] text-white/70">
              Loading PPE board…
            </div>
          ) : (
            <div className="live-market-bar__track">
              {tickerItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="live-market-bar__item"
                >
                  <span className="live-market-bar__product">{item.product}</span>
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
