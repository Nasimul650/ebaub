import React from 'react';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { getSiteSettings } from '@/lib/mock/mockServices';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          Contact EBAUB
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Get in Touch with EBAUB University Administration
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          We welcome inquiries regarding admissions, departmental programs, research collaborations, and campus visits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact info card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Campus Information</h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Address</div>
                <div className="text-slate-300 mt-0.5">{settings.address}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Email Inquiries</div>
                <div className="text-slate-300 mt-0.5">{settings.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Telephone</div>
                <div className="text-slate-300 mt-0.5">{settings.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Office Hours</div>
                <div className="text-slate-300 mt-0.5">Saturday – Thursday: 9:00 AM – 5:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Send a Message</h2>

          <form className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="Inquiry subject..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Message</label>
              <textarea
                rows={4}
                placeholder="Type your message here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow transition-colors"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
