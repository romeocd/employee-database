USE employees_db;

--department 
INSERT INTO department (id, name) VALUES (1, 'sales');
INSERT INTO department (id, name) VALUES (2, 'engineering');
INSERT INTO department (id, name) VALUES (3, 'finance');
INSERT INTO department (id, name) VALUES (4, 'legal');

--role
INSERT INTO role (title, salary, department_id) VALUES
('Sales Lead', 100000, 1);
('Salesperson', 80000, 1);
('Lead Engineer', 150000, 2);
('Software Engineer', 120000, 2);
('Account Manger', 160000, 3);
('Accountant', 125000, 3);
('Legal Team Lead', 250000, 4);
('Lawyer', 190000, 4);
