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
  MediaItem,
  QuizQuestion
} from '@/types';
import {
  initialFaculties,
  initialDepartments,
  initialPrograms,
  initialFacultyMembers,
  initialNotices,
  initialNews,
  initialEvents,
  initialAnnouncements,
  initialSiteSettings,
  initialTeachingMaterials,
  initialQuizzes,
  initialMediaItems
} from './mockData';

// Helper to get or set local storage state for client-side persistence in prototype
const getStoredState = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`ebaub_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStoredState = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ebaub_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
};

// ------------------------------------
// PUBLIC SITE READ SERVICES
// ------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  return getStoredState('site_settings', initialSiteSettings);
}

export async function getFaculties(): Promise<Faculty[]> {
  return getStoredState('faculties', initialFaculties);
}

export async function getDepartments(): Promise<Department[]> {
  return getStoredState('departments', initialDepartments);
}

export async function getDepartmentBySlug(slug: string): Promise<Department | undefined> {
  const depts = await getDepartments();
  return depts.find(d => d.slug === slug);
}

export async function getPrograms(): Promise<Program[]> {
  return getStoredState('programs', initialPrograms);
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  const programs = await getPrograms();
  return programs.find(p => p.slug === slug);
}

export async function getFacultyMembers(departmentId?: string): Promise<FacultyMember[]> {
  const members = getStoredState('faculty_members', initialFacultyMembers);
  if (departmentId) {
    return members.filter(m => m.departmentId === departmentId);
  }
  return members;
}

export async function getNotices(): Promise<NoticeItem[]> {
  return getStoredState('notices', initialNotices);
}

export async function getNoticeBySlug(slug: string): Promise<NoticeItem | undefined> {
  const notices = await getNotices();
  return notices.find(n => n.slug === slug);
}

export async function getNews(): Promise<NewsItem[]> {
  return getStoredState('news', initialNews);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const news = await getNews();
  return news.find(n => n.slug === slug);
}

export async function getEvents(): Promise<EventItem[]> {
  return getStoredState('events', initialEvents);
}

export async function getEventBySlug(slug: string): Promise<EventItem | undefined> {
  const events = await getEvents();
  return events.find(e => e.slug === slug);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return getStoredState('announcements', initialAnnouncements);
}

// ------------------------------------
// CMS WRITE SERVICES (MUTABLE MOCK STATE)
// ------------------------------------

export async function createNotice(notice: Omit<NoticeItem, 'id' | 'createdAt' | 'publishedAt'>): Promise<NoticeItem> {
  const notices = await getNotices();
  const newNotice: NoticeItem = {
    ...notice,
    id: `n-${Date.now()}`,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  };
  const updated = [newNotice, ...notices];
  setStoredState('notices', updated);
  return newNotice;
}

export async function deleteNotice(id: string): Promise<void> {
  const notices = await getNotices();
  const updated = notices.filter(n => n.id !== id);
  setStoredState('notices', updated);
}

export async function createNews(newsItem: Omit<NewsItem, 'id' | 'createdAt' | 'publishedAt'>): Promise<NewsItem> {
  const newsList = await getNews();
  const newItem: NewsItem = {
    ...newsItem,
    id: `nw-${Date.now()}`,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  };
  const updated = [newItem, ...newsList];
  setStoredState('news', updated);
  return newItem;
}

export async function deleteNews(id: string): Promise<void> {
  const newsList = await getNews();
  const updated = newsList.filter(n => n.id !== id);
  setStoredState('news', updated);
}

export async function createEvent(event: Omit<EventItem, 'id' | 'createdAt'>): Promise<EventItem> {
  const events = await getEvents();
  const newEvent: EventItem = {
    ...event,
    id: `ev-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newEvent, ...events];
  setStoredState('events', updated);
  return newEvent;
}

// ------------------------------------
// TEACHER & STUDENT WORKSPACE SERVICES
// ------------------------------------

export async function getTeachingMaterials(): Promise<TeachingMaterial[]> {
  return getStoredState('materials', initialTeachingMaterials);
}

