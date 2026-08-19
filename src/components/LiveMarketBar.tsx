'use client';

import { useMemo } from 'react';
import { usePpeRates } from '@/hooks/usePpeRates';

const DISPLAY_RATES = [
  { id: 'conv-30', sourceId: 'conv-30', label: 'Conventional Mortgage 30-yr' },
  { id: 'conv-15', sourceId: 'conv-15', label: 'Conventional Mortgage 15-yr' },
  { id: 'fha-30', sourceId: 'fha-30', label: 'FHA 30-yr' },
  { id: 'fha-15', sourceId: 'fha-15', label: 'FHA 15-yr' },
  { id: 'rate-term', sourceId: 'conv-refi-30', label: 'Rate & Term Refi' },
  { id: 'cash-out', sourceId: 'conv-cashout-30', label: 'Cash-Out Refi' },
  { id: 'heloc', sourceId: 'heloc', label: 'HELOC' },
] as const;

export default function LiveMarketBar() {
  const { products, loading, error } = usePpeRates();

  const featuredRates = useMemo(() => {
    return DISPLAY_RATES.flatMap((displayRate) => {
      const source = products.find((item) => item.id === displayRate.sourceId);
      if (!source) return [];
      return [
        {
          id: displayRate.id,
          product: displayRate.label,
          rate: source.rate,
        },
      ];
    });
  }, [products]);

  const tickerItems = [...featuredRates, ...featuredRates];

  return (
    <div className="live-market-bar" aria-label="Live mortgage rates">
      <div className="live-market-bar__inner">
        <div className="live-market-bar__label">
          <span className="live-market-bar__pulse" aria-hidden="true" />
          <span>Live Rates</span>
        </div>
        <div className="live-market-bar__viewport">
          {error && products.length === 0 ? (
            <div className="live-market-bar__status">Live rates unavailable</div>
          ) : loading && products.length === 0 ? (
            <div className="live-market-bar__status">Loading live rates…</div>
          ) : (
            <div className="live-market-bar__track">
              {tickerItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="live-market-bar__item">
                  <span className="live-market-bar__product">{item.product}</span>
                  <span className="live-market-bar__rate">{item.rate.toFixed(3)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
