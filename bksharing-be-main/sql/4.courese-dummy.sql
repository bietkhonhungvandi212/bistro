-- Insert Courses for Mentor 1 (AI Engineer, AWS Certified)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Interview Preparation for AI Jobs',
 'A short and intense session on how to ace AI job interviews with real-world questions and tips.',
 (SELECT id FROM categories WHERE slug = 'artificial-intelligence'),
 'APPROVED', 3, 200000, true,
 ARRAY['Basic Machine Learning Knowledge', 'Python Programming'],
 ARRAY['Understand common AI interview questions', 'Learn how to structure AI-related answers', 'Mock interview sessions'],
 ARRAY['ADVANCED', 'EXPERT']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
),
('How to Get AWS Certified in One Month',
 'Learn how to efficiently prepare for the AWS certification exam with a structured plan.',
 (SELECT id FROM categories WHERE slug = 'cloud-computing'),
 'APPROVED', 2, 180000, true,
 ARRAY['Basic knowledge of cloud computing'],
 ARRAY['Understand AWS certification paths', 'Learn exam-taking strategies', 'Review key AWS concepts'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor1@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 1
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Common AI Interview Questions', 'Overview of frequently asked AI-related interview questions.', (SELECT id FROM courses WHERE name = 'Interview Preparation for AI Jobs'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Mock AI Interview Session', 'Hands-on practice with real-world AI interview scenarios.', (SELECT id FROM courses WHERE name = 'Interview Preparation for AI Jobs'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

('AWS Certification Paths Overview', 'Understanding different AWS certification levels and their requirements.', (SELECT id FROM courses WHERE name = 'How to Get AWS Certified in One Month'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('AWS Exam Strategy', 'Key techniques to efficiently study and pass the AWS exam.', (SELECT id FROM courses WHERE name = 'How to Get AWS Certified in One Month'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 2 (Graphic Designer, Adobe Certified)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Mastering Adobe Photoshop for Beginners',
 'Learn essential Photoshop skills in a short, hands-on workshop.',
 (SELECT id FROM categories WHERE slug = 'graphic-design'),
 'APPROVED', 4, 300000, true,
 ARRAY['Basic computer knowledge'],
 ARRAY['Learn essential Photoshop tools', 'Edit and enhance images', 'Design simple graphics'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'),
 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
),
('How to Build a Winning Design Portfolio',
 'Learn how to craft a design portfolio that impresses recruiters and clients.',
 (SELECT id FROM categories WHERE slug = 'ui-ux'),
 'APPROVED', 3, 250000, true,
 ARRAY['Basic knowledge of design principles'],
 ARRAY['Structure an effective design portfolio', 'Choose the right projects to showcase', 'Market your portfolio to potential clients'],
 ARRAY['INTERMEDIATE', 'ADVANCED']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor2@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 2
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Introduction to Photoshop Tools', 'Learn essential tools such as layers, brushes, and selections.', (SELECT id FROM courses WHERE name = 'Mastering Adobe Photoshop for Beginners'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Photo Editing Basics', 'Adjust lighting, colors, and retouch images effectively.', (SELECT id FROM courses WHERE name = 'Mastering Adobe Photoshop for Beginners'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

('Portfolio Structure', 'How to organize and showcase your design projects.', (SELECT id FROM courses WHERE name = 'How to Build a Winning Design Portfolio'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Marketing Your Portfolio', 'Strategies to promote your design work online and offline.', (SELECT id FROM courses WHERE name = 'How to Build a Winning Design Portfolio'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 3 (Financial Analyst, CFA Certified)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Understanding Financial Statements for Beginners',
 'Learn how to analyze financial statements like a pro.',
 (SELECT id FROM categories WHERE slug = 'finance'),
 'APPROVED', 3, 220000, true,
 ARRAY['Basic accounting knowledge'],
 ARRAY['Understand income statements', 'Analyze balance sheets', 'Interpret cash flow statements'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
),
('How to Pass the CFA Level 1 Exam',
 'A structured plan to help candidates pass the CFA Level 1 exam efficiently.',
 (SELECT id FROM categories WHERE slug = 'finance'),
 'APPROVED', 5, 350000, true,
 ARRAY['Basic finance knowledge'],
 ARRAY['Master CFA Level 1 concepts', 'Practice with exam-style questions', 'Develop an effective study plan'],
 ARRAY['INTERMEDIATE', 'ADVANCED']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor3@gmail.com'),
 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 3
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Introduction to Financial Statements', 'Understanding the three main types of financial statements.', (SELECT id FROM courses WHERE name = 'Understanding Financial Statements for Beginners'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Analyzing a Balance Sheet', 'How to read and interpret a company’s balance sheet.', (SELECT id FROM courses WHERE name = 'Understanding Financial Statements for Beginners'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

('CFA Exam Overview', 'What to expect in the CFA Level 1 exam.', (SELECT id FROM courses WHERE name = 'How to Pass the CFA Level 1 Exam'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Key CFA Concepts', 'Deep dive into key concepts tested in the CFA exam.', (SELECT id FROM courses WHERE name = 'How to Pass the CFA Level 1 Exam'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Courses for Mentor 4 (Backend Developer, Azure Certified)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Mastering Backend Development with Node.js',
 'Learn how to build robust and scalable backend applications using Node.js and Express.',
 (SELECT id FROM categories WHERE slug = 'backend-development'),
 'APPROVED', 4, 250000, true,
 ARRAY['Basic JavaScript knowledge'],
 ARRAY['Build RESTful APIs', 'Understand middleware and authentication', 'Optimize backend performance'],
 ARRAY['INTERMEDIATE', 'ADVANCED']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
),
('Deploying Scalable Applications on Azure',
 'A hands-on session on deploying applications on Microsoft Azure cloud.',
 (SELECT id FROM categories WHERE slug = 'cloud-development'),
 'APPROVED', 3, 300000, true,
 ARRAY['Basic cloud computing knowledge'],
 ARRAY['Understand Azure services', 'Deploy scalable apps on Azure', 'Set up CI/CD pipelines'],
 ARRAY['ADVANCED', 'EXPERT']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor4@gmail.com'),
 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 4
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Introduction to Node.js', 'Overview of Node.js architecture and ecosystem.', (SELECT id FROM courses WHERE name = 'Mastering Backend Development with Node.js'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Building REST APIs', 'Create RESTful APIs using Express.js.', (SELECT id FROM courses WHERE name = 'Mastering Backend Development with Node.js'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

('Azure Services Overview', 'Learn about key Azure services for developers.', (SELECT id FROM courses WHERE name = 'Deploying Scalable Applications on Azure'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('CI/CD on Azure', 'Automating deployment with Azure DevOps.', (SELECT id FROM courses WHERE name = 'Deploying Scalable Applications on Azure'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 5 (Data Scientist, Machine Learning Specialist)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Machine Learning for Developers',
 'A crash course on integrating ML models into applications.',
 (SELECT id FROM categories WHERE slug = 'machine-learning'),
 'APPROVED', 5, 350000, true,
 ARRAY['Basic Python programming'],
 ARRAY['Understand ML concepts', 'Train models with Scikit-learn', 'Deploy ML models into production'],
 ARRAY['INTERMEDIATE', 'ADVANCED']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
),
('Introduction to Big Data with Spark',
 'Learn how to process large-scale data with Apache Spark.',
 (SELECT id FROM categories WHERE slug = 'big-data'),
 'APPROVED', 4, 400000, true,
 ARRAY['Basic SQL knowledge'],
 ARRAY['Understand Spark architecture', 'Write Spark jobs', 'Optimize big data processing'],
 ARRAY['ADVANCED', 'EXPERT']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor5@gmail.com'),
 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 5
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Intro to Machine Learning', 'Fundamentals of machine learning models.', (SELECT id FROM courses WHERE name = 'Machine Learning for Developers'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Deploying ML Models', 'How to integrate ML models into web applications.', (SELECT id FROM courses WHERE name = 'Machine Learning for Developers'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

('Understanding Spark', 'How Apache Spark works for big data.', (SELECT id FROM courses WHERE name = 'Introduction to Big Data with Spark'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Processing Large Datasets', 'How to run Spark jobs efficiently.', (SELECT id FROM courses WHERE name = 'Introduction to Big Data with Spark'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

-- Insert Courses for Mentor 6 (Software Development & Cloud Engineering)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Introduction to Backend Development',
 'A beginner-friendly guide to backend technologies, databases, and APIs.',
 (SELECT id FROM categories WHERE slug = 'backend-development'),
 'APPROVED', 5, 350000, true,
 ARRAY['Basic programming knowledge'],
 ARRAY['Understand backend fundamentals', 'Learn about databases and APIs', 'Build a simple backend service'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
),
('How to Deploy Applications on AWS',
 'A practical guide to deploying and managing applications in AWS cloud.',
 (SELECT id FROM categories WHERE slug = 'cloud-development'),
 'APPROVED', 3, 400000, true,
 ARRAY['Basic knowledge of web applications'],
 ARRAY['Learn about AWS services', 'Deploy applications using EC2 & S3', 'Set up auto-scaling and monitoring'],
 ARRAY['INTERMEDIATE', 'ADVANCED']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor6@gmail.com'),
 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 6
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Understanding Backend Technologies',
 'Overview of backend frameworks, databases, and APIs.',
 (SELECT id FROM courses WHERE name = 'Introduction to Backend Development'),
 true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

('Building a Simple API',
 'Hands-on session on designing and developing a REST API.',
 (SELECT id FROM courses WHERE name = 'Introduction to Backend Development'),
 false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

('Introduction to AWS',
 'Understanding AWS services and how they support applications.',
 (SELECT id FROM courses WHERE name = 'How to Deploy Applications on AWS'),
 true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

('Deploying with EC2 & S3',
 'A practical session on deploying applications using AWS EC2 and S3.',
 (SELECT id FROM courses WHERE name = 'How to Deploy Applications on AWS'),
 false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 7 (DevOps Engineer)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Mastering CI/CD with Docker & Kubernetes',
 'A hands-on course on automating deployments using DevOps best practices.',
 (SELECT id FROM categories WHERE slug = 'devops-ci-cd'),
 'APPROVED', 5, 400000, true,
 ARRAY['Basic Linux knowledge'],
 ARRAY['Understand CI/CD pipelines', 'Work with Docker & Kubernetes', 'Deploy applications efficiently'],
 ARRAY['ADVANCED', 'EXPERT']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor7@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 7
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('CI/CD Basics', 'Introduction to DevOps and CI/CD concepts.', (SELECT id FROM courses WHERE name = 'Mastering CI/CD with Docker & Kubernetes'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Kubernetes for Beginners', 'Hands-on practice with Kubernetes deployments.', (SELECT id FROM courses WHERE name = 'Mastering CI/CD with Docker & Kubernetes'), false, 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 8 (UX/UI Designer)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Breaking into UX/UI Design: Career Roadmap',
 'A step-by-step guide on how to start a career in UX/UI design.',
 (SELECT id FROM categories WHERE slug = 'ui-ux'),
 'APPROVED', 3, 200000, true,
 ARRAY['Basic design knowledge'],
 ARRAY['Understand the UX/UI field', 'Build a strong portfolio', 'Land your first UX/UI job'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor8@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
),
('Portfolio Review & Resume Tips for UX/UI Designers',
 'How to create an eye-catching UX/UI portfolio and resume.',
 (SELECT id FROM categories WHERE slug = 'graphic-design'),
 'APPROVED', 2, 150000, true,
 ARRAY['Basic knowledge of UX/UI design'],
 ARRAY['Optimize your portfolio', 'Write a strong UX/UI-focused resume', 'Prepare for job interviews'],
 ARRAY['INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor8@gmail.com'),
 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 8
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Understanding UX/UI Careers', 'Overview of the UX/UI industry and job roles.', (SELECT id FROM courses WHERE name = 'Breaking into UX/UI Design: Career Roadmap'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Building a UX/UI Portfolio', 'What makes a good portfolio and how to structure it.', (SELECT id FROM courses WHERE name = 'Portfolio Review & Resume Tips for UX/UI Designers'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 9 (Network Engineer)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('How to Pass Cisco CCNA Certification',
 'A quick guide to help you prepare and pass the Cisco CCNA exam.',
 (SELECT id FROM categories WHERE slug = 'network-administration'),
 'APPROVED', 4, 300000, true,
 ARRAY['Basic networking knowledge'],
 ARRAY['Understand CCNA exam topics', 'Learn key networking concepts', 'Practice with real-world examples'],
 ARRAY['INTERMEDIATE', 'ADVANCED']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
),
('Career Guide: Becoming a Network Engineer',
 'Everything you need to know about getting into network engineering.',
 (SELECT id FROM categories WHERE slug = 'it'),
 'APPROVED', 3, 250000, true,
 ARRAY['General IT knowledge'],
 ARRAY['Learn about network engineering roles', 'Understand required skills and certifications', 'Plan your career path'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor9@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 9
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('CCNA Exam Overview', 'Understanding the structure of the CCNA exam.', (SELECT id FROM courses WHERE name = 'How to Pass Cisco CCNA Certification'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Network Engineer Career Path', 'Step-by-step guide to becoming a network engineer.', (SELECT id FROM courses WHERE name = 'Career Guide: Becoming a Network Engineer'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 10 (Mathematics & Physics Educator)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('How to Learn Math Fast & Effectively',
 'A practical guide to improving math learning speed and efficiency.',
 (SELECT id FROM categories WHERE slug = 'data-science'),
 'APPROVED', 2, 180000, true,
 ARRAY['Basic arithmetic knowledge'],
 ARRAY['Develop a structured approach to learning math', 'Improve problem-solving skills', 'Use math in real-world applications'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor10@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 10
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Math Learning Strategies', 'Different techniques to improve math understanding.', (SELECT id FROM courses WHERE name = 'How to Learn Math Fast & Effectively'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 11 (Java Developer)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Understanding Java Interview Questions',
 'A deep dive into common Java interview questions and how to answer them.',
 (SELECT id FROM categories WHERE slug = 'it'),
 'APPROVED', 3, 250000, true,
 ARRAY['Basic Java knowledge'],
 ARRAY['Understand Java interview patterns', 'Solve common Java interview problems', 'Practice live coding scenarios'],
 ARRAY['INTERMEDIATE', 'ADVANCED']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor11@gmail.com'),
 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);


-- Insert Course Sections for Mentor 11
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Java Interview Prep', 'How to prepare for Java technical interviews.', (SELECT id FROM courses WHERE name = 'Understanding Java Interview Questions'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 12 (Project Manager, Agile Expert)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('How to Become a Project Manager',
 'A guide to getting started in project management.',
 (SELECT id FROM categories WHERE slug = 'project-management'),
 'APPROVED', 4, 280000, true,
 ARRAY['Basic understanding of management'],
 ARRAY['Learn PM fundamentals', 'Understand Agile & Scrum', 'Get certified in project management'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor12@gmail.com'),
 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
);

-- Insert Course Sections for Mentor 12
INSERT INTO course_sections (title, description, course_id, is_public, ordinal, created_at, updated_at)
VALUES
('Project Management Basics', 'Understanding key PM concepts.', (SELECT id FROM courses WHERE name = 'How to Become a Project Manager'), true, 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


-- Insert Courses for Mentor 13 (Data Analyst)
INSERT INTO courses (name, description, category_id, status, total_duration, price, is_public, prerequisites, objectives, target_audiences, creator_id, limit_of_students, created_at, updated_at)
VALUES
('Career Roadmap: Becoming a Data Analyst',
 'A complete guide to starting a career in data analysis.',
 (SELECT id FROM categories WHERE slug = 'data-science'),
 'APPROVED', 3, 220000, true,
 ARRAY['Basic Excel or SQL knowledge'],
 ARRAY['Understand data analytics workflow', 'Learn data visualization techniques', 'Prepare for data analyst interviews'],
 ARRAY['BEGINNER', 'INTERMEDIATE']::"TargetAudience"[],
 (SELECT id FROM accounts WHERE email = 'mentor13@gmail.com'),
 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT
)



