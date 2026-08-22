import {
  Faculty,
  Department,
  Program,
  FacultyMember,
  NewsItem,
  NoticeItem,
  EventItem,
  Announcement,
  SiteSettings,
  TeachingMaterial,
  QuizGeneration,
  MediaItem
} from '@/types';

export const initialSiteSettings: SiteSettings = {
  universityName: 'Eastern Bank Agricultural University',
  shortName: 'EBAUB',
  tagline: 'Empowering Future Leaders through Innovation, Science, and Agriculture',
  address: 'EBAUB Campus, Rajshahi, Bangladesh',
  email: 'info@ebaub.ac.bd',
  phone: '+880-1700-000000',
  establishedYear: 2013,
  socialLinks: {
    facebook: 'https://facebook.com/ebaub.official',
    linkedin: 'https://linkedin.com/school/ebaub',
    youtube: 'https://youtube.com/c/ebaubchannel'
  }
};

export const initialFaculties: Faculty[] = [
  {
    id: 'f-cse',
    title: 'Faculty of Computer Science & Engineering',
    slug: 'cse-faculty',
    description: 'Fostering excellence in software engineering, artificial intelligence, networking, and modern computational sciences.',
    deanName: 'Dr. Ahmed Tanvir',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'f-agri',
    title: 'Faculty of Agriculture',
    slug: 'agriculture-faculty',
    description: 'Pioneering agricultural technology, sustainable farming solutions, and modern crop science.',
    deanName: 'Prof. Dr. M. A. Rahman',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'f-ba',
    title: 'Faculty of Business Administration',
    slug: 'business-faculty',
    description: 'Developing ethical business leaders, tech entrepreneurs, and financial strategists.',
    deanName: 'Dr. Sharmin Akter',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-10T00:00:00Z'
  }
];

export const initialDepartments: Department[] = [
  {
    id: 'd-cse',
    facultyId: 'f-cse',
    title: 'Department of Computer Science and Engineering',
    slug: 'cse',
    code: 'CSE',
    description: 'The Department of CSE at EBAUB focuses on high-quality technical education, research in AI & Web Engineering, and practical hands-on problem solving.',
    headName: 'Prof. Mahmudul Hasan',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'd-agronomy',
    facultyId: 'f-agri',
    title: 'Department of Agronomy',
    slug: 'agronomy',
    code: 'AGR',
    description: 'Specializing in soil fertility, crop management, modern precision farming techniques, and sustainable yield optimization.',
    headName: 'Dr. Tariqul Islam',
    bannerUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'd-bba',
    facultyId: 'f-ba',
    title: 'Department of Business Administration',
    slug: 'bba-dept',
    code: 'BBA',
    description: 'Focusing on marketing, financial management, digital transformation, and organizational leadership.',
    headName: 'Nusrat Jahan',
    bannerUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2024-01-10T00:00:00Z'
  }
];

export const initialPrograms: Program[] = [
  {
    id: 'p-bsc-cse',
    departmentId: 'd-cse',
    title: 'Bachelor of Science in Computer Science & Engineering',
    slug: 'bsc-cse',
    code: 'B.Sc. CSE',
    degreeLevel: 'Undergraduate',
    durationYears: 4.0,
    totalCredits: 160,
    description: 'A comprehensive 4-year undergraduate program designed to equip students with deep knowledge in algorithms, software engineering, AI, web engineering, and system design.',
    admissionRequirements: 'HSC or equivalent with minimum GPA 3.50 with Physics and Higher Mathematics.',
    curriculumOverview: 'Year 1: Programming Fundamentals & Mathematics | Year 2: Data Structures, OOP, & DB | Year 3: Algorithms, Software Eng & AI | Year 4: Thesis & Capstone Project.',
    isPublished: true,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'p-bsc-ag',
    departmentId: 'd-agronomy',
    title: 'Bachelor of Science in Agriculture (Honours)',
    slug: 'bsc-agriculture',
    code: 'B.Sc. Ag',
    degreeLevel: 'Undergraduate',
    durationYears: 4.0,
    totalCredits: 175,
    description: 'A rigorous hands-on degree training future agricultural engineers, crop researchers, and agribusiness specialists.',
    admissionRequirements: 'HSC Science stream with Chemistry, Physics, and Biology.',
    curriculumOverview: 'Soil science, horticulture, crop pathology, agricultural machinery, farm economics, and practical field work.',
    isPublished: true,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'p-bba',
    departmentId: 'd-bba',
    title: 'Bachelor of Business Administration',
    slug: 'bba-program',
    code: 'BBA',
    degreeLevel: 'Undergraduate',
    durationYears: 4.0,
    totalCredits: 130,
    description: 'Prepares forward-thinking entrepreneurs, business analysts, and corporate managers with modern leadership skills.',
    admissionRequirements: 'HSC or equivalent from Science, Commerce, or Arts background with minimum GPA 3.00.',
    curriculumOverview: 'Principles of Management, Accounting, Digital Marketing, E-Commerce, Corporate Finance, and Internship.',
    isPublished: true,
    createdAt: '2024-01-10T00:00:00Z'
  }
];

