// ============================================================
// PAGE-BASED SITE SETTINGS TYPE DEFINITIONS & DEFAULTS
// ============================================================

export interface GlobalFooterSettings {
  site_name: string;
  short_name: string;
  tagline: string;
  accreditation: string;
  campus_address: string;
  inquiries_email: string;
  admissions_email?: string;
  hotline_phone: string;
  admissions_phone?: string;
  office_hours: string;
  facebook_url: string;
  linkedin_url: string;
  youtube_url: string;
  student_portal_url: string;
  teacher_portal_url: string;
}

export interface HomePageSettings {
  badge_text: string;
  hero_headline: string;
  hero_subtitle: string;
  hero_video_url?: string;
  hero_fallback_image_url?: string;
  explore_cta_text?: string;
  admissions_cta_text?: string;
  accreditation_metric?: string;
  curriculum_metric?: string;
}

export interface AcademicsPageSettings {
  header_badge: string;
  header_headline: string;
  header_description: string;
  advising_contact_email?: string;
  curriculum_overview_text?: string;
}

export interface AdmissionsPageSettings {
  header_badge: string;
  header_headline: string;
  header_description: string;
  apply_cta_text: string;
  deadline_highlight_text: string;
  financial_aid_snippet: string;
  admissions_hotline?: string;
  admissions_email?: string;
}

export interface FacultyPageSettings {
  header_badge: string;
  header_headline: string;
  header_description: string;
  join_faculty_notice: string;
  research_focus_text?: string;
}

export interface StudentLifePageSettings {
  header_badge: string;
  header_headline: string;
  header_description: string;
  clubs_highlight_text: string;
  facilities_snippet: string;
}

export interface ContactPageSettings {
  header_badge: string;
  header_headline: string;
  header_description: string;
  campus_address: string;
  inquiries_email: string;
  hotline_phone: string;
  admissions_phone?: string;
  office_hours: string;
  transport_directions?: string;
}

// Backward compatibility alias for legacy components
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

export const PAGE_SETTINGS_DEFAULTS: {
  global_footer: GlobalFooterSettings;
  home: HomePageSettings;
  academics: AcademicsPageSettings;
  admissions: AdmissionsPageSettings;
  faculty: FacultyPageSettings;
  student_life: StudentLifePageSettings;
  contact: ContactPageSettings;
} = {
  global_footer: {
    site_name: 'EXIM Bank Agricultural University Bangladesh',
    short_name: 'EBAUB',
    tagline: 'Excellence in Agricultural Sciences, Engineering & Business',
    accreditation: "Approved by UGC & Ministry of Education, Govt. of the People's Republic of Bangladesh",
    campus_address: '69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh',
    inquiries_email: 'info@ebaub.edu.bd',
    admissions_email: 'admission@ebaub.edu.bd',
    hotline_phone: '02-588893525',
    admissions_phone: '02-588893526 to 29',
    office_hours: 'Sunday - Thursday: 9:00 AM - 5:00 PM (Friday & Saturday Closed)',
    facebook_url: 'https://www.facebook.com/ebaub.chapai',
    linkedin_url: 'https://www.linkedin.com/company/ebaub',
    youtube_url: 'https://www.youtube.com/@ebaub',
    student_portal_url: '/student',
    teacher_portal_url: '/teacher'
  },
  home: {
    badge_text: 'CSE Department 2-Year Anniversary Prototype',
    hero_headline: 'Empowering the next generation of engineers.',
    hero_subtitle: 'EXIM Bank Agricultural University Bangladesh (EBAUB) combines rigorous academic foundations, hands-on engineering, and digital campus workflows.',
    hero_video_url: '',
    hero_fallback_image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85',
    explore_cta_text: 'Explore Degree Programs',
    admissions_cta_text: 'Admission Guidelines',
    accreditation_metric: 'UGC Bangladesh Approved',
    curriculum_metric: '160 Credit Curriculum'
  },
  academics: {
    header_badge: 'Academics & Degree Programs',
    header_headline: 'Explore EBAUB Faculties, Departments & Curriculums',
    header_description: 'Discover our industry-aligned undergraduate degree offerings designed to build technical proficiency and leadership capabilities.',
    advising_contact_email: 'academic.advising@ebaub.edu.bd',
    curriculum_overview_text: 'All degree curriculums follow outcome-based education (OBE) guidelines recommended by UGC Bangladesh.'
  },
  admissions: {
    header_badge: 'Fall 2027 Admissions Open',
    header_headline: 'Begin Your Journey at EXIM Bank Agricultural University',
    header_description: 'Discover your potential with our rigorous academic programs. Explore requirements, application steps, and key dates below.',
    apply_cta_text: 'Apply Now',
    deadline_highlight_text: 'Spring & Fall 2027 Application Deadlines are actively underway.',
    financial_aid_snippet: 'Need-based scholarships, merit waivers (up to 100%), and EXIM Bank Foundation stipends available for eligible students.',
    admissions_hotline: '02-588893526 to 29',
    admissions_email: 'admission@ebaub.edu.bd'
  },
  faculty: {
    header_badge: 'Distinguished Educators',
    header_headline: 'Academic Faculty Directory',
    header_description: 'Meet our dedicated academic staff committed to excellence in teaching, research, and innovation across our various faculties and departments.',
    join_faculty_notice: 'Interested in joining our academic roster? Submit your CV and research portfolio to hr@ebaub.edu.bd.',
    research_focus_text: 'Leading breakthroughs in Precision Agriculture, Software Architecture, Machine Learning, and Agribusiness.'
  },
  student_life: {
    header_badge: 'Campus Events & Student Life',
    header_headline: 'Vibrant Campus Life & Extracurriculars',
    header_description: 'Stay connected with upcoming academic events, workshops, seminars, and student activities across the campus.',
    clubs_highlight_text: 'Join 15+ student clubs including EBAUB Computer Club, Robotics Guild, Cultural Society, and Agri-Tech Innovators.',
    facilities_snippet: 'Modern computer labs, smart classrooms, botanical research fields, central library, and high-speed campus WiFi.'
  },
  contact: {
    header_badge: 'Contact EBAUB',
    header_headline: 'Get in Touch with EBAUB University Administration',
    header_description: 'We welcome inquiries regarding admissions, departmental programs, research collaborations, and campus visits.',
    campus_address: '69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh',
    inquiries_email: 'info@ebaub.edu.bd',
    hotline_phone: '02-588893525',
    admissions_phone: '02-588893526 to 29',
    office_hours: 'Sunday – Thursday: 9:00 AM – 5:00 PM (Friday & Saturday Closed)',
    transport_directions: 'Located at Boro Indara More, easily accessible via regional transport from Rajshahi and Chapai Nawabganj town centers.'
  }
};

