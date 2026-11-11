import React, { useEffect, useState } from 'react';
import { Inbox, MessageCircle, Phone, Mail, RefreshCw } from 'lucide-react';
import { fetchInquiries, updateInquiryStatus, type Inquiry } from '../../services/api';

const TYPE_LABEL: Record<Inquiry['type'], string> = {
  contact: 'Contact form',
  bulk: 'Bulk order',
  training: 'Training'
};

const STATUSES: Inquiry['status'][] = ['New', 'Contacted', 'Closed'];

function waLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return null;
  return `https://wa.me/${digits.length === 10 ? '91' + digits : digits}`;
}

export const InquiriesTab: React.FC<{ onCountChange?: (newCount: number) => void }> = ({ onCountChange }) => {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Inquiry['status']>('all');

  const load = async () => {
    setLoading(true);
    const data = await fetchInquiries();
    setItems(data);
    onCountChange?.(data.filter((i) => i.status === 'New').length);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await updateInquiryStatus(id, status);
      const next = items.map((i) => (i.id === id ? { ...i, status } : i));
      setItems(next);
      onCountChange?.(next.filter((i) => i.status === 'New').length);
    } catch (err: any) {
      window.alert(err?.message || 'Could not update inquiry.');
    }
  };

  const shown = filter === 'all' ? items : items.filter((i) => i.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Customer Inquiries</h2>
          <span className="text-xs text-slate-400">({items.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {(['all', ...STATUSES] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === f ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
          <button
            onClick={load}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            aria-label="Refresh inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading inquiries…</p>
      ) : shown.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-800/60 border border-slate-700 text-sm text-slate-400">
          No inquiries yet. Messages from the Contact, Bulk Order and Training forms appear here.
        </div>
      ) : (
        <div className="grid gap-3">
          {shown.map((q) => {
            const wa = q.phone ? waLink(q.phone) : null;
            return (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-bold uppercase">
                      {TYPE_LABEL[q.type] || q.type}
                    </span>
                    <span className="font-bold text-white truncate">{q.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(q.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
                  {q.phone && (
                    <a href={`tel:${q.phone}`} className="inline-flex items-center gap-1 hover:text-white">
                      <Phone className="w-3.5 h-3.5" /> {q.phone}
                    </a>
                  )}
                  {q.email && (
                    <a href={`mailto:${q.email}`} className="inline-flex items-center gap-1 hover:text-white break-all">
                      <Mail className="w-3.5 h-3.5" /> {q.email}
                    </a>
                  )}
                </div>

                {Object.keys(q.details || {}).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(q.details).map(([k, v]) =>
                      v ? (
                        <span key={k} className="px-2 py-0.5 rounded-md bg-slate-900 text-[11px] text-slate-300 border border-slate-700">
                          {k}: {v}
                        </span>
                      ) : null
                    )}
                  </div>
                )}

                {q.message && <p className="text-xs text-slate-200 whitespace-pre-wrap">{q.message}</p>}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                  <select
                    value={q.status}
                    onChange={(e) => setStatus(q.id, e.target.value as Inquiry['status'])}
                    className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    aria-label="Inquiry status"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