export async function createTeachingMaterial(mat: Omit<TeachingMaterial, 'id' | 'createdAt'>): Promise<TeachingMaterial> {
  const list = await getTeachingMaterials();
  const newMat: TeachingMaterial = {
    ...mat,
    id: `tm-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newMat, ...list];
  setStoredState('materials', updated);
  return newMat;
}

export async function getQuizzes(): Promise<QuizGeneration[]> {
  return getStoredState('quizzes', initialQuizzes);
}

export async function createQuiz(quiz: Omit<QuizGeneration, 'id' | 'createdAt'>): Promise<QuizGeneration> {
  const quizzes = await getQuizzes();
  const newQuiz: QuizGeneration = {
    ...quiz,
    id: `qg-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newQuiz, ...quizzes];
  setStoredState('quizzes', updated);
  return newQuiz;
}

export async function getMediaItems(): Promise<MediaItem[]> {
  return getStoredState('media', initialMediaItems);
}

// ------------------------------------
// TEACHER AI QUIZ GENERATOR ENGINE
// ------------------------------------

export async function generateAIQuiz(params: {
  topic: string;
  subject: string;
  count: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}): Promise<QuizQuestion[]> {
  // Simulate AI generation latency
  await new Promise(res => setTimeout(res, 1200));

  const questions: QuizQuestion[] = [];
  const topicUpper = params.topic.trim();

  for (let i = 1; i <= params.count; i++) {
    if (i % 3 === 1) {
      questions.push({
        id: `gen-${i}`,
        type: 'MCQ',
        question: `In ${params.subject} (${topicUpper}), what is the primary objective when analyzing ${params.difficulty.toLowerCase()} complexity in step ${i}?`,
        options: [
          `To minimize execution time and resource overhead`,
          `To bypass structural validation rules`,
          `To static-link external binary dependencies`,
          `To enforce client-side cache invalidation`
        ],
        correctAnswer: `To minimize execution time and resource overhead`,
        explanation: `Analyzing complexity in ${topicUpper} ensures optimal computational performance and scalability.`
      });
    } else if (i % 3 === 2) {
      questions.push({
        id: `gen-${i}`,
        type: 'MCQ',
        question: `Which fundamental principle applies when implementing ${topicUpper} in modern software architecture?`,
        options: [
          `Encapsulation and Separation of Concerns`,
          `Unrestricted global mutation`,
          `Ignoring exception handling boundaries`,
          `Hardcoding static buffer sizes`
        ],
        correctAnswer: `Encapsulation and Separation of Concerns`,
        explanation: `Modularity and separation of concerns are critical when engineering robust ${params.subject} applications.`
      });
    } else {
      questions.push({
        id: `gen-${i}`,
        type: 'ShortAnswer',
        question: `Briefly explain the practical application of ${topicUpper} in real-world computer science solutions.`,
        correctAnswer: `${topicUpper} provides essential algorithmic or structural mechanisms used in system design, AI, or database management.`,
        explanation: `Clear understanding of ${topicUpper} allows engineers to choose optimal algorithms for high-load systems.`
      });
    }
  }

  return questions;
}

// ------------------------------------
// PUBLIC AI ASSISTANT DEMO ENGINE
// ------------------------------------

