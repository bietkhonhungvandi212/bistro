-- Updated Accounts for Students
INSERT INTO accounts (email, password, account_type, phone_number, name, gender, status, dob, bio, is_active, created_at, updated_at)
VALUES
    ('student1@gmail.com', '123!Student', 'STUDENT', '0933444545', 'Nguyen Ho Cuu Bao', 'MALE', 'ACTIVE',
     '2003-02-21', 'Aspiring software engineer interested in backend development.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student2@gmail.com', '123!Student', 'STUDENT', '0933444546', 'Tran Thi Bao Ngoc', 'FEMALE', 'ACTIVE',
     '2004-03-15', 'Exploring artificial intelligence and NLP technologies.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student3@gmail.com', '123!Student', 'STUDENT', '0933444547', 'Le Minh Tam', 'MALE', 'ACTIVE', '2002-05-10',
     'Focused on data science and predictive analytics.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student4@gmail.com', '123!Student', 'STUDENT', '0933444548', 'Nguyen Thi Kim Anh', 'FEMALE', 'ACTIVE',
     '2003-09-30', 'Passionate about UX/UI design and user-centered solutions.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student5@gmail.com', '123!Student', 'STUDENT', '0933444549', 'Hoang Gia Bao', 'MALE', 'ACTIVE', '2003-12-12',
     'Exploring advanced software engineering techniques.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student6@gmail.com', '123!Student', 'STUDENT', '0933444550', 'Pham Quang Huy', 'MALE', 'ACTIVE', '2004-06-06',
     'Interested in cloud computing and scalable systems.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student7@gmail.com', '123!Student', 'STUDENT', '0933444551', 'Vo Bao Chau', 'FEMALE', 'ACTIVE', '2005-01-18',
     'Designing intuitive interfaces with a focus on UX.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student8@gmail.com', '123!Student', 'STUDENT', '0933444552', 'Dang Minh Hoang', 'MALE', 'ACTIVE', '2003-11-25',
     'Building machine learning models for data analysis.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student9@gmail.com', '123!Student', 'STUDENT', '0933444553', 'Nguyen Phuong Linh', 'FEMALE', 'ACTIVE',
     '2001-12-27','Developing secure systems in cybersecurity.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ('student10@gmail.com', '123!Student', 'STUDENT', '0933444554', 'Le Quoc Bao', 'MALE', 'ACTIVE', '2005-04-22',
     'Innovating in robotics and AI systems.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Updated Students Table
INSERT INTO students (account_id, major, educational_level, is_active, created_at, updated_at)
VALUES
    ((SELECT id FROM accounts WHERE email = 'student1@gmail.com'), 'software engineering', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student2@gmail.com'), 'artificial intelligence', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student3@gmail.com'), 'data science', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student4@gmail.com'), 'ux/ui design', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student5@gmail.com'), 'software engineering', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student6@gmail.com'), 'software engineering', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student7@gmail.com'), 'ux/ui design', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student8@gmail.com'), 'data science', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student9@gmail.com'), 'software engineering', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
    ((SELECT id FROM accounts WHERE email = 'student10@gmail.com'), 'artificial intelligence', 'UNIVERSITY', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);



-- Profile Achievements for Students

