-- Insert Accounts for Mentors
INSERT INTO accounts (email, password, account_type, phone_number, name, gender, status, dob, bio, is_active, created_at, updated_at)
VALUES
('mentor1@gmail.com', '123!Mentor', 'MENTOR', '0933444555', 'Tran Van Khoa', 'MALE', 'ACTIVE', '1985-05-15', 'Experienced software engineer specializing in AI.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor2@gmail.com', '123!Mentor', 'MENTOR', '0933444556', 'Nguyen Thi Thanh', 'FEMALE', 'ACTIVE', '1990-03-22', 'Professional graphic designer with a passion for teaching.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor3@gmail.com', '123!Mentor', 'MENTOR', '0933444557', 'Pham Quang Minh', 'MALE', 'ACTIVE', '1982-12-02', 'Senior financial analyst with over 15 years of experience.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor4@gmail.com', '123!Mentor', 'MENTOR', '0933444558', 'Le Hoang Phuong', 'FEMALE', 'ACTIVE', '1988-09-09', 'Software development coach focusing on backend technologies.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor5@gmail.com', '123!Mentor', 'MENTOR', '0933444559', 'Do Tuan Kiet', 'MALE', 'ACTIVE', '1979-11-11', 'Data scientist specializing in machine learning models.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor6@gmail.com', '123!Mentor', 'MENTOR', '0933444560', 'Hoang Thi Lan', 'FEMALE', 'ACTIVE', '1992-04-01', 'Expert in digital marketing strategies and SEO.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor7@gmail.com', '123!Mentor', 'MENTOR', '0933444561', 'Nguyen Quoc Bao', 'MALE', 'ACTIVE', '1986-07-17', 'Blockchain developer with expertise in cryptocurrency.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor8@gmail.com', '123!Mentor', 'MENTOR', '0933444562', 'Tran Thi Hanh', 'FEMALE', 'ACTIVE', '1995-02-25', 'UX/UI designer focused on accessibility and usability.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor9@gmail.com', '123!Mentor', 'MENTOR', '0933444563', 'Le Thanh Nam', 'MALE', 'ACTIVE', '1983-08-30', 'Network engineer with hands-on experience in Cisco systems.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor10@gmail.com', '123!Mentor', 'MENTOR', '0933444564', 'Pham Minh Chau', 'FEMALE', 'ACTIVE', '1987-10-18', 'Educational expert in mathematics and physics.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Accounts for Mentors
INSERT INTO accounts (email, password, account_type, phone_number, name, gender, status, dob, bio, is_active, created_at, updated_at)
VALUES
('mentor11@gmail.com', '123!Mentor', 'MENTOR', '0933444565', 'Nguyen Van A', 'MALE', 'ACTIVE', '1984-01-20', 'Senior Java developer with over 10 years of experience.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor12@gmail.com', '123!Mentor', 'MENTOR', '0933444566', 'Tran Thi B', 'FEMALE', 'ACTIVE', '1989-12-11', 'Certified project manager with a passion for teaching Agile methodologies.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor13@gmail.com', '123!Mentor', 'MENTOR', '0933444567', 'Pham Quoc C', 'MALE', 'ACTIVE', '1991-04-05', 'Experienced data analyst specializing in business intelligence tools.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor14@gmail.com', '123!Mentor', 'MENTOR', '0933444568', 'Le Thi D', 'FEMALE', 'ACTIVE', '1994-07-18', 'Graphic designer with expertise in Adobe Creative Suite.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor15@gmail.com', '123!Mentor', 'MENTOR', '0933444569', 'Hoang Van E', 'MALE', 'ACTIVE', '1986-03-30', 'Network architect with a focus on large-scale infrastructure.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);
INSERT INTO accounts (email, password, account_type, phone_number, name, gender, status, dob, bio, is_active, created_at, updated_at)
VALUES
('mentor16@gmail.com', '123!Mentor', 'MENTOR', '0933444570', 'Nguyen Thi Hoa', 'FEMALE', 'ACTIVE', '1988-05-14', 'Experienced mentor in software engineering.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor17@gmail.com', '123!Mentor', 'MENTOR', '0933444571', 'Le Minh Tuan', 'MALE', 'ACTIVE', '1992-11-22', 'Senior cloud architect specializing in AWS and Azure.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor18@gmail.com', '123!Mentor', 'MENTOR', '0933444572', 'Tran Quang Huy', 'MALE', 'ACTIVE', '1985-03-10', 'Expert in data science and machine learning.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor19@gmail.com', '123!Mentor', 'MENTOR', '0933444573', 'Pham Thi Ha', 'FEMALE', 'ACTIVE', '1990-07-19', 'UI/UX designer focusing on accessibility.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('mentor20@gmail.com', '123!Mentor', 'MENTOR', '0933444574', 'Hoang Quoc Bao', 'MALE', 'ACTIVE', '1983-01-30', 'Cybersecurity specialist with 15 years of experience.', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Mentors (Link to Accounts by Email)
INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['ADVANCED', 'EXPERT']::"EducationalLevel"[],
       'Mentoring in advanced AI development.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor1@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['BEGINNER', 'INTERMEDIATE'] ::"EducationalLevel"[],
       'Helping students master graphic design skills.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor2@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['ADVANCED', 'EXPERT'] ::"EducationalLevel"[],
       'Financial analysis mentoring for professionals.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor3@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['UNIVERSITY', 'POSTGRADUATE'] ::"EducationalLevel"[],
       'Guiding developers in backend system architecture.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor4@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['EXPERT', 'ADVANCED']::"EducationalLevel"[],
       'Offering mentorship in data science and ML.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor5@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['BEGINNER', 'INTERMEDIATE']::"EducationalLevel"[],
       'Providing mentorship in digital marketing.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor6@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['UNIVERSITY', 'POSTGRADUATE']::"EducationalLevel"[],
       'Teaching blockchain development for beginners.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor7@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['ADVANCED', 'EXPERT']::"EducationalLevel"[],
       'Mentoring UX/UI designers to enhance usability skills.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor8@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['ADVANCED', 'EXPERT']::"EducationalLevel"[],
       'Guiding network engineers in Cisco system deployments.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor9@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['UNIVERSITY', 'POSTGRADUATE']::"EducationalLevel"[],
       'Mentoring in mathematics and physics education.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor10@gmail.com';

-- Insert Mentors (Link to Accounts by Email)
INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['ADVANCED', 'EXPERT']::"EducationalLevel"[],
       'Providing mentorship in advanced Java development.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor11@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['INTERMEDIATE', 'ADVANCED']::"EducationalLevel"[],
       'Teaching Agile methodologies and project management.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor12@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['UNIVERSITY', 'POSTGRADUATE']::"EducationalLevel"[],
       'Mentoring in business intelligence and data analytics.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor13@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['BEGINNER', 'INTERMEDIATE']::"EducationalLevel"[],
       'Helping students master graphic design techniques.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor14@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['EXPERT', 'ADVANCED']::"EducationalLevel"[],
       'Providing mentorship on network architecture and infrastructure design.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor15@gmail.com';
-- Insert Mentors (Link to Accounts by Email)
INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['UNIVERSITY', 'POSTGRADUATE']::"EducationalLevel"[],
       'Mentoring in advanced software engineering concepts.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor16@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['ADVANCED', 'EXPERT']::"EducationalLevel"[],
       'Providing mentorship in cloud architecture and deployment.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor17@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['BEGINNER', 'INTERMEDIATE']::"EducationalLevel"[],
       'Teaching data science and machine learning for beginners.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor18@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['INTERMEDIATE', 'ADVANCED']::"EducationalLevel"[],
       'Mentoring in UI/UX design with a focus on usability.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor19@gmail.com';

INSERT INTO mentors (account_id, status, target_level, description, accepted_at, is_active, created_at, updated_at)
SELECT id,
       'ACCEPTED',
       ARRAY['EXPERT', 'ADVANCED']::"EducationalLevel"[],
       'Providing guidance on cybersecurity best practices.',
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       true,
       EXTRACT(EPOCH FROM NOW())::BIGINT,
       EXTRACT(EPOCH FROM NOW())::BIGINT
FROM accounts WHERE email = 'mentor20@gmail.com';

-- Achievements for Mentor 1 (mentor1@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'vietnam national university hanoi (vnu hanoi)', NULL, 'artificial intelligence', '2003-09-01', '2007-06-30', 'Graduated with a degree in Artificial Intelligence.', false,
(SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vintech (vingroup)', 'senior ai engineer', NULL, '2008-01-01', '2020-12-31', 'Developed AI-powered solutions for smart cities.', false,
(SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'samsung vietnam', 'ai researcher', NULL, '2021-01-01', NULL, 'Conducting research in natural language processing.', true,
(SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'google professional machine learning engineer', 'google', NULL, NULL, '2022-05-01', NULL, 'Certified in advanced machine learning systems.', true,
(SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 2 (mentor2@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'rmit university vietnam (rmit)', NULL, 'ux/ui design', '2009-09-01', '2013-06-30', 'Graduated with a degree in UX/UI Design.', false,
(SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'freelance', 'senior graphic designer', NULL, '2014-01-01', NULL, 'Designed branding materials for multiple companies.', true,
(SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'samsung vietnam', 'graphic designer', NULL, '2014-01-01', '2022-12-31', 'Led projects on user experience optimization.', false,
(SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'adobe certified expert', 'adobe', NULL, NULL, '2018-04-01', NULL, 'Certified in Adobe Creative Suite.', true,
(SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 3 (mentor3@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'national economics university (neu)', NULL, 'finance', '2000-09-01', '2004-06-30', 'Graduated with a degree in Finance.', false,
(SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vietcombank', 'senior financial analyst', NULL, '2005-01-01', '2019-12-31', 'Managed financial portfolios for high-value clients.', false,
(SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vpbank', 'risk manager', NULL, '2020-01-01', NULL, 'Specializing in risk assessment for corporate banking.', true,
(SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'chartered financial analyst (cfa)', 'cfa institute', NULL, NULL, '2015-09-01', NULL, 'Earned CFA charterholder status.', true,
(SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 4 (mentor4@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'ho chi minh city university of science and technology (hcmut)', NULL, 'information technology', '2005-09-01', '2009-06-30', 'Graduated with expertise in backend systems.', false,
(SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vnpt', 'software engineer', NULL, '2010-01-01', '2022-12-31', 'Developed national telecom infrastructure software.', false,
(SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'fpt corporation', 'backend architect', NULL, '2023-01-01', NULL, 'Leading backend design for enterprise applications.', true,
(SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'microsoft certified: azure solutions architect', 'microsoft', NULL, NULL, '2018-03-01', NULL, 'Certified in Azure architecture design.', true,
(SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 5 (mentor5@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'vietnam national university da nang (vnu da nang)', NULL, 'data science', '2007-09-01', '2011-06-30', 'Graduated with a degree in Data Science.', false,
(SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'fpt corporation', 'data scientist', NULL, '2012-01-01', '2020-12-31', 'Built predictive models for enterprise applications.', false,
(SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'viettel group', 'senior data scientist', NULL, '2021-01-01', NULL, 'Leading data-driven decision-making solutions.', true,
(SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'google certified professional cloud architect', 'google', NULL, NULL, '2020-09-01', NULL, 'Certified in cloud infrastructure design.', true,
(SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Achievements for Mentor 6 (mentor6@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'ho chi minh city university of technology (hcmut)', NULL, 'digital marketing', '2010-09-01', '2014-06-30', 'Graduated with a degree in Digital Marketing.', false,
(SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vng corporation', 'marketing manager', NULL, '2015-01-01', '2020-12-31', 'Led marketing campaigns for online platforms.', false,
(SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'google ads certification', 'google', NULL, NULL, '2018-04-01', NULL, 'Certified in Google Ads management.', true,
(SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'facebook blueprint certification', 'facebook', NULL, NULL, '2019-08-01', NULL, 'Expert in Facebook Ads management.', true,
(SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 7 (mentor7@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'university of information technology (uit)', NULL, 'blockchain technology', '2011-09-01', '2015-06-30', 'Graduated with a degree in Blockchain Technology.', false,
(SELECT id FROM accounts WHERE email = 'mentor7@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'orient software', 'blockchain developer', NULL, '2016-01-01', '2020-12-31', 'Developed smart contracts for blockchain platforms.', false,
(SELECT id FROM accounts WHERE email = 'mentor7@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'cmc corporation', 'senior blockchain developer', NULL, '2021-01-01', NULL, 'Leading blockchain projects for financial applications.', true,
(SELECT id FROM accounts WHERE email = 'mentor7@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 8 (mentor8@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'rmit university vietnam (rmit)', NULL, 'ux/ui design', '2012-09-01', '2016-06-30', 'Graduated with a focus on user-centered design.', false,
(SELECT id FROM accounts WHERE email = 'mentor8@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'fpt corporation', 'ux/ui designer', NULL, '2017-01-01', '2022-12-31', 'Redesigned interfaces for enterprise systems.', false,
(SELECT id FROM accounts WHERE email = 'mentor8@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'adobe certified expert', 'adobe', NULL, NULL, '2018-06-01', NULL, 'Certified in Adobe XD and Photoshop.', true,
(SELECT id FROM accounts WHERE email = 'mentor8@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'google ux design professional certificate', 'google', NULL, NULL, '2020-10-01', NULL, 'Certified in UX design principles.', true,
(SELECT id FROM accounts WHERE email = 'mentor8@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 9 (mentor9@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'ho chi minh city university of technology and education (hcmute)', NULL, 'network engineering', '2008-09-01', '2012-06-30', 'Graduated with expertise in Network Engineering.', false,
(SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vnpt', 'network engineer', NULL, '2013-01-01', '2018-12-31', 'Designed and maintained network infrastructure.', false,
(SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'viettel group', 'senior network engineer', NULL, '2019-01-01', NULL, 'Leading the development of secure network systems.', true,
(SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'cisco certified network associate (ccna)', 'cisco systems', NULL, NULL, '2015-07-01', NULL, 'Gained expertise in Cisco networking.', true,
(SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 10 (mentor10@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'vietnam national university hanoi (vnu hanoi)', NULL, 'mathematics', '2006-09-01', '2010-06-30', 'Graduated with a degree in Mathematics.', false,
(SELECT id FROM accounts WHERE email = 'mentor10@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vietcombank', 'data analyst', NULL, '2011-01-01', '2016-12-31', 'Analyzed banking data for optimized decision-making.', false,
(SELECT id FROM accounts WHERE email = 'mentor10@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'bidv', 'senior data analyst', NULL, '2017-01-01', NULL, 'Leading data analytics projects for financial applications.', true,
(SELECT id FROM accounts WHERE email = 'mentor10@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'google certified data engineer', 'google', NULL, NULL, '2018-09-01', NULL, 'Specialized in data engineering solutions.', true,
(SELECT id FROM accounts WHERE email = 'mentor10@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Achievements for Mentor 11 (mentor11@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'hanoi university of science and technology (hust)', NULL, 'software engineering', '2003-09-01', '2007-06-30', 'Graduated with a degree in Software Engineering.', false,
(SELECT id FROM accounts WHERE email = 'mentor11@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'fpt corporation', 'junior software engineer', NULL, '2008-01-01', '2011-12-31', 'Developed backend systems for enterprise solutions.', false,
(SELECT id FROM accounts WHERE email = 'mentor11@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vintech (vingroup)', 'senior software engineer', NULL, '2012-01-01', '2018-12-31', 'Led software development projects.', false,
(SELECT id FROM accounts WHERE email = 'mentor11@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'samsung vietnam', 'software architect', NULL, '2019-01-01', NULL, 'Designing scalable software architectures for IoT devices.', true,
(SELECT id FROM accounts WHERE email = 'mentor11@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 12 (mentor12@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'foreign trade university (ftu)', NULL, 'business administration', '2005-09-01', '2009-06-30', 'Graduated with a degree in Business Administration.', false,
(SELECT id FROM accounts WHERE email = 'mentor12@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vietcombank', 'project manager', NULL, '2010-01-01', '2014-12-31', 'Managed digital transformation projects.', false,
(SELECT id FROM accounts WHERE email = 'mentor12@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'rmit university vietnam (rmit)', 'lecturer', NULL, '2015-01-01', '2020-12-31', 'Taught project management and Agile practices.', false,
(SELECT id FROM accounts WHERE email = 'mentor12@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 13 (mentor13@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'vietnam national university ho chi minh city (vnu hcm)', NULL, 'data science', '2007-09-01', '2011-06-30', 'Graduated with a focus on Data Science.', false,
(SELECT id FROM accounts WHERE email = 'mentor13@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vnpt', 'data analyst', NULL, '2012-01-01', '2016-12-31', 'Developed predictive analytics models.', false,
(SELECT id FROM accounts WHERE email = 'mentor13@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'viettel group', 'senior data scientist', NULL, '2017-01-01', '2022-12-31', 'Built machine learning models for telecommunications.', false,
(SELECT id FROM accounts WHERE email = 'mentor13@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'google certified data engineer', 'google', NULL, NULL, '2018-03-01', NULL, 'Certified in advanced data engineering techniques.', true,
(SELECT id FROM accounts WHERE email = 'mentor13@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 14 (mentor14@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'hue university', NULL, 'graphic design', '2006-09-01', '2010-06-30', 'Graduated with a degree in Graphic Design.', false,
(SELECT id FROM accounts WHERE email = 'mentor14@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'adobe', 'senior graphic designer', NULL, '2011-01-01', '2016-12-31', 'Designed advanced visual systems and branding.', false,
(SELECT id FROM accounts WHERE email = 'mentor14@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'samsung vietnam', 'visual design lead', NULL, '2017-01-01', NULL, 'Leading design projects for consumer electronics.', true,
(SELECT id FROM accounts WHERE email = 'mentor14@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 15 (mentor15@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'ho chi minh city university of science (hcmus)', NULL, 'cyber security', '2004-09-01', '2008-06-30', 'Graduated with a degree in Cyber Security.', false,
(SELECT id FROM accounts WHERE email = 'mentor15@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'hcl vietnam', 'cybersecurity specialist', NULL, '2009-01-01', '2014-12-31', 'Designed secure systems and conducted penetration testing.', false,
(SELECT id FROM accounts WHERE email = 'mentor15@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'kms technology', 'senior security consultant', NULL, '2015-01-01', NULL, 'Advising enterprises on advanced cybersecurity practices.', true,
(SELECT id FROM accounts WHERE email = 'mentor15@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 16 (mentor16@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'ho chi minh city university of technology (hcmut)', NULL, 'software engineering', '2005-09-01', '2009-06-30', 'Graduated with a focus on Software Engineering.', false,
(SELECT id FROM accounts WHERE email = 'mentor16@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'viettel group', 'software developer', NULL, '2010-01-01', '2015-12-31', 'Developed enterprise software solutions.', false,
(SELECT id FROM accounts WHERE email = 'mentor16@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'fpt corporation', 'senior software engineer', NULL, '2016-01-01', '2021-12-31', 'Led development teams on large-scale projects.', false,
(SELECT id FROM accounts WHERE email = 'mentor16@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'cmc corporation', 'software architect', NULL, '2022-01-01', NULL, 'Designing scalable architectures for cloud systems.', true,
(SELECT id FROM accounts WHERE email = 'mentor16@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 17 (mentor17@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'vietnam national university hanoi (vnu hanoi)', NULL, 'cloud computing', '2007-09-01', '2011-06-30', 'Graduated with a specialization in Cloud Computing.', false,
(SELECT id FROM accounts WHERE email = 'mentor17@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'aws (amazon web services)', 'cloud architect', NULL, '2012-01-01', '2018-12-31', 'Designed and implemented cloud infrastructure solutions.', false,
(SELECT id FROM accounts WHERE email = 'mentor17@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'microsoft', 'cloud solutions consultant', NULL, '2019-01-01', '2023-06-30', 'Provided consultancy on Azure-based cloud systems.', false,
(SELECT id FROM accounts WHERE email = 'mentor17@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CERTIFICATION', 'microsoft certified: azure solutions architect', 'microsoft', NULL, NULL, '2020-05-01', NULL, 'Certified in designing and managing Azure solutions.', true,
(SELECT id FROM accounts WHERE email = 'mentor17@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 18 (mentor18@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'university of information technology (uit)', NULL, 'data science', '2006-09-01', '2010-06-30', 'Graduated with a degree in Data Science.', false,
(SELECT id FROM accounts WHERE email = 'mentor18@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'vnpt', 'data analyst', NULL, '2011-01-01', '2015-12-31', 'Developed data-driven optimization solutions.', false,
(SELECT id FROM accounts WHERE email = 'mentor18@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'viettel group', 'senior data engineer', NULL, '2016-01-01', NULL, 'Designed and managed large-scale data pipelines.', true,
(SELECT id FROM accounts WHERE email = 'mentor18@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 19 (mentor19@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'rmit university vietnam (rmit)', NULL, 'ux/ui design', '2008-09-01', '2012-06-30', 'Graduated with a degree in UX/UI Design.', false,
(SELECT id FROM accounts WHERE email = 'mentor19@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'samsung vietnam', 'ux designer', NULL, '2013-01-01', '2017-12-31', 'Improved user interfaces for mobile devices.', false,
(SELECT id FROM accounts WHERE email = 'mentor19@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'google', 'senior ux researcher', NULL, '2018-01-01', NULL, 'Led research projects to enhance user experiences.', true,
(SELECT id FROM accounts WHERE email = 'mentor19@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Achievements for Mentor 20 (mentor20@gmail.com)
INSERT INTO profile_achievements (type, name, organization, position, major, start_date, end_date, description, is_current, account_id, is_active, created_at, updated_at)
VALUES
('EDUCATION', NULL, 'ho chi minh city university of science (hcmus)', NULL, 'cyber security', '2004-09-01', '2008-06-30', 'Graduated with a focus on Cyber Security.', false,
(SELECT id FROM accounts WHERE email = 'mentor20@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'kms technology', 'cybersecurity engineer', NULL, '2009-01-01', '2015-12-31', 'Secured enterprise systems against cyber threats.', false,
(SELECT id FROM accounts WHERE email = 'mentor20@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('EXPERIENCE', NULL, 'hcl vietnam', 'senior security consultant', NULL, '2016-01-01', NULL, 'Advising enterprises on cybersecurity best practices.', true,
(SELECT id FROM accounts WHERE email = 'mentor20@gmail.com'), true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);



-- Insert the number of clicks of each students for each mentor
-- Insert Clicks for Student 1
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student1@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'), 5, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student1@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), 8, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student1@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'), 3, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student1@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor7@gmail.com'), 6, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student1@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'), 3, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Clicks for Student 2
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student2@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), 4, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),  -- Overlap với Student 1
((SELECT id FROM accounts WHERE email = 'student2@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'), 7, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),  -- Overlap với Student 1
((SELECT id FROM accounts WHERE email = 'student2@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor8@gmail.com'), 5, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student2@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor10@gmail.com'), 2, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Clicks for Student 3
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student3@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'), 3, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student3@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'), 8, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student3@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'), 4, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student3@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'), 5, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student3@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor11@gmail.com'), 1, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student3@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor17@gmail.com'), 1, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Clicks for Student 4
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student4@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'), 7, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1
((SELECT id FROM accounts WHERE email = 'student4@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), 6, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1 & 2
((SELECT id FROM accounts WHERE email = 'student4@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor10@gmail.com'), 2, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Clicks for Student 5
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student5@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'), 5, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1 & 2
((SELECT id FROM accounts WHERE email = 'student5@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor7@gmail.com'), 9, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1
((SELECT id FROM accounts WHERE email = 'student5@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor12@gmail.com'), 4, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student5@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor14@gmail.com'), 3, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student5@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor20@gmail.com'), 2, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Clicks for Student 6
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student6@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'), 6, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 3
((SELECT id FROM accounts WHERE email = 'student6@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'), 5, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 3
((SELECT id FROM accounts WHERE email = 'student6@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor11@gmail.com'), 4, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student6@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor13@gmail.com'), 2, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Clicks for Student 7
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student7@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), 10, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1, 2, 4
((SELECT id FROM accounts WHERE email = 'student7@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'), 7, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 3
((SELECT id FROM accounts WHERE email = 'student7@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'), 3, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 3
((SELECT id FROM accounts WHERE email = 'student7@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor15@gmail.com'), 5, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Clicks for Student 8
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student8@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'), 7, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1, 4
((SELECT id FROM accounts WHERE email = 'student8@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'), 3, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1, 2, 5
((SELECT id FROM accounts WHERE email = 'student8@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor7@gmail.com'), 6, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1, 5
((SELECT id FROM accounts WHERE email = 'student8@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor10@gmail.com'), 2, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Clicks for Student 9
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student9@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'), 5, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 3, 6
((SELECT id FROM accounts WHERE email = 'student9@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'), 7, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 3, 6
((SELECT id FROM accounts WHERE email = 'student9@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'), 4, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 3, 7
((SELECT id FROM accounts WHERE email = 'student9@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor13@gmail.com'), 3, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student9@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor15@gmail.com'), 2, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Clicks for Student 10
INSERT INTO account_clicks (student_account_id, mentor_account_id, no_clicks, click_type, is_active, created_at, updated_at)
VALUES
((SELECT id FROM accounts WHERE email = 'student10@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'), 9, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 1, 2, 4, 7
((SELECT id FROM accounts WHERE email = 'student10@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'), 6, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT), -- Overlap với Student 3, 7
((SELECT id FROM accounts WHERE email = 'student10@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor8@gmail.com'), 5, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
((SELECT id FROM accounts WHERE email = 'student10@gmail.com'), (SELECT id FROM accounts WHERE email = 'mentor11@gmail.com'), 2, 'VIEW_DETAIL', true, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);
