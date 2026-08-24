export interface HeroSettings {
  headline: string;
  subtitle: string;
  video_url?: string;
  fallback_image_url?: string;
  badge_text?: string;
}

export interface GeneralSettings {
  site_name: string;
  short_name: string;
  tagline: string;
  meta_description: string;
  accreditation: string;
}

export interface ContactSettings {
  campus_address: string;
  inquiries_email: string;
  admissions_email?: string;
  hotline_phone: string;
  admissions_phone?: string;
  office_hours: string;
}

export interface SocialSettings {
  facebook_url: string;
  linkedin_url: string;
  youtube_url: string;
  student_portal_url: string;
  teacher_portal_url: string;
}

export interface GlobalSiteSettings {
  hero: HeroSettings;
  general: GeneralSettings;
  contact: ContactSettings;
  socials: SocialSettings;
}

export const DEFAULT_SITE_SETTINGS: GlobalSiteSettings = {
  hero: {
    headline: 'Empowering the next generation of engineers.',
    subtitle: 'EXIM Bank Agricultural University Bangladesh (EBAUB) combines academic excellence, hands-on learning, and state-of-the-art research in engineering, agriculture, and business to shape leaders for tomorrow.',
    video_url: '',
    fallback_image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    badge_text: 'Excellence in Higher Education'
  },
  general: {
    site_name: 'EXIM Bank Agricultural University Bangladesh',
    short_name: 'EBAUB',
    tagline: 'Excellence in Agricultural Sciences, Engineering & Business',
    meta_description: 'Official portal of EXIM Bank Agricultural University Bangladesh (EBAUB). Explore undergraduate & graduate programs in CSE, Agriculture, Business, and Law.',
    accreditation: "Approved by UGC & Ministry of Education, Govt. of the People's Republic of Bangladesh"
  },
  contact: {
    campus_address: '69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh',
    inquiries_email: 'info@ebaub.edu.bd',
    admissions_email: 'admission@ebaub.edu.bd',
    hotline_phone: '02-588893525',
    admissions_phone: '02-588893526 to 29',
    office_hours: 'Sunday - Thursday: 9:00 AM - 5:00 PM (Friday & Saturday Closed)'
  },
  socials: {
    facebook_url: 'https://www.facebook.com/ebaub.chapai',
    linkedin_url: 'https://www.linkedin.com/company/ebaub',
    youtube_url: 'https://www.youtube.com/@ebaub',
    student_portal_url: '/student',
    teacher_portal_url: '/teacher'
  }
};
