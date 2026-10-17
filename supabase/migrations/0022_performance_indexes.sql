-- Migration: 0022_performance_indexes.sql
-- Description: Explicit performance indexes on foreign keys, role filters, and submission relationships

-- 1. Profiles & Roles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON public.profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_institutional_id ON public.profiles(institutional_id);
CREATE INDEX IF NOT EXISTS idx_profiles_batch ON public.profiles(batch);

-- 2. Academic Hierarchy Foreign Keys
CREATE INDEX IF NOT EXISTS idx_departments_faculty_id ON public.departments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_programs_department_id ON public.programs(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_department_id ON public.courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_code ON public.courses(code);
CREATE INDEX IF NOT EXISTS idx_faculty_members_department_id ON public.faculty_members(department_id);
CREATE INDEX IF NOT EXISTS idx_admissions_info_faculty_id ON public.admissions_info(faculty_id);

-- 3. Teachers and Students Extension Tables
CREATE INDEX IF NOT EXISTS idx_teachers_department_id ON public.teachers(department_id);
CREATE INDEX IF NOT EXISTS idx_students_department_id ON public.students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_program_id ON public.students(program_id);

-- 4. Content Tables
CREATE INDEX IF NOT EXISTS idx_news_author_id ON public.news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_notices_author_id ON public.notices(author_id);
CREATE INDEX IF NOT EXISTS idx_notices_category ON public.notices(category);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);

-- 5. Course Materials & Sharing
CREATE INDEX IF NOT EXISTS idx_course_materials_teacher_id ON public.course_materials(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_course_code ON public.course_materials(course_code);
CREATE INDEX IF NOT EXISTS idx_cmd_material_id ON public.course_material_departments(material_id);
CREATE INDEX IF NOT EXISTS idx_cmd_department_id ON public.course_material_departments(department_id);

-- 6. Quizzes & Assessments
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'creator_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_quizzes_creator_id ON public.quizzes(creator_id);
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'teacher_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_quizzes_teacher_id ON public.quizzes(teacher_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_quizzes_course_code ON public.quizzes(course_code);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON public.quizzes(status);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);

-- 7. Exam Submissions & Answers
CREATE INDEX IF NOT EXISTS idx_exam_submissions_quiz_id ON public.exam_submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_student_id ON public.exam_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_quiz_student ON public.exam_submissions(quiz_id, student_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_submission_id ON public.exam_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_question_id ON public.exam_answers(question_id);

-- 8. Credential Whitelist & Study Hub
CREATE INDEX IF NOT EXISTS idx_credential_whitelist_institutional_id ON public.credential_whitelist(institutional_id);
CREATE INDEX IF NOT EXISTS idx_credential_whitelist_claimed_by ON public.credential_whitelist(claimed_by);
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'credential_whitelist' AND column_name = 'email'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_credential_whitelist_email ON public.credential_whitelist(email);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_student_id ON public.study_sessions(student_id);
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'study_sessions' AND column_name = 'user_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_study_sessions_material_id ON public.study_sessions(source_material_id);
