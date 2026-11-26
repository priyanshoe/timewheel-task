CREATE DATABASE IF NOT EXISTS employee_search_db;
USE employee_search_db;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  dob DATE NOT NULL,
  department VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL
);

INSERT INTO employees (id, name, email, dob, department, position) VALUES
  (1, 'John Carter', 'john.carter@company.com', '1992-03-14', 'Engineering', 'Senior Software Engineer'),
  (2, 'Sarah Chen', 'sarah.chen@company.com', '1995-08-22', 'Engineering', 'Staff Frontend Engineer'),
  (3, 'Marcus Vance', 'marcus.vance@company.com', '1989-11-03', 'Engineering', 'Engineering Manager'),
  (4, 'Elena Rostova', 'elena.rostova@company.com', '1998-05-12', 'Engineering', 'Backend Engineer'),
  (5, 'David Kim', 'david.kim@company.com', '1991-01-27', 'IT', 'Systems Administrator'),
  (6, 'Priya Patel', 'priya.patel@company.com', '1994-06-19', 'Human Resources', 'HR Business Partner'),
  (7, 'Olivia Bennett', 'olivia.bennett@company.com', '1990-09-08', 'Human Resources', 'Talent Acquisition Lead'),
  (8, 'Daniel Brooks', 'daniel.brooks@company.com', '1987-12-15', 'Finance', 'Senior Financial Analyst'),
  (9, 'Hannah Abbott', 'hannah.abbott@company.com', '1993-04-30', 'Finance', 'Accounting Manager'),
  (10, 'Lucas Moreau', 'lucas.moreau@company.com', '1996-07-21', 'Marketing', 'Product Marketing Manager'),
  (11, 'Sofia Alvarez', 'sofia.alvarez@company.com', '1997-02-11', 'Marketing', 'Growth Marketing Specialist'),
  (12, 'Nathan Price', 'nathan.price@company.com', '1988-10-04', 'Sales', 'Enterprise Account Executive'),
  (13, 'Rachel Green', 'rachel.green@company.com', '1994-11-29', 'Sales', 'Sales Operations Lead'),
  (14, 'Johnathan Miller', 'johnathan.miller@company.com', '1990-02-18', 'Operations', 'Operations Director'),
  (15, 'Maya Lin', 'maya.lin@company.com', '1999-03-25', 'Operations', 'Supply Chain Analyst'),
  (16, 'Ethan Wright', 'ethan.wright@company.com', '1993-09-14', 'IT', 'Cloud Security Engineer'),
  (17, 'Chloe Dubois', 'chloe.dubois@company.com', '1996-12-01', 'Engineering', 'QA Automation Engineer'),
  (18, 'Omar Farooq', 'omar.farooq@company.com', '1992-07-09', 'Engineering', 'DevOps Engineer'),
  (19, 'Claire Foster', 'claire.foster@company.com', '1986-05-23', 'Finance', 'VP of Finance'),
  (20, 'Liam O''Connor', 'liam.oconnor@company.com', '1995-01-16', 'Sales', 'Regional Sales Manager'),
  (21, 'Aisha Mohammed', 'aisha.mohammed@company.com', '1997-10-12', 'Marketing', 'Brand Content Strategist'),
  (22, 'Benjamin Cole', 'benjamin.cole@company.com', '1991-06-07', 'IT', 'IT Support Specialist'),
  (23, 'Grace Tanaka', 'grace.tanaka@company.com', '1994-04-02', 'Human Resources', 'People Operations Coordinator'),
  (24, 'Victor Hayes', 'victor.hayes@company.com', '1988-08-19', 'Operations', 'Logistics Coordinator')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  dob = VALUES(dob),
  department = VALUES(department),
  position = VALUES(position);
