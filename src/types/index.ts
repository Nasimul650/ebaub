export type UserRole = 'ADMIN' | 'EDITOR' | 'TEACHER' | 'STUDENT';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  departmentId?: string;
  createdAt: string;
}

export interface Faculty {
  id: string;
  title: string;
  slug: string;
  description: string;
  deanName: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  facultyId: string;
  title: string;
  slug: string;
  code: string;
  description: string;
  headName: string;
  bannerUrl?: string;
  createdAt: string;
}

export interface Program {
  id: string;
  departmentId: string;
  title: string;
  slug: string;
  code: string;
  degreeLevel: 'Undergraduate' | 'Graduate' | 'Diploma';
  durationYears: number;
  totalCredits: number;
  description: string;
  admissionRequirements: string;
  curriculumOverview: string;
  isPublished: boolean;
  createdAt: string;
}

export interface FacultyMember {
  id: string;
  departmentId: string;
  name: string;
  designation: string;
  email: string;
  phone?: string;
  bio: string;
  researchInterests: string[];
  imageUrl?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
}

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  authorName: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  attachmentUrl?: string;
  category: 'Academic' | 'Admission' | 'General' | 'Exam';
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PUBLIC';
  isImportant: boolean;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  bannerImage?: string;
  startTime: string;
  endTime?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  altText?: string;
  uploadedBy?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  linkUrl?: string;
  linkText?: string;
  bannerType: 'info' | 'warning' | 'success';
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

export interface SiteSettings {
  universityName: string;
  shortName: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  establishedYear: number;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface TeachingMaterial {
  id: string;
  teacherId: string;
  teacherName: string;
  departmentId: string;
  title: string;
  description: string;
  fileUrl: string;
  subject: string;
  isPublished: boolean;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  type: 'MCQ' | 'ShortAnswer' | 'Conceptual';
}

export interface QuizGeneration {
  id: string;
  teacherId: string;
  title: string;
  topic: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: QuizQuestion[];
  isPublished: boolean;
  createdAt: string;
}

// ==========================================
// PAGE BUILDER BLOCK TYPES
// ==========================================

export type BlockType = 'hero' | 'text_image' | 'stats' | 'cta_banner' | 'rich_text';

export interface HeroBlockData {
  badge: string;
  headline: string;
  subheadline: string;
}

export interface TextImageBlockData {
  title: string;
  paragraph: string;
  image_url: string;
  image_alignment: 'left' | 'right';
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsBlockData {
  headline: string;
  stats: StatItem[];
}

export interface CtaBannerBlockData {
  headline: string;
  description: string;
  button_text: string;
  button_link: string;
}

export interface RichTextBlockData {
  title: string;
  content: string;
}

export type BlockData =
  | HeroBlockData
  | TextImageBlockData
  | StatsBlockData
  | CtaBannerBlockData
  | RichTextBlockData;

export interface ContentBlock {
  type: BlockType;
  data: BlockData;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content_blocks: ContentBlock[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
