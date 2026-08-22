import React from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { SiteSettings } from '@/types';

interface Props {
  settings: SiteSettings;
}

export default function CampusInfoCard({ settings }: Props) {
  return (
    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
      <h2 className="text-xl font-bold text-slate-900">Campus Information</h2>

      <div className="space-y-4 text-xs">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-campus-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-900">Address</div>
            <div className="text-slate-600 mt-0.5">{settings.address}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-campus-700 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Email Inquiries</div>
            <div className="text-slate-600 mt-0.5">{settings.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-campus-700 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Telephone</div>
            <div className="text-slate-600 mt-0.5">{settings.phone}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Office Hours</div>
            <div className="text-slate-600 mt-0.5">Saturday – Thursday: 9:00 AM – 5:00 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
