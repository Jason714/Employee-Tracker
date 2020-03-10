var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) throw err
});

init();

function init() {
    inquirer
        .prompt([{
            name: "action",
            type: "list",
            message: "What Would You Like To Do?",
            choices: [
                "View Employees",
                "View Employees By Department",
                "View Employees By Role",
                "View Employees By Manager",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Update Employee Managers",
                "View a Department's Budget",
                "Exit"
            ]
        }])
        .then(function (answer) {
            switch (answer.action) {
                case "Add Department":
                    addDepartment();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "View Employees By Department":
                    viewEmployeesByDepartment();
                    break;

                case "View Employees By Role":
                    viewEmployeesByRole();
                    break;

                case "View Employees":
                    viewEmployees();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Update Employee Managers":
                    updateEmployeeManager();
                    break;

                case "View Employees By Manager":
                    viewEmployeeByManager();
                    break;

                case "View a Department's Budget":
                    viewDepartmentsBudget();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
};

function viewEmployees() {
    let query = `SELECT 
    E1.id, E1.first_name, E1.last_name, R.title, D.names, R.salary, CONCAT(E2.first_name, " ", E2.last_name) as manager
    FROM employee E1
    LEFT JOIN employee E2
    on E1.manager_id = E2.id
    INNER JOIN roles R
    on E1.role_id = R.id
    INNER JOIN department D
    on D.id = R.department_id
    ORDER BY E1.id`;
    connection.query(query, function (err, res) {
        console.table(res)
        if (err) throw err;
        ; init();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            name: "newDepartment",
            type: "input",
            message: "Please Enter The New Department Name."
        }
    ])
        .then(function ({ newDepartment }) {
            connection.query("INSERT INTO department (names) VALUES (?)", [newDepartment], function (err, res) {
                if (err) throw err;
                init();
            });
        });
};

function addRole() {
    let department = [];
    connection.query(`SELECT names, id FROM department`, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            department.push({ value: res[i].id, name: res[i].names })
        };
        inquirer.prompt([
            {
                name: "roleDepartment",
                type: "list",
                message: "Which Department Does The New Role Belong To?",
                choices: department
            },
            {
                name: "newRole",
                type: "input",
                message: "Please Enter The New Role Name."
            },
            {
                name: "newSalary",
                type: "number",
                message: "What Is The Salary Of The New Role?",
            }
        ])
            .then(function ({ newRole, newSalary, roleDepartment }) {
                connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)", [newRole, newSalary, roleDepartment], function (err, res) {
                    if (err) throw err;
                    init();
                });
            });
    });
};

function addEmployee() {
    let role = [];
    let manager = [];
    connection.query(`SELECT 
    E1.id, E1.first_name, E1.last_name, R.title, D.names, R.salary, CONCAT(E2.first_name, " ", E2.last_name) as manager, R.id as role_ID, D.id as department_ID, E1.manager_id as manager_ID
    FROM employee E1
    LEFT JOIN employee E2
    on E1.manager_id = E2.id
    INNER JOIN roles R
    on E1.role_id = R.id
    INNER JOIN department D
    on D.id = R.department_id`, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            role.push({ value: res[i].role_ID, name: res[i].title })
            if (res[i].manager) {
                manager.push({ value: res[i].manager_ID, name: res[i].manager })
            }
        };
        inquirer.prompt([
            {
                name: "newEmployeeFirstName",
                type: "input",
                message: "Please Enter New Employee's First Name!"
            },
            {
                name: "newEmployeeLastName",
                type: "input",
                message: "Please Enter New Employee's Last Name!"
            },
            {
                name: "newEmployeeRole",
                type: "list",
                message: "What Will Your Employee's Role Be?",
                choices: role
            },
            {
                name: "newEmployeeManager",
                type: "list",
                message: "Who Will Be Your New Employee's Manager?",
                choices: manager
            }
        ])
            .then(function ({ newEmployeeFirstName, newEmployeeLastName, newEmployeeRole, newEmployeeManager }) {
                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [newEmployeeFirstName, newEmployeeLastName, newEmployeeRole, newEmployeeManager], function (err, res) {
                    if (err) throw err;
                    init();
                });
            });
    });
};

function viewEmployeesByDepartment() {
    let departments = [];
    connection.query("SELECT names FROM department", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            departments.push(res[i].names)
        };
        inquirer.prompt([
            {
                name: "department",
                type: "list",
                message: "Which Department Would You Like To Look At?",
                choices: departments
            }
        ])
            .then(function (answer) {
                let query = `SELECT
                E1.id, E1.first_name, E1.last_name, R.title, D.names, R.salary, CONCAT(E2.first_name, " ", E2.last_name) as manager
                FROM employee E1
                LEFT JOIN employee E2
                on E1.manager_id = E2.id
                INNER JOIN roles R
                on E1.role_id = R.id
                INNER JOIN department D
                on D.id = R.department_id
                WHERE D.names = ?`;
                connection.query(query, [answer.department], function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    init();
                });
            });
    });
};

