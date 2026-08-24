import React from 'react';
import { MapPin, Mail, Phone, Clock, Compass } from 'lucide-react';
import type { ContactPageSettings } from '@/types/settings';
import { PAGE_SETTINGS_DEFAULTS } from '@/types/settings';

interface Props {
  settings?: Partial<ContactPageSettings>;
}

export default function CampusInfoCard({ settings }: Props) {
  const fallback = PAGE_SETTINGS_DEFAULTS.contact;
  const address = settings?.campus_address || fallback.campus_address;
  const email = settings?.inquiries_email || fallback.inquiries_email;
  const phone = settings?.hotline_phone || fallback.hotline_phone;
  const officeHours = settings?.office_hours || fallback.office_hours;
  const transport = settings?.transport_directions || fallback.transport_directions;

  return (
    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
      <h2 className="text-xl font-bold text-slate-900 font-bangla">Campus Information</h2>

      <div className="space-y-5 text-xs font-bangla">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-campus-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-900">Address</div>
            <div className="text-slate-600 mt-0.5 whitespace-pre-line leading-relaxed">{address}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-campus-700 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Email Inquiries</div>
            <a href={`mailto:${email}`} className="text-slate-600 hover:text-campus-800 transition-colors mt-0.5 block">
              {email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-campus-700 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Hotline / Telephone</div>
            <a href={`tel:${phone}`} className="text-slate-600 hover:text-campus-800 transition-colors mt-0.5 block font-mono">
              {phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <div className="font-bold text-slate-900">Office & Visiting Hours</div>
            <div className="text-slate-600 mt-0.5">{officeHours}</div>
          </div>
        </div>

        {transport && (
          <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
            <Compass className="w-5 h-5 text-campus-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">Directions & Transport</div>
              <div className="text-slate-500 mt-0.5 leading-relaxed">{transport}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
