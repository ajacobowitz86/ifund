'use client';

import { useEffect, useMemo, useState } from 'react';

type RateDirection = 'up' | 'down' | 'flat';

type MarketRate = {
  product: string;
  rate: number;
  change: number;
  direction: RateDirection;
};

const BASE_MARKET_RATES: Omit<MarketRate, 'direction'>[] = [
  { product: 'Conventional 30-Yr', rate: 6.375, change: -0.015 },
  { product: 'Conventional 15-Yr', rate: 5.75, change: -0.01 },
  { product: 'FHA 30-Yr', rate: 6.125, change: 0.0 },
  { product: 'VA 30-Yr', rate: 5.99, change: -0.02 },
  { product: 'USDA 30-Yr', rate: 6.05, change: 0.005 },
  { product: 'Jumbo 30-Yr', rate: 6.49, change: 0.01 },
  { product: '5/6 ARM', rate: 5.875, change: -0.025 },
  { product: '7/6 ARM', rate: 5.99, change: -0.015 },
  { product: '10/6 ARM', rate: 6.125, change: 0.0 },
  { product: 'Bank Statement 30-Yr', rate: 7.125, change: 0.02 },
  { product: 'Non-QM 30-Yr', rate: 7.375, change: 0.015 },
  { product: 'HELOC Prime+', rate: 8.25, change: 0.0 },
];

function formatSignedChange(change: number) {
  if (change === 0) return '0.000';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(3)}`;
}

function withDirection(rates: Omit<MarketRate, 'direction'>[]): MarketRate[] {
  return rates.map((item) => ({
    ...item,
    direction: item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'flat',
  }));
}

export default function LiveMarketBar() {
  const [rates, setRates] = useState<MarketRate[]>(() =>
    withDirection(BASE_MARKET_RATES),
  );
  const [updatedAt, setUpdatedAt] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRates((prev) =>
        prev.map((item) => {
          const wobble = (Math.random() - 0.5) * 0.02;
          const nextChange = Number((item.change * 0.65 + wobble).toFixed(3));
          const nextRate = Number(
            Math.max(3.5, Math.min(12, item.rate + wobble)).toFixed(3),
          );
          return {
            product: item.product,
            rate: nextRate,
            change: nextChange,
            direction: nextChange > 0 ? 'up' : nextChange < 0 ? 'down' : 'flat',
          };
        }),
      );
      setUpdatedAt(new Date());
    }, 8000);

    return () => window.clearInterval(timer);
  }, []);

  const tickerItems = useMemo(() => [...rates, ...rates], [rates]);

  return (
    <div className="live-market-bar" aria-label="Live mortgage market rates">
      <div className="flex items-stretch">
        <div className="live-market-bar__label">
          <span className="live-market-bar__pulse" aria-hidden="true" />
          <span className="hidden sm:inline">Live Market</span>
          <span className="sm:hidden">Live</span>
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="live-market-bar__track">
            {tickerItems.map((item, index) => (
              <div
                key={`${item.product}-${index}`}
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
        </div>
        <div className="hidden shrink-0 items-center border-l border-white/10 px-3 text-[0.65rem] tracking-wide text-white/55 md:flex">
          As of{' '}
          {updatedAt.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
