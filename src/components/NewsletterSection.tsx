import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('weekly');
  const [status, setStatus] = useState<'idle' | 'subscribed'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('subscribed');
  };

  return (
    <section className="my-14 border border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/70 p-6 sm:p-10 rounded-sm transition-colors">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
          Critical Eye Dispatch
        </span>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-2 mb-3 tracking-tight">
          Essential Ghanaian & African Health Intelligence, Delivered
        </h2>

        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
          Receive rigorous, evidence-based reporting on healthcare policies, pharmaceutical safety, clinical breakthroughs, and public health investigations directly in your inbox.
        </p>

        {status === 'subscribed' ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-900 dark:text-emerald-200 text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <span>Thank you for subscribing! A confirmation briefing has been dispatched to <strong>{email}</strong>.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your professional email address"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-amber-800 dark:focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs sm:text-sm rounded transition-colors shrink-0"
              >
                Subscribe
              </button>
            </div>

            {/* Frequency selection and privacy note */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="freq"
                    checked={frequency === 'weekly'}
                    onChange={() => setFrequency('weekly')}
                    className="accent-amber-800 dark:accent-amber-500"
                  />
                  <span>Weekly Digest</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="freq"
                    checked={frequency === 'daily'}
                    onChange={() => setFrequency('daily')}
                    className="accent-amber-800 dark:accent-amber-500"
                  />
                  <span>Breaking Health Alerts</span>
                </label>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero spam · Instant unsubscribe</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
