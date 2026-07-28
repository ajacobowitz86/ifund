'use client';

import React, { useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

type PricingOption = {
  productName: string;
  interestRate: number;
  monthlyPayment: number;
  apr: number;
};

export default function MortgagePricingForm() {
  const [loanPurpose, setLoanPurpose] = useState<'purchase' | 'rate_term' | 'cash_out'>('purchase');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [creditScore, setCreditScore] = useState<string>('');
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [cashOutAmount, setCashOutAmount] = useState<string>('');
  const [isVaLoan, setIsVaLoan] = useState<boolean>(false);
  
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [pricingResults, setPricingResults] = useState<PricingOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const onLoadAutocomplete = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setPropertyAddress(place.formatted_address);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/optimal-blue/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanPurpose,
          purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
          loanAmount: parseFloat(loanAmount),
          creditScore: parseInt(creditScore, 10),
          propertyAddress,
          cashOutAmount: cashOutAmount ? parseFloat(cashOutAmount) : 0,
          isVaLoan,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch pricing');
      
      setPricingResults(data.options);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-slate-100 my-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Price Your Loan</h2>
        
        {/* VA Loan Toggle Button on the Side */}
        <button
          type="button"
          onClick={() => setIsVaLoan(!isVaLoan)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
            isVaLoan 
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isVaLoan ? '✓ VA Loan Active' : '+ VA Loan'}
        </button>
      </div>

      {/* Loan Purpose Selection Tabs */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <button
          type="button"
          onClick={() => setLoanPurpose('purchase')}
          className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
            loanPurpose === 'purchase' 
              ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Purchase
        </button>
        <button
          type="button"
          onClick={() => setLoanPurpose('rate_term')}
          className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
            loanPurpose === 'rate_term' 
              ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Rate & Term Refi
        </button>
        <button
          type="button"
          onClick={() => setLoanPurpose('cash_out')}
          className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
            loanPurpose === 'cash_out' 
              ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Cash-Out Refi
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loanPurpose === 'purchase' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">$</span>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                  placeholder="500,000"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {loanPurpose === 'purchase' ? 'Loan Amount' : 'Requested Loan Amount'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">$</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                placeholder="400,000"
              />
            </div>
          </div>

          {loanPurpose === 'cash_out' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Cash-Out Amount Needed</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">$</span>
                <input
                  type="number"
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value)}
                  required
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                  placeholder="50,000"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Credit Score</label>
            <input
              type="number"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              required
              min="300"
              max="850"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
              placeholder="740"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Property Address</label>
          {isLoaded ? (
            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                placeholder="Enter full street address, city, state, zip"
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              placeholder="Loading Address Lookup..."
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          {loading ? 'Fetching Live Rates...' : 'Calculate Live Pricing'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {pricingResults.length > 0 && (
        <div className="mt-10 pt-6 border-t border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Live Broker Pricing Options</h3>
          <div className="space-y-4">
            {pricingResults.map((option, index) => (
              <div key={index} className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex justify-between items-center transition-all hover:border-slate-300">
                <div>
                  <h4 className="font-bold text-base text-slate-900">{option.productName}</h4>
                  <p className="text-sm text-slate-500 mt-1">Interest Rate: <span className="font-bold text-blue-600">{option.interestRate}%</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">${option.monthlyPayment} /mo</p>
                  <p className="text-xs text-slate-500 mt-1">APR: {option.apr}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