export const initialFacultyMembers: FacultyMember[] = [
  {
    id: 'fm-1',
    departmentId: 'd-cse',
    name: 'Prof. Mahmudul Hasan',
    designation: 'Professor & Head of Department',
    email: 'm.hasan@ebaub.ac.bd',
    phone: '+880-1711-100200',
    bio: 'Prof. Hasan has over 15 years of academic leadership and research experience in Distributed Systems and Cloud Computing.',
    researchInterests: ['Distributed Systems', 'Cloud Architectures', 'Cyber Security'],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    orderIndex: 1,
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'fm-2',
    departmentId: 'd-cse',
    name: 'Dr. Anisur Rahman',
    designation: 'Associate Professor',
    email: 'a.rahman@ebaub.ac.bd',
    phone: '+880-1712-200300',
    bio: 'Dr. Rahman leads the AI & Machine Learning research lab at EBAUB CSE, focusing on NLP and Computer Vision for agriculture.',
    researchInterests: ['Artificial Intelligence', 'Computer Vision', 'Agri-Tech AI'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    orderIndex: 2,
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'fm-3',
    departmentId: 'd-cse',
    name: 'Sabrina Chowdhury',
    designation: 'Assistant Professor',
    email: 's.chowdhury@ebaub.ac.bd',
    phone: '+880-1713-300400',
    bio: 'Specialist in Web Technologies, Software Engineering, and Database Management Systems with a passion for student mentoring.',
    researchInterests: ['Web Engineering', 'Human Computer Interaction', 'Database Systems'],
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    orderIndex: 3,
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z'
  }
];

export const initialNotices: NoticeItem[] = [
  {
    id: 'n-1',
    title: 'CSE Department 2-Year Anniversary Ceremony & Tech Presentation',
    slug: 'cse-2yr-anniversary-ceremony',
    summary: 'All students, faculty members, and university administration are cordially invited to the CSE Department 2-Year Anniversary Ceremony.',
    content: `Eastern Bank Agricultural University (EBAUB) Department of Computer Science & Engineering is thrilled to celebrate its 2-Year Anniversary!

Event Highlights:
- Keynote address by Honorable Vice Chancellor & CSE Department Head
- Presentation of the new EBAUB Digital Campus Prototype
- Interactive Student Tech Project Showcase
- Cultural Program & Prize Distribution

Venue: EBAUB Central Auditorium
Date: August 25, 2026 | Time: 10:00 AM`,
    category: 'General',
    targetAudience: 'ALL',
    isImportant: true,
    isPublished: true,
    publishedAt: '2026-08-20T10:00:00Z',
    createdAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'n-2',
    title: 'Fall 2026 Semester Final Examination Schedule Published',
    slug: 'fall-2026-exam-schedule',
    summary: 'The routine for Fall 2026 final exams across all faculties has been published. Exams begin September 10, 2026.',
    content: 'Students are requested to clear all library dues and download their admit cards from the student portal before September 5, 2026.',
    category: 'Exam',
    targetAudience: 'STUDENTS',
    isImportant: true,
    isPublished: true,
    publishedAt: '2026-08-18T09:00:00Z',
    createdAt: '2026-08-18T09:00:00Z'
  },
  {
    id: 'n-3',
    title: 'Admission Open for Spring 2027 Academic Session',
    slug: 'admission-open-spring-2027',
    summary: 'Applications are now open for B.Sc. in CSE, B.Sc. in Agriculture, and BBA programs for the Spring 2027 session.',
    content: 'Interested candidates can submit online applications through the EBAUB Digital Campus portal or visit the Admissions Office on campus.',
    category: 'Admission',
    targetAudience: 'PUBLIC',
    isImportant: false,
    isPublished: true,
    publishedAt: '2026-08-15T08:00:00Z',
    createdAt: '2026-08-15T08:00:00Z'
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 'nw-1',
    title: 'EBAUB CSE Unveils Next-Generation Digital Campus Prototype',
    slug: 'ebaub-cse-unveils-digital-campus',
    summary: 'The Department of Computer Science & Engineering introduces a unified platform bridging public university information with interactive digital workspaces for students and teachers.',
    content: `Eastern Bank Agricultural University has reached a landmark technological achievement. Designed and engineered by the CSE Department, the new EBAUB Digital Campus replaces the outdated website experience with a lightning-fast, custom headless CMS, student study hub, and AI-powered teacher tools.

The platform provides seamless mobile responsiveness, modern visual design, and intelligent assistance for campus visitors and academic members alike.`,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    category: 'Technology & Innovation',
    authorName: 'EBAUB Press Relations',
    isPublished: true,
    publishedAt: '2026-08-20T12:00:00Z',
    createdAt: '2026-08-20T12:00:00Z'
  },
  {
    id: 'nw-2',
    title: 'CSE Research Team Wins Best Paper Award at National AI Summit',
    slug: 'cse-research-wins-national-ai-award',
    summary: 'Faculty and student researchers from EBAUB CSE received top honors for their research paper on machine learning in smart farming.',
    content: 'The team presented their paper titled "Deep Learning Framework for Early Plant Disease Detection in High-Humidity Agro-zones" at the National AI Summit 2026 in Dhaka.',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    category: 'Research & Achievement',
    authorName: 'CSE Research Cell',
    isPublished: true,
    publishedAt: '2026-08-12T14:00:00Z',
    createdAt: '2026-08-12T14:00:00Z'
  }
];

export const initialEvents: EventItem[] = [
  {
    id: 'ev-1',
    title: 'CSE Department 2-Year Anniversary Grand Gala',
    slug: 'cse-anniversary-gala',
    summary: 'Celebrating two years of academic excellence, innovation, and technological growth.',
    description: 'Join faculty, students, distinguished alumni, and university administration for an inspiring evening of presentations, project demos, awards, and dinner.',
    location: 'EBAUB Central Auditorium',
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    startTime: '2026-08-25T10:00:00Z',
    endTime: '2026-08-25T17:00:00Z',
    isPublished: true,
    createdAt: '2026-08-20T00:00:00Z'
  },
  {
    id: 'ev-2',
    title: 'Workshop: Modern Web Development & Next.js Ecosystem',
    slug: 'workshop-nextjs-web-dev',
    summary: 'Hands-on practical workshop hosted by CSE Club for students interested in modern full-stack web engineering.',
    description: 'Topics include React, Next.js App Router, Tailwind CSS v4, TypeScript, and cloud deployment on Vercel.',
    location: 'CSE Lab 2 (Software Lab)',
    bannerImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
    startTime: '2026-09-02T11:00:00Z',
    endTime: '2026-09-02T15:00:00Z',
    isPublished: true,
    createdAt: '2026-08-15T00:00:00Z'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: '🎉 CSE 2-Year Anniversary',
    message: 'Join us on August 25 for the CSE Department 2-Year Anniversary Ceremony & Digital Campus presentation!',
    linkUrl: '/notices/cse-2yr-anniversary-ceremony',
    linkText: 'View Details',
    bannerType: 'info',
    isActive: true,
    startDate: '2026-08-20T00:00:00Z'
  }
];

export const initialTeachingMaterials: TeachingMaterial[] = [
  {
    id: 'tm-1',
    teacherId: 'fm-3',
    teacherName: 'Sabrina Chowdhury',
    departmentId: 'd-cse',
    title: 'CSE-2101: Data Structures Lecture Notes & Algorithm Handouts',
    description: 'Comprehensive guide covering Linked Lists, Binary Trees, Graph Traversals (DFS/BFS), and Big-O Time Complexity.',
    fileUrl: '#',
    subject: 'Data Structures & Algorithms',
    isPublished: true,
    createdAt: '2026-08-14T00:00:00Z'
  },
  {
    id: 'tm-2',
    teacherId: 'fm-2',
    teacherName: 'Dr. Anisur Rahman',
    departmentId: 'd-cse',
    title: 'CSE-3205: Artificial Intelligence & Neural Networks Primer',
    description: 'Introduction to Supervised Learning, Decision Trees, Gradient Descent, and Convolutional Neural Networks.',
    fileUrl: '#',
    subject: 'Artificial Intelligence',
    isPublished: true,
    createdAt: '2026-08-10T00:00:00Z'
  }
];

export const initialQuizzes: QuizGeneration[] = [
  {
    id: 'qg-1',
    teacherId: 'fm-3',
    title: 'Data Structures - Binary Search Trees Quiz',
    topic: 'Binary Search Tree Operations',
    subject: 'Data Structures',
    difficulty: 'Medium',
    questions: [
      {
        id: 'q-1',
        type: 'MCQ',
        question: 'What is the worst-case time complexity for searching an element in an unbalanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswer: 'O(N)',
        explanation: 'In the worst case, a BST degenerates into a single linked list structure (skewed tree), making search O(N).'
      },
      {
        id: 'q-2',
        type: 'MCQ',
        question: 'Which tree traversal algorithm produces nodes in sorted ascending order for a BST?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctAnswer: 'In-order',
        explanation: 'An in-order traversal (Left -> Root -> Right) visits BST nodes in monotonically increasing sorted order.'
      },
      {
        id: 'q-3',
        type: 'ShortAnswer',
        question: 'Define the self-balancing property of an AVL tree.',
        correctAnswer: 'An AVL tree maintains a balance factor of -1, 0, or +1 for every node by performing rotations.',
        explanation: 'AVL trees strictly enforce logarithmic height guarantees O(log N) through tree rotations during insertions/deletions.'
      }
    ],
    isPublished: true,
    createdAt: '2026-08-19T14:00:00Z'
  }
];

export const initialMediaItems: MediaItem[] = [
  {
    id: 'm-1',
    filename: 'ebaub-campus-hero.jpg',
    filePath: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    fileSize: 450000,
    mimeType: 'image/jpeg',
    altText: 'EBAUB Main Academic Building Banner',
    createdAt: '2026-08-20T00:00:00Z'
  },
  {
    id: 'm-2',
    filename: 'cse-lab-tech.jpg',
    filePath: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    fileSize: 380000,
    mimeType: 'image/jpeg',
    altText: 'CSE Computer Laboratory',
    createdAt: '2026-08-20T00:00:00Z'
  }
];
