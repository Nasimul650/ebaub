import React from 'react';
import { Send } from 'lucide-react';

export default function ContactForm() {
  return (
    <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
      <h2 className="text-xl font-bold text-slate-900">Send a Message</h2>

      <form className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Your Full Name</label>
            <input
              type="text"
              placeholder="e.g. Tanvir Ahmed"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Subject</label>
          <input
            type="text"
            placeholder="Inquiry subject..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Message</label>
          <textarea
            rows={4}
            placeholder="Type your message here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
          ></textarea>
        </div>

        <button
          type="button"
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow transition-colors"
        >
          <Send className="w-4 h-4 text-emerald-400" /> Send Message
        </button>
      </form>
    </div>
  );
}
