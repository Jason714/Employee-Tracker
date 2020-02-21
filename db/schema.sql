DROP DATABASE IF EXISTS employee_tracker_db;
CREATE database employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE employee (
id INT PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR
(30) NOT NULL,
last_name VARCHAR
(30) NOT NULL,
PRIMARY KEY
(id),
    FOREIGN KEY
(role_id) 
        REFERENCES role
(id),
    FOREIGN KEY
(manager_id) 
        REFERENCES employee
(id)
);

CREATE TABLE role
(
    id INT NOT NULL
    AUTO_INCREMENT,
    title VARCHAR
    (30) NOT NULL,
    salary DECIMAL
    (10,2),
PRIMARY KEY
    (id),
    FOREIGN KEY
    (department_id) 
        REFERENCES department
    (id)
);

    CREATE TABLE department
    (
        id INT NOT NULL
        AUTO_INCREMENT,
    name VARCHAR
        (30) NOT NULL,
PRIMARY KEY
        (id)
);