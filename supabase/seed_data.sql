-- ==========================================
-- Rich Educational Seed Data Script
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Clean up existing seed data (optional, but avoids primary key conflicts)
DELETE FROM public.scholarships WHERE id IN (
  '11111111-1111-1111-1111-111111111111', 
  '22222222-2222-2222-2222-222222222222', 
  '33333333-3333-3333-3333-333333333333',
  'dbdbdbdb-dbdb-dbdb-dbdb-dbdbdbdbdbdb'
);
DELETE FROM public.blogs WHERE id IN (
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  'abababab-abab-abab-abab-abababababab'
);
DELETE FROM public.books WHERE id IN (
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  'bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc',
  'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcdcd'
);
DELETE FROM public.content_items WHERE id IN (
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'dededede-dede-dede-dede-dededededede',
  'efefefef-efef-efef-efef-efefefefefef'
);
DELETE FROM public.subjects WHERE id IN (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
  'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
  'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'
);
DELETE FROM public.semesters WHERE id IN (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2'
);
DELETE FROM public.programs WHERE id IN (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2'
);
DELETE FROM public.universities WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);
DELETE FROM public.categories WHERE id IN (
  '10000000-0000-0000-0000-000000000000',
  '20000000-0000-0000-0000-000000000000',
  '30000000-0000-0000-0000-000000000000',
  '40000000-0000-0000-0000-000000000000',
  '50000000-0000-0000-0000-000000000000'
);

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon_name) VALUES
('10000000-0000-0000-0000-000000000000', 'Science & Technology', 'science-tech', 'Explore computing, physics, math, and chemistry.', 'FlaskConical'),
('20000000-0000-0000-0000-000000000000', 'Management & Business', 'management', 'Finance, marketing, and business management courses.', 'Briefcase'),
('30000000-0000-0000-0000-000000000000', 'Medical Sciences', 'medical', 'Prep papers and resources for MBBS, BDS, and Nursing.', 'Activity'),
('40000000-0000-0000-0000-000000000000', 'Loksewa Preparation', 'loksewa', 'Civil service preparation materials, GK, and IQ mock tests.', 'GraduationCap'),
('50000000-0000-0000-0000-000000000000', 'Entrance Preparation', 'entrance-prep', 'Syllabus and questions for IOE, IOM, and KU Entrance exams.', 'Brain');

-- 2. Insert Universities
INSERT INTO public.universities (id, name, short_name, logo_url, website_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Tribhuvan University', 'TU', 'https://picsum.photos/id/101/150/150', 'https://tu.edu.np'),
('00000000-0000-0000-0000-000000000002', 'Kathmandu University', 'KU', 'https://picsum.photos/id/102/150/150', 'https://ku.edu.np'),
('00000000-0000-0000-0000-000000000003', 'Pokhara University', 'PU', 'https://picsum.photos/id/103/150/150', 'https://pu.edu.np');

-- 3. Insert Programs
INSERT INTO public.programs (id, category_id, university_id, name, slug, description) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', '10000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'B.Sc. CSIT', 'bsc-csit', 'TU Bachelor of Science in Computer Science & IT.'),
('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', '40000000-0000-0000-0000-000000000000', NULL, 'Section Officer Prep', 'section-officer', 'Civil service administrative officer exam preparation.');