export async function askPublicAI(query: string): Promise<string> {
  await new Promise(res => setTimeout(res, 800));
  const q = query.toLowerCase();

  if (q.includes('program') || q.includes('course') || q.includes('degree') || q.includes('cse') || q.includes('bsc')) {
    return `EXIM Bank Agricultural University Bangladesh (EBAUB) offers premier undergraduate programs including:
1. **Bachelor of Science in Computer Science & Engineering (B.Sc. CSE)**: 4-year (160 credits) covering Software Engineering, AI, Data Structures, Web Engineering & Cloud Systems.
2. **Bachelor of Science in Agriculture (Honours)**: 4-year (175 credits) in Agronomy & Crop Technology.
3. **Bachelor of Business Administration (BBA)**: 4-year (130 credits) in Finance, Marketing & Digital Enterprise.

Would you like more details on admission requirements for a specific program?`;
  }

  if (q.includes('anniversary') || q.includes('2 year') || q.includes('ceremony') || q.includes('event')) {
    return `🎉 **CSE Department 2-Year Anniversary Ceremony**
The Department of CSE is celebrating its 2nd Anniversary on **August 25, 2026** at the EBAUB Central Auditorium. The ceremony features keynote speeches by university leadership, the launch of the EBAUB Digital Campus prototype, student tech demonstrations, and cultural programs.`;
  }

  if (q.includes('admission') || q.includes('apply') || q.includes('requirement') || q.includes('gpa')) {
    return `🎓 **EBAUB Admissions Information**:
- **B.Sc. in CSE**: Requires HSC/Equivalent in Science with minimum GPA 3.50 (Physics & Math mandatory).
- **B.Sc. in Agriculture**: Requires HSC Science stream with Chemistry, Physics & Biology.
- **BBA**: Minimum GPA 3.00 from Science, Commerce, or Arts background.

Applications for Spring 2027 are currently open! You can submit applications online or at the Admissions Office on campus.`;
  }

  if (q.includes('contact') || q.includes('location') || q.includes('where') || q.includes('address') || q.includes('email')) {
    return `📍 **EBAUB Campus Location & Contact**:
- **Address**: EBAUB Campus, Rajshahi, Bangladesh
- **Email**: info@ebaub.ac.bd
- **Phone**: +880-1700-000000
- **Admissions Office**: Administrative Building, Ground Floor (Saturday–Thursday, 9:00 AM – 5:00 PM)`;
  }

  if (q.includes('notice') || q.includes('exam') || q.includes('routine')) {
    return `📢 **Recent EBAUB Notices**:
1. **CSE 2-Year Anniversary Ceremony**: Scheduled for August 25, 2026.
2. **Fall 2026 Final Examination Schedule**: Examinations commence on September 10, 2026. Clear all library dues before downloading admit cards.`;
  }

  return `Welcome to EXIM Bank Agricultural University Bangladesh (EBAUB) Digital Assistant! I can help you discover information about our **Academic Programs**, **CSE 2-Year Anniversary Ceremony**, **Admissions Requirements**, **Notices & Events**, and **Campus Contact Info**. How can I assist your search today?`;
}

// ------------------------------------
// STUDENT AI STUDY ASSISTANT ENGINE
// ------------------------------------

export async function askStudentAI(prompt: string): Promise<string> {
  await new Promise(res => setTimeout(res, 900));
  const p = prompt.toLowerCase();

  if (p.includes('binary tree') || p.includes('bst') || p.includes('tree')) {
    return `### Binary Search Tree (BST) Concept Summary:
A **Binary Search Tree** is a node-based binary tree data structure where:
1. The left subtree of a node contains only nodes with keys **less than** the node's key.
2. The right subtree of a node contains only nodes with keys **greater than** the node's key.
3. Both left and right subtrees must also be binary search trees.

**Time Complexity**:
- Search / Insert / Delete (Average): **O(log N)**
- Search / Insert / Delete (Worst Case - Skewed): **O(N)**

*Tip for exams*: Always remember that an **In-Order Traversal** of a BST produces elements in strictly sorted ascending order!`;
  }

  if (p.includes('recursion') || p.includes('divide and conquer')) {
    return `### Recursion & Divide-and-Conquer Guide:
Recursion is a programming technique where a function calls itself to break down a problem into smaller instances.

**Key Requirements**:
1. **Base Case**: The termination condition where the function stops calling itself.
2. **Recursive Step**: Reducing the problem size closer to the base case.

**Example (Factorial in C/C++)**:
\`\`\`cpp
int factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive step
}
\`\`\``;
  }

  return `Here is a clear academic breakdown of your question:

**Concept Overview**: "${prompt}"
In modern computer science and engineering curriculum at EBAUB, this concept forms a key foundation.

**Key Takeaways**:
- Ensure you understand both theoretical principles and code implementations.
- Relate the logic to memory overhead and execution complexity.

Would you like me to generate a practice 3-question quiz on this topic to test your knowledge?`;
}

// ------------------------------------
// GLOBAL SEARCH ENGINE
// ------------------------------------

export async function globalSearch(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { programs: [], notices: [], news: [], faculty: [], events: [] };

  const [programs, notices, news, faculty, events] = await Promise.all([
    getPrograms(),
    getNotices(),
    getNews(),
    getFacultyMembers(),
    getEvents()
  ]);

  return {
    programs: programs.filter(p => p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    notices: notices.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)),
    news: news.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)),
    faculty: faculty.filter(f => f.name.toLowerCase().includes(q) || f.designation.toLowerCase().includes(q) || f.researchInterests.some(r => r.toLowerCase().includes(q))),
    events: events.filter(e => e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q) || e.location.toLowerCase().includes(q))
  };
}
