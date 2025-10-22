-- Helper function to generate realistic timestamps
WITH RECURSIVE generate_timestamps AS (
  SELECT EXTRACT(EPOCH FROM TIMESTAMP '2023-01-01 00:00:00')::BIGINT AS timestamp_epoch
  UNION ALL
  SELECT timestamp_epoch + 86400 -- Increment by one day in seconds
  FROM generate_timestamps
  WHERE timestamp_epoch + 86400 <= EXTRACT(EPOCH FROM NOW())::BIGINT
)
SELECT timestamp_epoch INTO TEMPORARY temp_timestamps FROM generate_timestamps;

-- Create Administrator
INSERT INTO accounts (email, password, account_type, phone_number, name, gender, status, dob, learning_goal, bio, is_active, created_at, updated_at)
VALUES
(
  'admin@gmail.com',
  '123!Admin',
  'ADMIN',
  '0981234567',
  'System Admin',
  'OTHER',
  'ACTIVE',
  '2000-01-01',
  ARRAY['System Management'],
  'Administrator of the system',
  true,
  (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1),
  (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)
);

-- Create Parent Categories
INSERT INTO categories (name, slug, description, level, ordinal, created_at, updated_at)
  VALUES
    ('Development', 'development', 'Topics related to software and web development', 0, 1, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Business', 'business', 'Topics related to entrepreneurship and business strategies', 0, 2, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Finance', 'finance', 'Topics related to financial management and investment', 0, 3, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Accounting', 'accounting', 'Topics related to accounting principles and practices', 0, 4, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Productivity', 'productivity', 'Topics related to productivity tools and methods', 0, 5, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Personal', 'personal', 'Topics related to personal growth and self-improvement', 0, 6, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Design', 'design', 'Topics related to UI/UX and graphic design', 0, 7, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Marketing', 'marketing', 'Topics related to digital and traditional marketing', 0, 8, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Music', 'music', 'Topics related to music theory, production, and instruments', 0, 9, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('IT', 'it', 'Topics related to IT infrastructure and networking', 0, 10, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
    ('Office', 'office', 'Topics related to office tools and management', 0, 11, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1));

-- Create Subcategories
INSERT INTO categories (name, slug, description, level, parent_category_id, ordinal, created_at, updated_at)
VALUES
-- Development
-- Web Development
('Frontend Development', 'frontend-development', 'Topics related to frontend frameworks and UI development', 1, (SELECT id FROM categories WHERE slug = 'development'), 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Backend Development', 'backend-development', 'Topics related to backend technologies and APIs', 1, (SELECT id FROM categories WHERE slug = 'development'), 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Full-Stack Development', 'full-stack-development', 'Topics covering both frontend and backend development', 1, (SELECT id FROM categories WHERE slug = 'development'), 3, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Web Performance Optimization', 'web-performance-optimization', 'Techniques for improving website speed and performance', 1, (SELECT id FROM categories WHERE slug = 'development'), 4, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Web Security', 'web-security', 'Ensuring security for web applications', 1, (SELECT id FROM categories WHERE slug = 'development'), 5, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

-- Software Development Methodologies
('Software Architecture', 'software-architecture', 'Principles and patterns for scalable software design', 1, (SELECT id FROM categories WHERE slug = 'development'), 6, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Microservices', 'microservices', 'Developing and managing microservices-based applications', 1, (SELECT id FROM categories WHERE slug = 'development'), 7, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('DevOps & CI/CD', 'devops-ci-cd', 'Continuous integration and delivery pipelines for software', 1, (SELECT id FROM categories WHERE slug = 'development'), 8, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Software Testing', 'software-testing', 'Testing methodologies for reliable software development', 1, (SELECT id FROM categories WHERE slug = 'development'), 9, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Agile Development', 'agile-development', 'Agile methodologies for software development', 1, (SELECT id FROM categories WHERE slug = 'development'), 10, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

-- Emerging Technologies in Development
('Artificial Intelligence', 'artificial-intelligence', 'Building intelligent systems with AI', 1, (SELECT id FROM categories WHERE slug = 'development'), 11, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Machine Learning', 'machine-learning', 'Algorithms and models for machine learning applications', 1, (SELECT id FROM categories WHERE slug = 'development'), 12, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Deep Learning', 'deep-learning', 'Advanced techniques in neural networks and deep learning', 1, (SELECT id FROM categories WHERE slug = 'development'), 13, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Computer Vision', 'computer-vision', 'Processing and analyzing images using AI', 1, (SELECT id FROM categories WHERE slug = 'development'), 14, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Natural Language Processing', 'natural-language-processing', 'Building AI models to understand human language', 1, (SELECT id FROM categories WHERE slug = 'development'), 15, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),

-- Data & Cloud Development
('Data Science', 'data-science', 'Techniques for extracting insights from data', 1, (SELECT id FROM categories WHERE slug = 'development'), 16, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Big Data', 'big-data', 'Handling and processing large datasets', 1, (SELECT id FROM categories WHERE slug = 'development'), 17, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Data Engineering', 'data-engineering', 'Building data pipelines and infrastructure', 1, (SELECT id FROM categories WHERE slug = 'development'), 18, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Cloud Development', 'cloud-development', 'Developing applications on cloud platforms like AWS, GCP, and Azure', 1, (SELECT id FROM categories WHERE slug = 'development'), 19, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('MLOps', 'mlops', 'Operationalizing and deploying machine learning models', 1, (SELECT id FROM categories WHERE slug = 'development'), 20, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),


-- Business
('Entrepreneurship', 'entrepreneurship', 'Topics about starting and scaling a business', 1, (SELECT id FROM categories WHERE slug = 'business'), 1, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Management', 'management', 'Business and organizational management strategies', 1, (SELECT id FROM categories WHERE slug = 'business'), 2, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),

-- Finance
('Investing', 'investing', 'Investment strategies and financial markets', 1, (SELECT id FROM categories WHERE slug = 'finance'), 1, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Cryptocurrency', 'cryptocurrency', 'Topics about blockchain and cryptocurrencies', 1, (SELECT id FROM categories WHERE slug = 'finance'), 2, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),

-- Accounting
('Taxation', 'taxation', 'Tax laws and financial compliance', 1, (SELECT id FROM categories WHERE slug = 'accounting'), 1, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Bookkeeping', 'bookkeeping', 'Accounting and bookkeeping fundamentals', 1, (SELECT id FROM categories WHERE slug = 'accounting'), 2, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),

-- Productivity
-- Additional Productivity Subcategories
-- Time Management & Focus
('Time Management', 'time-management', 'Techniques and strategies for better time management', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 1, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Pomodoro Technique', 'pomodoro-technique', 'A time management method based on short work intervals', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 2, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Deep Work', 'deep-work', 'Strategies for achieving intense focus and high productivity', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 3, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Procrastination Management', 'procrastination-management', 'Techniques to overcome procrastination and improve efficiency', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 4, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),

-- Work & Study Habits
('Morning Routines', 'morning-routines', 'Optimizing morning habits for a productive day', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 5, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Work-Life Balance', 'work-life-balance', 'Maintaining a healthy balance between work and personal life', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 6, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Remote Work Productivity', 'remote-work-productivity', 'Maximizing productivity while working remotely', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 7, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Study Productivity', 'study-productivity', 'Techniques to improve study habits and academic performance', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 8, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),

-- Productivity Tools & Automation
('Task Management', 'task-management', 'Effective strategies for managing tasks and to-do lists', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 9, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Note-Taking Strategies', 'note-taking-strategies', 'Best practices for effective note-taking and organization', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 10, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Email Management', 'email-management', 'Techniques to efficiently handle emails and communication', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 11, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Project Management', 'project-management', 'Tools and frameworks for efficient project management', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 12, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Automation & AI Tools', 'automation-ai-tools', 'Using automation and AI-powered tools to improve efficiency', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 13, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),

-- Productivity Methods & Frameworks
('GTD (Getting Things Done)', 'getting-things-done', 'A systematic approach to improving productivity', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 14, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Eisenhower Matrix', 'eisenhower-matrix', 'Prioritization method for decision making', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 15, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('The 80/20 Rule (Pareto Principle)', 'pareto-principle', 'Focus on high-impact tasks for maximum productivity', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 16, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Kanban Method', 'kanban-method', 'Visualizing work processes for efficiency', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 17, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Scrum & Agile Productivity', 'scrum-agile-productivity', 'Agile methodologies for improving workflow and efficiency', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 18, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),

-- Mindset & Self-Improvement
('Productivity Mindset', 'productivity-mindset', 'Developing habits and mental models for success', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 19, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('Goal Setting & Tracking', 'goal-setting-tracking', 'Effective goal-setting strategies for personal and professional growth', 1, (SELECT id FROM categories WHERE slug = 'productivity'), 20, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),


-- Design
('Graphic Design', 'graphic-design', 'Topics about design software and techniques', 1, (SELECT id FROM categories WHERE slug = 'design'), 1, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),
('UI/UX', 'ui-ux', 'User interface and experience design', 1, (SELECT id FROM categories WHERE slug = 'design'), 2, (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1), (SELECT timestamp_epoch FROM temp_timestamps ORDER BY RANDOM() LIMIT 1)),

-- IT
-- Software Development
('Software Engineering', 'software-engineering', 'Principles and practices of software development', 1, (SELECT id FROM categories WHERE slug = 'it'), 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Desktop Application Development', 'desktop-application-development', 'Development of applications for desktop platforms', 1, (SELECT id FROM categories WHERE slug = 'it'), 5, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Computer Science', 'computer-science', 'The study of computation, algorithms, and data structures', 1, (SELECT id FROM categories WHERE slug = 'it'), 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Information Technology', 'information-technology', 'Application and management of computer systems and networks', 1, (SELECT id FROM categories WHERE slug = 'it'), 2, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Information Systems', 'information-systems', 'Design and implementation of business IT solutions', 1, (SELECT id FROM categories WHERE slug = 'it'), 3, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Cybersecurity', 'cybersecurity', 'Protection of systems, networks, and data from cyber threats', 1, (SELECT id FROM categories WHERE slug = 'it'), 4, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Network Administration', 'network-administration', 'Configuration and management of computer networks', 1, (SELECT id FROM categories WHERE slug = 'it'), 5, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),


('Cloud Computing', 'cloud-computing', 'Use of cloud platforms like AWS, Azure, and GCP', 1, (SELECT id FROM categories WHERE slug = 'it'), 6, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('Embedded Systems', 'embedded-systems', 'Design and development of embedded computing devices', 1, (SELECT id FROM categories WHERE slug = 'it'), 14, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT),
('IT Ethics & Law', 'it-ethics-law', 'Legal and ethical issues in IT and computing', 1, (SELECT id FROM categories WHERE slug = 'it'), 18, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);


INSERT INTO categories (name, slug, description, level, parent_category_id, ordinal, created_at, updated_at)
VALUES
('Software Engineering', 'software-engineering', 'Principles and practices of software development', 1, (SELECT id FROM categories WHERE slug = 'it'), 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

INSERT INTO categories (name, slug, description, level, parent_category_id, ordinal, created_at, updated_at)
VALUES
('Software Engineering', 'software-engineering', 'Principles and practices of software development', 1, (SELECT id FROM categories WHERE slug = 'it'), 1, EXTRACT(EPOCH FROM NOW())::BIGINT, EXTRACT(EPOCH FROM NOW())::BIGINT);

select *
from categories where parent_category_id is null;

select * from categories;

