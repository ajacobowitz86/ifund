'use client';

import { useMemo } from 'react';
import { usePpeRates } from '@/hooks/usePpeRates';

const DISPLAY_RATES = [
  { id: 'conv-30', sourceId: 'conv-30', label: 'Conventional 30-Yr' },
  { id: 'conv-15', sourceId: 'conv-15', label: 'Conventional 15-Yr' },
  { id: 'fha-30', sourceId: 'fha-30', label: 'FHA 30-Yr' },
  { id: 'fha-15', sourceId: 'fha-15', label: 'FHA 15-Yr' },
  { id: 'rate-term', sourceId: 'conv-refi-30', label: 'Rate & Term Refi' },
  { id: 'cash-out', sourceId: 'conv-cashout-30', label: 'Cash-Out Refi' },
  { id: 'heloc', sourceId: 'heloc', label: 'HELOC 2nd Lien' },
] as const;

export default function LiveMarketBar() {
  const { products, loading, error, fetchedAt } = usePpeRates();

  const featuredRates = useMemo(() => {
    return DISPLAY_RATES.flatMap((displayRate) => {
      const source = products.find((item) => item.id === displayRate.sourceId);
      if (!source) return [];
      return [
        {
          id: displayRate.id,
          product: displayRate.label,
          rate: source.rate,
          change: source.change,
        },
      ];
    });
  }, [products]);

  // Duplicate for smooth seamless infinite scroll
  const tickerItems = [...featuredRates, ...featuredRates];

  return (
    <div className="live-rates-section">
      <div className="ifund-page">
        <div className="live-market-bar" aria-label="Live mortgage market rates">
          <div className="live-market-bar__inner">
            {/* Live badge header pill */}
            <div className="live-market-bar__label">
              <span className="live-market-bar__pulse" aria-hidden="true" />
              <div className="live-market-bar__label-text">
                <span className="live-market-bar__title">Live Rates</span>
                <span className="live-market-bar__tag">Optimal Blue PPE</span>
              </div>
            </div>

            {/* Scrolling / centered rate cards viewport */}
            <div className="live-market-bar__viewport">
              {error && products.length === 0 ? (
                <div className="live-market-bar__status">Live rates updating…</div>
              ) : loading && products.length === 0 ? (
                <div className="live-market-bar__status">Loading live rates…</div>
              ) : (
                <div className="live-market-bar__track">
                  {tickerItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="live-market-bar__card"
                    >
                      <span className="live-market-bar__product">{item.product}</span>
                      <div className="live-market-bar__rate-center">
                        <span className="live-market-bar__rate">{item.rate.toFixed(3)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status indicator on desktop */}
            <div className="live-market-bar__badge-end">
              <span className="live-beacon-dot" />
              <span>Real-Time PPE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
