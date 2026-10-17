-- =============================================================================
-- EBAUB Digital Campus — Demo Seed Data
-- =============================================================================
-- Run this AFTER all migrations (0001–0021) have been applied.
-- This inserts sample data for demo/review purposes.
--
-- NOTE: Demo user accounts must be created via Supabase Auth Dashboard first,
-- then their profiles can be updated with the SQL below.
-- =============================================================================

-- =============================================
-- 1. FACULTIES
-- =============================================
INSERT INTO public.faculties (id, name, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Faculty of Engineering & Technology', 'Covers Computer Science, Electrical, and Civil Engineering programs.'),
  ('a0000000-0000-0000-0000-000000000002', 'Faculty of Agriculture', 'Agricultural sciences, agronomy, soil science, and crop production.'),
  ('a0000000-0000-0000-0000-000000000003', 'Faculty of Business Administration', 'Business management, accounting, finance, and marketing programs.')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 2. DEPARTMENTS
-- =============================================
INSERT INTO public.departments (id, faculty_id, name, description) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Department of Computer Science & Engineering', 'Software engineering, AI/ML, data science, and computer networks.'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Department of Electrical & Electronic Engineering', 'Power systems, electronics, telecommunications, and embedded systems.'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Department of Agronomy', 'Crop science, plant genetics, precision agriculture, and sustainable farming.'),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'Department of Management Studies', 'Business administration, human resources, strategic management.')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3. PROGRAMS
-- =============================================
INSERT INTO public.programs (id, department_id, name, degree_level, duration_years, description) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'B.Sc. in Computer Science & Engineering', 'Undergraduate', 4, 'A comprehensive 4-year program covering software development, algorithms, AI, databases, and computer networks with industry internship.'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'B.Sc. in Electrical & Electronic Engineering', 'Undergraduate', 4, 'Covers power systems, signal processing, embedded systems, and telecommunications.'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'B.Sc. in Agriculture (Agronomy)', 'Undergraduate', 4, 'Study of crop production, soil management, irrigation, and sustainable agriculture practices.'),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'BBA in Management', 'Undergraduate', 4, 'Business fundamentals, leadership, marketing, finance, and entrepreneurship.')
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. COURSES
-- =============================================
INSERT INTO public.courses (id, department_id, code, title, credits, description) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'CSE-101', 'Introduction to Computer Science', 3, 'Fundamentals of computing, problem solving, and introductory programming.'),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'CSE-201', 'Data Structures & Algorithms', 3, 'Arrays, linked lists, trees, graphs, sorting, searching, and complexity analysis.'),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'CSE-301', 'Database Management Systems', 3, 'Relational databases, SQL, normalization, transactions, and NoSQL concepts.'),
  ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'CSE-401', 'Artificial Intelligence', 3, 'Search algorithms, knowledge representation, machine learning fundamentals, and neural networks.'),
  ('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'EEE-101', 'Basic Electrical Engineering', 3, 'Circuit analysis, DC/AC circuits, transformers, and electrical machines.'),
  ('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'AGR-101', 'Principles of Agronomy', 3, 'Introduction to crop science, soil-plant relationships, and farming systems.')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 5. NEWS ARTICLES
-- =============================================
INSERT INTO public.news (id, title, slug, content, summary, image_url, category, published_at) VALUES
  ('e0000000-0000-0000-0000-000000000001',
   'EBAUB CSE Department Celebrates 2-Year Anniversary',
   'cse-2-year-anniversary',
   'The Department of Computer Science & Engineering at EXIM Bank Agricultural University Bangladesh celebrated its 2-year anniversary with a grand ceremony attended by faculty, students, and distinguished guests. The event showcased student projects, research presentations, and a keynote address on the future of technology in agriculture.',
   'CSE Department marks a major milestone with celebrations and project exhibitions.',
   'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
   'Campus Life',
   NOW() - INTERVAL '2 days'),
  ('e0000000-0000-0000-0000-000000000002',
   'New AI Research Lab Inaugurated',
   'ai-research-lab-inaugurated',
   'EBAUB has inaugurated a state-of-the-art Artificial Intelligence Research Laboratory equipped with high-performance computing resources. The lab will support research in machine learning, computer vision, and natural language processing, with a focus on agricultural applications.',
   'State-of-the-art AI lab opens for cutting-edge research in agriculture tech.',
   'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
   'Research',
   NOW() - INTERVAL '5 days'),
  ('e0000000-0000-0000-0000-000000000003',
   'Spring 2027 Admission Applications Now Open',
   'spring-2027-admissions-open',
   'EXIM Bank Agricultural University Bangladesh is now accepting applications for Spring 2027 admission across all faculties. Prospective students can apply online through the admissions portal. Scholarships and financial aid packages are available for meritorious and need-based candidates.',
   'Applications are open for all undergraduate programs for Spring 2027.',
   'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
   'Admissions',
   NOW() - INTERVAL '1 day')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 6. NOTICES
-- =============================================
INSERT INTO public.notices (id, title, slug, content, category, priority, published_at, date) VALUES
  ('f0000000-0000-0000-0000-000000000001',
   'Mid-Term Examination Schedule — Fall 2026',
   'mid-term-exam-schedule-fall-2026',
   'The mid-term examination for Fall 2026 semester will commence from November 15, 2026. Students are advised to collect their admit cards from the examination office. Detailed schedule is attached.',
   'Exam', 'HIGH',
   NOW() - INTERVAL '3 days', CURRENT_DATE + INTERVAL '30 days'),
  ('f0000000-0000-0000-0000-000000000002',
   'Library Hours Extended During Exam Period',
   'library-hours-extended',
   'The central library will remain open from 8:00 AM to 10:00 PM during the examination period (November 15 – December 15, 2026) to accommodate student study needs.',
   'General', 'MEDIUM',
   NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '28 days'),
  ('f0000000-0000-0000-0000-000000000003',
   'Scholarship Application Deadline — December 2026',
   'scholarship-deadline-dec-2026',
   'Students wishing to apply for EXIM Bank Foundation need-based scholarships must submit their applications by December 31, 2026. Forms are available at the Student Affairs Office.',
   'Academic', 'HIGH',
   NOW() - INTERVAL '1 day', '2026-12-31')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 7. EVENTS
-- =============================================
INSERT INTO public.events (id, title, slug, description, event_date, location, status, image_url) VALUES
  ('g0000000-0000-0000-0000-000000000001',
   'Annual Tech Fest 2026',
   'annual-tech-fest-2026',
   'The annual technology festival featuring hackathons, coding competitions, robotics showcases, and tech talks by industry leaders. Open to all EBAUB students and external participants.',
   NOW() + INTERVAL '30 days',
   'EBAUB Main Auditorium & Campus Grounds',
   'Upcoming',
   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
  ('g0000000-0000-0000-0000-000000000002',
   'Workshop: Machine Learning in Precision Agriculture',
   'ml-precision-agriculture-workshop',
   'A 2-day hands-on workshop on applying machine learning techniques to precision agriculture, covering crop yield prediction, disease detection, and drone-based monitoring.',
   NOW() + INTERVAL '14 days',
   'CSE Department Lab 3',
   'Upcoming',
   'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'),
  ('g0000000-0000-0000-0000-000000000003',
   'Career Fair: Engineering & Agriculture',
   'career-fair-2026',
   'Meet recruiters from top engineering firms, agritech startups, and government agriculture agencies. Bring your CV and portfolio.',
   NOW() + INTERVAL '45 days',
   'EBAUB Convention Center',
   'Upcoming',
   'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 8. FACULTY MEMBERS
-- =============================================
INSERT INTO public.faculty_members (id, name, title, department_id, bio, image_url) VALUES
  ('h0000000-0000-0000-0000-000000000001',
   'Dr. Mohammad Rahman',
   'Professor & Head of Department',
   'b0000000-0000-0000-0000-000000000001',
   'Ph.D. in Computer Science from University of Dhaka. Research interests: Machine Learning, NLP, and Smart Agriculture Systems. 15+ years of teaching experience.',
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'),
  ('h0000000-0000-0000-0000-000000000002',
   'Dr. Fatima Akter',
   'Associate Professor',
   'b0000000-0000-0000-0000-000000000001',
   'Ph.D. in Software Engineering from BUET. Specialises in distributed systems, cloud computing, and DevOps. Published 25+ journal papers.',
   'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'),
  ('h0000000-0000-0000-0000-000000000003',
   'Dr. Abdul Karim',
   'Professor',
   'b0000000-0000-0000-0000-000000000003',
   'Ph.D. in Agronomy from Bangladesh Agricultural University. Expert in precision agriculture, soil science, and sustainable crop management.',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
  ('h0000000-0000-0000-0000-000000000004',
   'Ms. Nusrat Jahan',
   'Lecturer',
   'b0000000-0000-0000-0000-000000000001',
   'M.Sc. in Computer Science. Teaching focus: Web Development, Database Systems, and UI/UX Design. Currently pursuing Ph.D.',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400')
ON CONFLICT DO NOTHING;

-- =============================================
-- 9. ACADEMIC CALENDAR
-- =============================================
INSERT INTO public.academic_calendar (id, title, start_date, end_date, category, description) VALUES
  ('i0000000-0000-0000-0000-000000000001', 'Fall 2026 Classes Begin', '2026-09-01', '2026-12-20', 'Semester', 'Regular classes for Fall 2026 semester.'),
  ('i0000000-0000-0000-0000-000000000002', 'Mid-Term Examinations', '2026-11-15', '2026-11-25', 'Examination', 'Mid-term exams for all departments.'),
  ('i0000000-0000-0000-0000-000000000003', 'Winter Break', '2026-12-21', '2027-01-05', 'Holiday', 'University winter vacation period.'),
  ('i0000000-0000-0000-0000-000000000004', 'Spring 2027 Registration', '2027-01-06', '2027-01-15', 'Registration', 'Course registration for Spring 2027 semester.')
ON CONFLICT DO NOTHING;

-- =============================================
-- 10. ADMISSIONS INFO
-- =============================================
INSERT INTO public.admissions_info (id, faculty_id, requirements, process_steps, important_dates) VALUES
  ('j0000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000001',
   'HSC/A-Level with minimum GPA 4.0 in Science group. Must have Mathematics and Physics.',
   '1. Submit online application\n2. Pay application fee\n3. Appear for admission test\n4. Merit list publication\n5. Document verification & enrollment',
   'Application Deadline: December 15, 2026\nAdmission Test: January 10, 2027\nResult: January 20, 2027'),
  ('j0000000-0000-0000-0000-000000000002',
   'a0000000-0000-0000-0000-000000000002',
   'HSC/A-Level with minimum GPA 3.5 in Science or Agriculture group.',
   '1. Submit online application\n2. Pay application fee\n3. Appear for admission test\n4. Merit list publication\n5. Document verification & enrollment',
   'Application Deadline: December 20, 2026\nAdmission Test: January 12, 2027\nResult: January 22, 2027')
ON CONFLICT DO NOTHING;

-- =============================================
-- 11. CONTACT MESSAGES (sample)
-- =============================================
INSERT INTO public.contact_messages (id, name, email, subject, message) VALUES
  ('k0000000-0000-0000-0000-000000000001', 'Rahul Ahmed', 'rahul@example.com', 'Admission Inquiry', 'I would like to know about the CSE program admission requirements and scholarship opportunities.'),
  ('k0000000-0000-0000-0000-000000000002', 'Maria Begum', 'maria@example.com', 'Campus Visit Request', 'We are a group of 10 students from Rajshahi and would like to schedule a campus tour.')
ON CONFLICT DO NOTHING;

-- =============================================
-- NOTES
-- =============================================
-- Demo user accounts (admin, teacher, student) must be created via
-- Supabase Auth Dashboard. After creating them, update their profiles:
--
-- UPDATE public.profiles SET role = 'ADMIN', full_name = 'Demo Admin',
--   institutional_id = 'ADMIN-001',
--   department_id = 'b0000000-0000-0000-0000-000000000001'
-- WHERE email = 'admin@demo.ebaub.edu.bd';
--
-- UPDATE public.profiles SET role = 'TEACHER', full_name = 'Demo Teacher',
--   institutional_id = 'TCHR-001',
--   department_id = 'b0000000-0000-0000-0000-000000000001'
-- WHERE email = 'teacher@demo.ebaub.edu.bd';
--
-- UPDATE public.profiles SET role = 'STUDENT', full_name = 'Demo Student',
--   institutional_id = 'STU-2026-001', batch = '2026',
--   department_id = 'b0000000-0000-0000-0000-000000000001'
-- WHERE email = 'student@demo.ebaub.edu.bd';