-- 4. Insert Semesters
INSERT INTO public.semesters (id, program_id, name, slug, order_index) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'First Semester', '1st-semester', 1),
('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'Paper I (General Knowledge)', 'gk-paper-1', 1);

-- 5. Insert Subjects
INSERT INTO public.subjects (id, category_id, name, slug, program_id, semester_id, syllabus_content) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10000000-0000-0000-0000-000000000000', 'Introduction to IT', 'intro-to-it', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', E'# IIT Syllabus\n- Basics of Computer Hardware\n- OS Concepts\n- Networking basics'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-0000-0000-0000-000000000000', 'Calculus and Analytical Geometry', 'calculus', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', E'# Calculus Syllabus\n- Limits and Continuity\n- Derivatives\n- Integration'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '20000000-0000-0000-0000-000000000000', 'Principles of Management', 'pom', NULL, NULL, E'# POM Syllabus\n- Introduction to Management\n- Organizing and Staffing'),
('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '10000000-0000-0000-0000-000000000000', 'Data Structures and Algorithms', 'dsa', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', E'# DSA Syllabus\n- Stacks & Queues\n- Binary Trees\n- Graph Algorithms\n- Sorting & Searching'),
('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', '40000000-0000-0000-0000-000000000000', 'General Knowledge & Current Affairs', 'gk-current-affairs', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', E'# GK Syllabus\n- Geography & History of Nepal\n- Constitution and Politics\n- Current Global Affairs'),
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', '30000000-0000-0000-0000-000000000000', 'Human Anatomy', 'human-anatomy', NULL, NULL, E'# Anatomy Syllabus\n- Cardiovascular system\n- Nervous system\n- Respiratory system');

-- 6. Insert Textbooks (Books)
INSERT INTO public.books (id, title, author, description, cover_image_url, file_url, subject_id, published_year) VALUES
('77777777-7777-7777-7777-777777777777', 'Calculus and Analytical Geometry', 'Thomas & Finney', 'Definitive reference textbook for first semester B.Sc. CSIT mathematics.', 'https://picsum.photos/id/24/150/210', '/pdfs/books/calculus.pdf', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2005),
('88888888-8888-8888-8888-888888888888', 'Computer Fundamentals', 'P. K. Sinha', 'Textbook for introductory computer science and information technology.', 'https://picsum.photos/id/30/150/210', '/pdfs/books/Fundamentals.pdf', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2011),
('bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc', 'Introduction to Algorithms', 'CLRS', 'Standard textbook for learning algorithms, complexity, and arrays.', 'https://picsum.photos/id/60/150/210', '/pdfs/books/clrs.pdf', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 2009),
('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcdcd', 'Loksewa GK Capsule', 'Nepali Writers Board', 'A concise study guide for history, culture, geography, and polity of Nepal.', 'https://picsum.photos/id/80/150/210', '/pdfs/books/gk_capsule.pdf', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 2024);

-- 7. Insert Content Items (Notes & Question Papers)
INSERT INTO public.content_items (id, title, description, content_type, subject_id, file_url, downloads_count) VALUES
('99999999-9999-9999-9999-999999999999', 'Calculus Limits Notes', 'Chapter 1 Limits and Continuity detailed notes with solved examples.', 'note', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '/pdfs/notes/calculus-limits.pdf', 15),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TU CSIT IIT Board Exam 2080', 'Official Tribhuvan University final board question paper for IIT 2080.', 'question_paper', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/pdfs/exams/iit-2080.pdf', 38),
('dededede-dede-dede-dede-dededededede', 'DSA Stacks and Queues Notes', 'Complete implementation notes of Stacks and Queues using Linked List in C++.', 'note', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '/pdfs/notes/dsa-stacks.pdf', 29),
('efefefef-efef-efef-efef-efefefefefef', 'Loksewa Section Officer Exam 2080', 'First paper General Knowledge exam question paper from Loksewa Commission.', 'question_paper', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', '/pdfs/exams/loksewa-2080.pdf', 84);

-- 8. Insert Scholarships
INSERT INTO public.scholarships (id, title, provider, amount, deadline, description, link_url, scholarship_type, eligibility_criteria, required_documents) VALUES
('11111111-1111-1111-1111-111111111111', 'Embassy of India Golden Jubilee Scholarship', 'Embassy of India, Kathmandu', 'NPR 4,000 / Month', '2026-08-30 23:59:59+00', 'Awarded to Nepalese students pursuing undergraduate degree courses in medicine, engineering, science, or arts in Nepal.', 'https://www.goischolarship.com.np', 'Government', 'Nepali citizenship, minimum 70% marks in Class 12, family income below 2 Lakhs per annum.', '{"Citizenship Certificate","Class 12 Marks Sheet","Income Certificate"}'),
('22222222-2222-2222-2222-222222222222', 'Erasmus Mundus Joint Master Degrees', 'European Union', 'Fully Funded (€1,500/month)', '2026-09-15 23:59:59+00', 'Prestigious international scholarship program for postgraduate studies in various European partner universities.', 'https://ec.europa.eu/programmes/erasmus-plus', 'International', 'Bachelor degree completed, English proficiency (IELTS 6.5+).', '{"Degree Certificate","LOM","2 Recommendation Letters"}'),
('33333333-3333-3333-3333-333333333333', 'Nepal Youth Foundation College Scholarship', 'Nepal Youth Foundation', 'Covers Tuition & Lodging', '2026-10-01 23:59:59+00', 'Offers financial support for underprivileged youth, focusing on students facing systemic or financial barriers.', 'https://www.nepalyouthfoundation.org', 'Private', 'Enrolled in Nepalese public college, financial hardship verification.', '{"Income Proof","College Admission Offer"}'),
('dbdbdbdb-dbdb-dbdb-dbdb-dbdbdbdbdbdb', 'Pokhara University Open Scholarship Scheme', 'Pokhara University Faculty Board', '100% Tuition Waiver', '2026-11-20 23:59:59+00', 'Merit-cum-means scholarship allocated for government school students to pursue engineering, management, or IT degrees.', 'https://pu.edu.np', 'Government', 'Graduated from a public/government school in Nepal, cleared PU Entrance Exam.', '{"Government School verification certificate","PU Admit Card"}');

-- 9. Insert Blogs
INSERT INTO public.blogs (id, title, slug, excerpt, content, cover_image_url, author_id, published) VALUES
('44444444-4444-4444-4444-444444444444', 'How to Prepare for TU Board Exams: The Ultimate Guide', 'how-to-prepare-tu-exams', 'Tips and strategies to ace your upcoming Tribhuvan University semester exams.', E'# Preparing for TU Semester Exams\n\nPreparation is key to scoring good marks in TU board exams. Here are the top strategies used by toppers:\n\n## 1. Solve Past 5 Years Papers\nAlmost 70% of questions in TU follow similar patterns. Solving past papers builds immense confidence.\n\n## 2. Master the Syllabus\nEnsure you cover all points in the syllabus. TU rarely asks questions from outside the official syllabus.\n\n## 3. Clear Diagrams and Headings\nFormatting is vital in paper evaluation. Use neat headings, bullet points, and diagrams wherever applicable.', 'https://picsum.photos/id/10/800/450', NULL, TRUE),
('55555555-5555-5555-5555-555555555555', 'Golden Jubilee Scholarship Scheme by Indian Embassy: How to Apply', 'golden-jubilee-scholarship-guide', 'A comprehensive guide on documents, eligibility, and the online application process.', E'# Golden Jubilee Scholarship Guide\n\nThe Golden Jubilee Scholarship Scheme is one of the most popular scholarships in Nepal, supporting students through their undergraduate journey.\n\n## Eligibility Criteria\n- Must be a Nepalese citizen.\n- Enrolled in the first year of an undergraduate course in Nepal.\n- Age should be between 17 and 22 years.\n- At least 70% aggregate marks in Class 12.\n\n## Required Documents\nMake sure to prepare digital copies of:\n1. Nepalese Citizenship Card.\n2. Transcript and Character Certificate of Class 12.\n3. Recommendation letter from the College Principal.\n4. Income certificate showing family earnings below NPR 2,00,000 annually.', 'https://picsum.photos/id/20/800/450', NULL, TRUE),
('66666666-6666-6666-6666-666666666666', 'Introduction to B.Sc. CSIT Course in Nepal', 'intro-to-bsc-csit-nepal', 'An overview of curriculum, career prospects, and entrance details for B.Sc. CSIT under TU.', E'# What is B.Sc. CSIT?\n\nB.Sc. CSIT is a 4-year, 8-semester course offered by Tribhuvan University, Nepal. It merges traditional computer science theory with modern IT practices.\n\n## Career Scope\nGraduates can work as:\n- Software Engineers\n- Database Administrators\n- Network Engineers\n- Data Scientists', 'https://picsum.photos/id/48/800/450', NULL, TRUE),
('abababab-abab-abab-abab-abababababab', 'Step-by-Step Loksewa Exam Preparation for Beginners', 'loksewa-preparation-for-beginners', 'How to start reading General Knowledge, History, and IQ items for Nepalese civil service exams.', E'# Loksewa Preparation Roadmap\n\nPassing the Loksewa (Public Service Commission) exam requires consistent practice and smart reading strategies.\n\n## 1. Focus on GK and IQ first\nFor almost all positions, the first paper consists of General Knowledge and IQ test. Build a solid base by reading local geographical and historical books.\n\n## 2. Read Nepali Newspapers Daily\nKeep yourself updated with current national events, cabinet decisions, and international developments.\n\n## 3. Practice Mock Tests\nPractice solving 50 GK/IQ questions daily within the set time limits to improve accuracy and speed.', 'https://picsum.photos/id/64/800/450', NULL, TRUE);
