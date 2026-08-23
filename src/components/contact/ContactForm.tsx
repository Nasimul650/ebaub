'use client';

import React, { useActionState, useEffect } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { submitContactForm } from '@/app/actions/contact';

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null);

  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById('contact-form') as HTMLFormElement;
      if (form) form.reset();
    }
  }, [state?.success]);

  return (
    <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs relative overflow-hidden">
      <h2 className="text-xl font-bold text-slate-900">Send a Message</h2>
      
      {state?.success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 mb-6 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          <div>
            <h3 className="font-bold text-sm">Message Sent!</h3>
            <p className="text-xs mt-1 text-emerald-700/80">{state.message}</p>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-xs font-bold">
          {state.error}
        </div>
      )}

      <form id="contact-form" action={formAction} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Your Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Tanvir Ahmed"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-campus-700 disabled:opacity-50"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-campus-700 disabled:opacity-50"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Subject *</label>
          <input
            type="text"
            name="subject"
            required
            placeholder="Inquiry subject..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-campus-700 disabled:opacity-50"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Message *</label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Type your message here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-campus-700 resize-y disabled:opacity-50"
            disabled={isPending}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs flex items-center gap-2 shadow transition-colors duration-300 disabled:opacity-70"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> <span>Sending...</span></>
          ) : (
            <><Send className="w-4 h-4" /> <span>Send Message</span></>
          )}
        </button>
      </form>
    </div>
  );
}
