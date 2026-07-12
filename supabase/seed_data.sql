-- ==========================================
-- Educational Seed Data Script
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Clean up existing seed data (optional, but avoids primary key conflicts)
DELETE FROM public.scholarships WHERE id IN (
  '11111111-1111-1111-1111-111111111111', 
  '22222222-2222-2222-2222-222222222222', 
  '33333333-3333-3333-3333-333333333333'
);
DELETE FROM public.blogs WHERE id IN (
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666'
);
DELETE FROM public.books WHERE id IN (
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);
DELETE FROM public.content_items WHERE id IN (
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);
DELETE FROM public.subjects WHERE id IN (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'dddddddd-dddd-dddd-dddd-dddddddddddd'
);
DELETE FROM public.semesters WHERE id IN (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
);
DELETE FROM public.programs WHERE id IN (
  'ffffffff-ffff-ffff-ffff-ffffffffffff'
);
DELETE FROM public.universities WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);
DELETE FROM public.categories WHERE id IN (
  '10000000-0000-0000-0000-000000000000',
  '20000000-0000-0000-0000-000000000000',
  '30000000-0000-0000-0000-000000000000'
);

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon_name) VALUES
('10000000-0000-0000-0000-000000000000', 'Science & Technology', 'science-tech', 'Explore courses in Computing, Physics, Chemistry, and Math.', 'FlaskConical'),
('20000000-0000-0000-0000-000000000000', 'Management & Business', 'management', 'Business administration, finance, and management courses.', 'Briefcase'),
('30000000-0000-0000-0000-000000000000', 'Medical Sciences', 'medical', 'Preparation materials for MBBS, Nursing, and Pharmacy exams.', 'Activity');

-- 2. Insert Universities
INSERT INTO public.universities (id, name, short_name, logo_url, website_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Tribhuvan University', 'TU', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Tribhuvan_University_logo.svg/1200px-Tribhuvan_University_logo.svg.png', 'https://tu.edu.np'),
('00000000-0000-0000-0000-000000000002', 'Kathmandu University', 'KU', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Kathmandu_University_Logo.png', 'https://ku.edu.np'),
('00000000-0000-0000-0000-000000000003', 'Pokhara University', 'PU', 'https://upload.wikimedia.org/wikipedia/en/f/f6/Pokhara_University_Logo.png', 'https://pu.edu.np');

-- 3. Insert Programs
INSERT INTO public.programs (id, category_id, university_id, name, slug, description) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', '10000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'B.Sc. CSIT', 'bsc-csit', 'Bachelor of Science in Computer Science and Information Technology under TU.');

-- 4. Insert Semesters
INSERT INTO public.semesters (id, program_id, name, slug, order_index) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'First Semester', '1st-semester', 1);

-- 5. Insert Subjects
INSERT INTO public.subjects (id, category_id, name, slug, program_id, semester_id, syllabus_content) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10000000-0000-0000-0000-000000000000', 'Introduction to Information Technology', 'intro-to-it', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', E'# IIT Syllabus\n- Basics of Computer Hardware\n- Number Systems\n- OS Concepts\n- Networking basics'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-0000-0000-0000-000000000000', 'Calculus and Analytical Geometry', 'calculus', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', E'# Calculus Syllabus\n- Limits and Continuity\n- Derivatives\n- Applications of Derivatives\n- Integration'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '20000000-0000-0000-0000-000000000000', 'Principles of Management', 'pom', NULL, NULL, E'# POM Syllabus\n- Introduction to Management\n- Planning and Decision Making\n- Organizing and staffing');

-- 6. Insert Textbooks (Books)
INSERT INTO public.books (id, title, author, description, cover_image_url, file_url, subject_id, published_year) VALUES
('77777777-7777-7777-7777-777777777777', 'Calculus and Analytical Geometry', 'Thomas & Finney', 'The definitive reference textbook for first semester B.Sc. CSIT mathematics.', 'https://images-na.ssl-images-amazon.com/images/I/81U5PspO1rL.jpg', '/pdfs/books/calculus.pdf', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2005),
('88888888-8888-8888-8888-888888888888', 'Computer Fundamentals', 'P. K. Sinha', 'Complete textbook for introductory computer science and information technology.', 'https://images.shoptiques.com/products/4ce7b545-efcf-4404-b97c-9b5a1cf305d2_l.jpg', '/pdfs/books/Fundamentals.pdf', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2011);