-- Achievements for Student 1 (Account ID: 2)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, 
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'vietnam national university hanoi (vnu hanoi)', NULL, 'software engineering', '2020-09-01', '2024-06-30', 
 'Studying software engineering with a focus on backend development.', false, 
 (SELECT id FROM accounts WHERE email = 'student1@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Certification
('CERTIFICATION', 'aws certified solutions architect', 'amazon web services (aws)', NULL, NULL, '2023-07-01', NULL, 
 'Certified AWS Solutions Architect with cloud computing expertise.', true, 
 (SELECT id FROM accounts WHERE email = 'student1@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Student 2 (Account ID: 3)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, 
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'hanoi university of science and technology (hust)', NULL, 'artificial intelligence', '2019-09-01', '2023-06-30', 
 'Specialized in artificial intelligence and natural language processing.', false, 
 (SELECT id FROM accounts WHERE email = 'student2@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Experience
('EXPERIENCE', NULL, 'vng corporation', 'intern', NULL, '2022-06-01', '2022-12-31', 
 'Worked on AI-driven chatbot development.', false, 
 (SELECT id FROM accounts WHERE email = 'student2@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Student 3 (Account ID: 4)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, 
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'university of information technology (uit)', NULL, 'data science', '2021-09-01', '2025-06-30', 
 'Focused on predictive analytics and data visualization.', false, 
 (SELECT id FROM accounts WHERE email = 'student3@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Certification
('CERTIFICATION', 'google certified data engineer', 'google', NULL, NULL, '2023-11-01', NULL, 
 'Google-certified data engineer with expertise in data pipelines.', true, 
 (SELECT id FROM accounts WHERE email = 'student3@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Student 4 (Account ID: 5)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, 
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'rmit university vietnam (rmit)', NULL, 'ux/ui design', '2020-09-01', '2024-06-30', 
 'Specialized in UX/UI design and human-centered design principles.', false, 
 (SELECT id FROM accounts WHERE email = 'student4@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Experience
('EXPERIENCE', NULL, 'tma solutions', 'intern', NULL, '2023-02-01', '2023-08-01', 
 'Contributed to UI/UX design for enterprise software solutions.', false, 
 (SELECT id FROM accounts WHERE email = 'student4@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Student 5 (Account ID: 6)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, 
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'fpt university ho chi minh city', NULL, 'software engineering', '2019-09-01', '2023-06-30', 
 'Studied software engineering with a focus on scalable systems.', false, 
 (SELECT id FROM accounts WHERE email = 'student5@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Certification
('CERTIFICATION', 'certified kubernetes administrator (cka)', 'kubernetes (cncf - cloud native computing foundation)', NULL, NULL, '2023-09-01', NULL, 
 'Certified Kubernetes administrator for managing containerized applications.', true, 
 (SELECT id FROM accounts WHERE email = 'student5@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Student 6 (Account ID: 7)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, 
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'ho chi minh city university of science and technology (hcmut)', NULL, 'software engineering', '2020-09-01', '2024-06-30', 
 'Focused on backend development and cloud computing.', false, 
 (SELECT id FROM accounts WHERE email = 'student6@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Experience
('EXPERIENCE', NULL, 'viettel group', 'intern', NULL, '2023-03-01', '2023-09-30', 
 'Worked on cloud infrastructure projects.', false, 
 (SELECT id FROM accounts WHERE email = 'student6@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Student 7
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description,
                                  is_current, account_id, is_active, created_at, updated_at) VALUES 
-- Education
('EDUCATION', NULL, 'vietnam national university ho chi minh city (vnu hcm)', NULL, 'data science', '2020-09-01', 
 '2024-06-30', 'Studying Data Science.', false, (SELECT id FROM accounts WHERE email = 'student7@gmail.com'), true, 
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Certification
('CERTIFICATION', 'google certified professional cloud architect', 'google', NULL, NULL, '2023-03-01', NULL,
 'Achieved certification in cloud architecture.', true, (SELECT id FROM accounts WHERE email = 'student7@gmail.com'), true,
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Experience
('EXPERIENCE', NULL, 'vnpt', 'data scientist', NULL, '2022-11-01', '2023-06-01',
 'Worked on optimizing data pipelines and models.', false, (SELECT id FROM accounts WHERE email = 'student7@gmail.com'), true,
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

 -- Achievements for Student 8
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description,
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'ho chi minh city university of science (hcmus)', NULL, 'artificial intelligence', '2019-09-01', 
 '2023-06-30', 'Pursued a degree in Artificial Intelligence.', false, (SELECT id FROM accounts WHERE email = 'student8@gmail.com'), true, 
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Certification
('CERTIFICATION', 'aws certified developer', 'amazon web services (aws)', NULL, NULL, '2022-07-01', NULL,
 'Gained expertise in developing AWS-based solutions.', true, (SELECT id FROM accounts WHERE email = 'student8@gmail.com'), true,
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Experience
('EXPERIENCE', NULL, 'fpt corporation', 'ai engineer', NULL, '2021-10-01', '2022-12-31',
 'Developed AI solutions for customer analytics.', false, (SELECT id FROM accounts WHERE email = 'student8@gmail.com'), true,
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Student 9
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description,
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'university of information technology (uit)', NULL, 'software engineering', '2020-09-01', 
 '2024-06-30', 'Studying Software Engineering.', false, (SELECT id FROM accounts WHERE email = 'student9@gmail.com'), true, 
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Certification
('CERTIFICATION', 'certified kubernetes administrator (cka)', 'kubernetes (cncf - cloud native computing foundation)', NULL, NULL, 
 '2023-04-01', NULL, 'Achieved certification in Kubernetes Administration.', true, (SELECT id FROM accounts WHERE email = 'student9@gmail.com'), true,
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Experience
('EXPERIENCE', NULL, 'viettel group', 'devops engineer', NULL, '2022-01-01', '2023-05-31',
 'Implemented and maintained CI/CD pipelines.', false, (SELECT id FROM accounts WHERE email = 'student9@gmail.com'), true,
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Student 10
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description,
                                  is_current, account_id, is_active, created_at, updated_at)
VALUES 
-- Education
('EDUCATION', NULL, 'ho chi minh city university of technology (hcmut)', NULL, 'artificial intelligence', '2021-09-01', 
 '2025-06-30', 'Specialized in Artificial Intelligence.', false, (SELECT id FROM accounts WHERE email = 'student10@gmail.com'), true, 
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Certification
('CERTIFICATION', 'google professional machine learning engineer', 'google', NULL, NULL, '2024-02-01', NULL,
 'Earned certification in machine learning engineering.', true, (SELECT id FROM accounts WHERE email = 'student10@gmail.com'), true,
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
-- Experience
('EXPERIENCE', NULL, 'cmc corporation', 'machine learning engineer', NULL, '2023-07-01', NULL,
 'Worked on deploying scalable machine learning models.', true, (SELECT id FROM accounts WHERE email = 'student10@gmail.com'), true,
 EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);




-- Assign Interested Categories to Students
WITH student_accounts AS (SELECT id AS user_id
                          FROM accounts
                          WHERE account_type = 'STUDENT'),
     random_categories AS (SELECT id AS category_id
                           FROM categories
                           WHERE level = 1 -- Only child categories
                           ORDER BY RANDOM()
                           LIMIT 10 -- Choose 10 random child categories
     )
INSERT
INTO user_interested_categories (user_id, category_id, is_active, created_at, updated_at)
SELECT sa.user_id,
       rc.category_id,
       true                              AS is_active,
       EXTRACT(EPOCH FROM NOW())::BIGINT AS created_at,
       EXTRACT(EPOCH FROM NOW())::BIGINT AS updated_at
FROM student_accounts sa
         CROSS JOIN random_categories rc;