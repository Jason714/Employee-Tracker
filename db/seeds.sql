USE employee_tracker_db;

INSERT INTO department
    (names)
VALUES
    ("Finance"),
    ("Legal"),
    ("Marketing"),
    ("IT"),
    ("Sales");


INSERT INTO roles
    (title, salary, department_id)
VALUES
    ("Director of Finance", 225000, 1),
    ("Financial Analyst", 95000, 1),
    ("General Counsel", 250000, 2),
    ("Attorney", 130000, 2),
    ("Marketing Manager", 150000, 3),
    ("Marketing Analyst", 80000, 3),
    ("Lead Software Developer", 160000, 4),
    ("Junior Software Developer", 65000, 4),
    ("Director of Sales", 145000, 5),
    ("Sales Associate", 72000, 5);


INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Warren", "Buffett", 1, NULL),
    ("George", "Soros", 2, 1),
    ("Mark", "Geragos", 3, NULL),
    ("Alan", "Dershowitz", 4, 3),
    ("Gary", "Vaynerchuk", 5, NULL),
    ("Tai", "Lopez", 6, 5),
    ("Elon", "Musk", 7, NULL),
    ("Mark", "Zuckerberg", 8, 7),
    ("Daymond", "John", 9, NULL),
    ("Kevin", "O'Leary", 10, 9);