-- 7. Insert Content Items (Notes & Question Papers)
INSERT INTO public.content_items (id, title, description, content_type, subject_id, file_url, downloads_count) VALUES
('99999999-9999-9999-9999-999999999999', 'Calculus Limits Notes', 'Chapter 1 Limits and Continuity detailed notes with solved examples.', 'note', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '/pdfs/notes/calculus-limits.pdf', 15),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TU CSIT IIT Board Exam 2080', 'Official Tribhuvan University final board question paper for IIT 2080.', 'question_paper', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/pdfs/exams/iit-2080.pdf', 38);

-- 8. Insert Scholarships
INSERT INTO public.scholarships (id, title, provider, amount, deadline, description, link_url, scholarship_type, eligibility_criteria, required_documents) VALUES
('11111111-1111-1111-1111-111111111111', 'Nepal Government Board Merit Scholarship', 'Ministry of Education, Nepal', 'NPR 50,000 / Semester', '2026-08-30 23:59:59+00', 'State-sponsored merit scholarship for students excelling in SEE and class 12 exams studying in public institutions.', 'https://moe.gov.np', 'Government', 'Nepali citizenship, minimum 3.6 GPA, enrolled in a public college.', '{"Citizenship Certificate","Academic Transcript","Character Certificate"}'),
('22222222-2222-2222-2222-222222222222', 'Erasmus Mundus Joint Master Degrees', 'European Union', 'Fully Funded (€1,500/month)', '2026-09-15 23:59:59+00', 'Prestigious international scholarship program for master studies in various European partner universities.', 'https://ec.europa.eu/programmes/erasmus-plus', 'International', 'Bachelor degree completed, English proficiency (IELTS 6.5+).', '{"Degree Certificate","LOM","2 Recommendation Letters"}'),
('33333333-3333-3333-3333-333333333333', 'HamroLearning Excellence Scholarship', 'HamroLearning Nepal Foundation', 'NPR 25,000 one-time', '2026-10-01 23:59:59+00', 'Private scholarship awarded to active students using HamroLearning portal showing exemplary academic potential.', 'https://hamrolearning.com', 'Private', 'Active user on HamroLearning, family income below NPR 3 Lakhs.', '{"Income Statement","College Recommendation Letter"}');

-- 9. Insert Blogs
INSERT INTO public.blogs (id, title, slug, excerpt, content, cover_image_url, author_id, published) VALUES
('44444444-4444-4444-4444-444444444444', 'How to Prepare for TU Board Exams: The Ultimate Guide', 'how-to-prepare-tu-exams', 'Tips and strategies to ace your upcoming Tribhuvan University semester exams.', E'# Preparing for TU Semester Exams\n\nPreparation is key to scoring good marks in TU board exams. Here are the top strategies used by toppers:\n\n## 1. Solve Past 5 Years Papers\nAlmost 70% of questions in TU follow similar patterns. Solving past papers builds immense confidence.\n\n## 2. Master the Syllabus\nEnsure you cover all points in the syllabus. TU rarely asks questions from outside the official syllabus.\n\n## 3. Clear Diagrams and Headings\nFormatting is vital in paper evaluation. Use neat headings, bullet points, and diagrams wherever applicable.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', NULL, TRUE),
('55555555-5555-5555-5555-555555555555', 'Top 5 Scholarships in Nepal You Should Apply For', 'top-scholarships-nepal-2026', 'A curated list of fully funded government and private scholarships for college students.', E'# Scholarships for Nepali Students\n\nCollege education can be expensive. Fortunately, there are several scholarship portals open to Nepali students:\n\n1. **Ministry of Education (MoE) Grants**\n2. **District Coordination Committee Scholarships**\n3. **Erasmus Mundus (for PG studies)**\n4. **Indian Embassy Golden Jubilee Scholarship**\n5. **Chinese Government Scholarship**', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', NULL, TRUE),
('66666666-6666-6666-6666-666666666666', 'Introduction to B.Sc. CSIT Course in Nepal', 'intro-to-bsc-csit-nepal', 'An overview of curriculum, career prospects, and entrance details for B.Sc. CSIT under TU.', E'# What is B.Sc. CSIT?\n\nB.Sc. CSIT is a 4-year, 8-semester course offered by Tribhuvan University, Nepal. It merges traditional computer science theory with modern IT practices.\n\n## Career Scope\nGraduates can work as:\n- Software Engineers\n- Database Administrators\n- Network Engineers\n- Data Scientists', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', NULL, TRUE);