function viewEmployeesByRole() {
    let role = [];
    connection.query("SELECT title FROM roles", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            role.push(res[i].title)
        };
        inquirer.prompt([
            {
                name: "role",
                type: "list",
                message: "Which Department Would You Like To Look At?",
                choices: role
            }
        ])
            .then(function (answer) {
                console.log(answer.role);
                let query = `SELECT
                E1.id, E1.first_name, E1.last_name, R.title, D.names, R.salary, CONCAT(E2.first_name, " ", E2.last_name) as manager
                FROM employee E1
                LEFT JOIN employee E2
                on E1.manager_id = E2.id
                INNER JOIN roles R
                on E1.role_id = R.id
                INNER JOIN department D
                on D.id = R.department_id
                WHERE R.title = ?`;
                connection.query(query, [answer.role], function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    init();
                });
            });
    });
};

function updateEmployeeRole() {
    let employee = [];
    let role = [];
    connection.query(`SELECT 
    CONCAT(E1.first_name, " ", E1.last_name) as employee, R.title, R.id as role_ID, E1.id as employee_ID
    FROM employee E1
    INNER JOIN roles R
    on E1.role_id = R.id`, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            role.push({ value: res[i].role_ID, name: res[i].title })
            if (res[i].employee)
                employee.push({ value: res[i].employee_ID, name: res[i].employee })
        };
        inquirer.prompt([
            {
                name: "updateEmployee",
                type: "list",
                message: "Which Employee's Role Do You Want To Update?",
                choices: employee
            },
            {
                name: "newRole",
                type: "list",
                message: "Please Select Employee's New Role.",
                choices: role
            }
        ])
            .then(function ({ updateEmployee, newRole }) {
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [newRole, updateEmployee], function (err, res) {
                    if (err) throw err;
                    init();
                });
            });
    });
};

function updateEmployeeManager() {
    let employee = [];
    let manager = [];
    connection.query(`SELECT 
    E1.id, CONCAT(E1.first_name," ", E1.last_name) as employee, CONCAT(E2.first_name, " ", E2.last_name) as manager, E1.manager_id as manager_ID, E1.id as employee_ID
    FROM employee E1
    LEFT JOIN employee E2
    on E1.manager_id = E2.id`, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            manager.push({ value: res[i].manager_ID, name: res[i].manager })
            if (res[i].employee)
                employee.push({ value: res[i].employee_ID, name: res[i].employee })
        };
        inquirer.prompt([
            {
                name: "updateEmployee",
                type: "list",
                message: "Which Employee's Manager Do You Want To Update?",
                choices: employee
            },
            {
                name: "newManager",
                type: "list",
                message: "Please Select The Employee's New Manager.",
                choices: manager
            }
        ])
            .then(function ({ updateEmployee, newManager }) {
                connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [newManager, updateEmployee], function (err, res) {
                    if (err) throw err;
                    init();
                });
            });
    });
};

function viewEmployeeByManager() {
    let manager = [];
    connection.query(`SELECT 
    CONCAT(employee.first_name, " ", employee.last_name) as manager, employee.manager_id as manager_ID
    FROM employee WHERE manager_id is NULL`, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            manager.push(res[i].manager)
        };
        inquirer.prompt([
            {
                name: "manager",
                type: "list",
                message: "Which Manager Would You Like To Look At?",
                choices: manager
            }
        ]).then(function (answer) {
            let query = `SELECT
            E1.id, E1.first_name, E1.last_name, R.title, D.names, R.salary, CONCAT(E2.first_name, " ", E2.last_name) as manager
            FROM employee E1
            LEFT JOIN employee E2
            on E1.manager_id = E2.id
            INNER JOIN roles R
            on E1.role_id = R.id
            INNER JOIN department D
            on D.id = R.department_id
            WHERE CONCAT(E2.first_name, " ", E2.last_name) = ?`;
            connection.query(query, [answer.manager], function (err, res) {
                if (err) throw err;
                console.table(res);
                init();
            });
        });
    });
};

function viewDepartmentsBudget() {
    let department = [];
    connection.query(`SELECT names, id FROM department`, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            department.push({ value: res[i].id, name: res[i].names })
        };
        inquirer.prompt([
            {
                name: "departmentBudget",
                type: "list",
                message: "Which Department Budget Would You Like To View?",
                choices: department
            }
        ]).then(function ({ departmentBudget }) {
            connection.query(`SELECT D.names as department, sum(salary) as budget FROM employee E INNER JOIN roles R on R.id = E.role_id INNER JOIN department D on D.id = R.department_id WHERE R.department_id = ?;`, [departmentBudget], function (err, res) {
                if (err) throw err;
                console.table(res);
                init();
            });
        });
    });
};