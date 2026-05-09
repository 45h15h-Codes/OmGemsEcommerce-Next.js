"use client";

import React, { useState } from 'react';
import { useWholesaleQuotes, useSubmitQuote } from '@/hooks/useQuotes';
import { notify } from '@/lib/toast';
import {
  FileText,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Eye,
  Trash2,
  RotateCcw,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface QuoteItem {
  shape: string;
  carat_min: number;
  carat_max: number;
  color: string;
  clarity: string;
  quantity: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Quote {
  id: number;
  items: QuoteItem[];
  status: string;
  notes: string | null;
  total_estimate: number | null;
  created_at: string;
}

const quoteStatusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
  reviewing: { label: 'Under Review', icon: AlertCircle, color: 'text-blue-500 bg-blue-500/10' },
  quoted: { label: 'Quoted', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
  accepted: { label: 'Accepted', icon: CheckCircle2, color: 'text-green-500 bg-green-500/10' },
  declined: { label: 'Declined', icon: XCircle, color: 'text-red-500 bg-red-500/10' },
};

const SHAPES = ['Round', 'Princess', 'Oval', 'Cushion', 'Emerald', 'Pear', 'Marquise', 'Asscher', 'Radiant', 'Heart'];
const COLORS = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const CLARITIES = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];

export default function WholesaleQuote() {
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([
    { shape: 'Round', carat_min: 0.5, carat_max: 1.0, color: 'D', clarity: 'VS1', quantity: 10 },
  ]);

  const { data, isLoading, isError, refetch } = useWholesaleQuotes();
  const submitQuote = useSubmitQuote();

  const quotes = data?.data || [];

  const addItem = () => {
    setItems(prev => [...prev, { shape: 'Round', carat_min: 0.5, carat_max: 1.0, color: 'D', clarity: 'VS1', quantity: 5 }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitQuote.mutateAsync({ items, notes: notes || null });
      setShowForm(false);
      setItems([{ shape: 'Round', carat_min: 0.5, carat_max: 1.0, color: 'D', clarity: 'VS1', quantity: 10 }]);
      setNotes('');
      notify.success("Quote request submitted successfully");
    } catch (error: unknown) {
      notify.error("Failed to submit quote", error instanceof Error ? error.message : String(error));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 animate-pulse" />
        <LoadingSkeleton variant="table" count={3} />
      </div>
    );
  }

  if (isError) {
    return (
       <EmptyState
        title="Failed to load quotes"
        description="There was a problem fetching your quote history."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-blue-500 mb-1">
            Bulk Quotes
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Quote Requests
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Submit bulk diamond requirements and receive competitive pricing.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          New Quote Request
        </button>
      </div>

      {/* New Quote Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/20 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            New Bulk Quote Request
          </h3>

          {/* Items */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Diamond Requirements</p>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 p-4 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 block">Shape</label>
                  <select
                    value={item.shape}
                    onChange={(e) => updateItem(index, 'shape', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500"
                  >
                    {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 block">Min Carat</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.carat_min}
                    onChange={(e) => updateItem(index, 'carat_min', parseFloat(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 block">Max Carat</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.carat_max}
                    onChange={(e) => updateItem(index, 'carat_max', parseFloat(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 block">Color</label>
                  <select
                    value={item.color}
                    onChange={(e) => updateItem(index, 'color', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500"
                  >
                    {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 block">Clarity</label>
                  <select
                    value={item.clarity}
                    onChange={(e) => updateItem(index, 'clarity', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500"
                  >
                    {CLARITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1 block">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add another requirement
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special requirements, certifications, delivery preferences..."
              rows={3}
              className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitQuote.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {submitQuote.isPending ? 'Submitting...' : 'Submit Quote Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-500 text-sm font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Quote History */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">
          Quote History
        </h2>

        {quotes.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-16 text-center">
            <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No quotes yet.</p>
            <p className="text-xs text-zinc-400 mt-1">Submit your first bulk quote request to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => {
              const statusInfo = quoteStatusConfig[quote.status] || quoteStatusConfig.pending;
              const StatusIcon = statusInfo.icon;
              const totalPieces = quote.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div
                  key={quote.id}
                  className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                          Quote #{quote.id} — {quote.items.length} spec{quote.items.length > 1 ? 's' : ''}, {totalPieces} pieces
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {new Date(quote.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {quote.total_estimate && (
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          ${quote.total_estimate.toLocaleString()}
                        </span>
                      )}
                      <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", statusInfo.color)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="flex flex-wrap gap-2 mt-3 pl-14">
                    {quote.items.map((item, i) => (
                      <span key={i} className="inline-flex px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                        {item.quantity}× {item.shape} {item.carat_min}-{item.carat_max}ct {item.color}/{item.clarity}
                      </span>
                    ))}
                  </div>

                  {quote.notes && (
                    <p className="text-xs text-zinc-400 mt-2 pl-14 italic">&ldquo;{quote.notes}&rdquo;</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