// Legacy fallback for backward compatibility
export const DEFAULT_SITE_SETTINGS: GlobalSiteSettings = {
  hero: {
    headline: PAGE_SETTINGS_DEFAULTS.home.hero_headline,
    subtitle: PAGE_SETTINGS_DEFAULTS.home.hero_subtitle,
    video_url: PAGE_SETTINGS_DEFAULTS.home.hero_video_url,
    fallback_image_url: PAGE_SETTINGS_DEFAULTS.home.hero_fallback_image_url,
    badge_text: PAGE_SETTINGS_DEFAULTS.home.badge_text
  },
  general: {
    site_name: PAGE_SETTINGS_DEFAULTS.global_footer.site_name,
    short_name: PAGE_SETTINGS_DEFAULTS.global_footer.short_name,
    tagline: PAGE_SETTINGS_DEFAULTS.global_footer.tagline,
    meta_description: 'Official portal of EXIM Bank Agricultural University Bangladesh (EBAUB).',
    accreditation: PAGE_SETTINGS_DEFAULTS.global_footer.accreditation
  },
  contact: {
    campus_address: PAGE_SETTINGS_DEFAULTS.global_footer.campus_address,
    inquiries_email: PAGE_SETTINGS_DEFAULTS.global_footer.inquiries_email,
    admissions_email: PAGE_SETTINGS_DEFAULTS.global_footer.admissions_email,
    hotline_phone: PAGE_SETTINGS_DEFAULTS.global_footer.hotline_phone,
    admissions_phone: PAGE_SETTINGS_DEFAULTS.global_footer.admissions_phone,
    office_hours: PAGE_SETTINGS_DEFAULTS.global_footer.office_hours
  },
  socials: {
    facebook_url: PAGE_SETTINGS_DEFAULTS.global_footer.facebook_url,
    linkedin_url: PAGE_SETTINGS_DEFAULTS.global_footer.linkedin_url,
    youtube_url: PAGE_SETTINGS_DEFAULTS.global_footer.youtube_url,
    student_portal_url: PAGE_SETTINGS_DEFAULTS.global_footer.student_portal_url,
    teacher_portal_url: PAGE_SETTINGS_DEFAULTS.global_footer.teacher_portal_url
  }
};
