const inquirer = require('inquirer');
//Console Table
const cTable = require('console.table');

// Import and require mysql2
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'bootcamp2023',
      database: 'employees_db'
});

//Check for database connection
db.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the 'employees_db' database.`);

    //Begin the prompts after connecting to the database
    beginPrompt();
});

//Function to begin inquirer prompts
function beginPrompt () {
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update Employee Role',
            'Exit',
        ]
     }
    ])
    .then((answer) => {
        switch (answer.action) {
            case 'View All Departments':
                //function to view all departments
                viewAllDepartments();
                break;
            case 'View All Roles':
                //function to view all roles
                viewAllRoles();
                break;
            case 'View All Employees':
                //function to view all employees
                viewAllEmployees();
                break;
            case 'Add a Department':
                //function to add a department
                addDepartment();
                break;
            case 'Add a Role':
                //function to add a role
                addRole();
                break;
            case 'Add an Employee':
                //function to add an employee
                addEmployee();
                break;
            case 'Update Employee Role':
                //function to update employee role
                updateEmployeeRole();
                break;
            case 'Exit':
                console.log('Goodbye')
                db.end();
                break;
        }
    });
}

//Function to view all departments
function viewAllDepartments () {
    const query = `SELECT * FROM department`;
    db.query(query, (err, department) => {
        if (err) throw err;

    //Display results using console.table
    console.table(department);

    //restarts prompts after completion
    beginPrompt();
    });
}

//function to view all roles
function viewAllRoles () {
    const query = `SELECT * FROM role`;
    db.query(query, (err, role) => {
        if (err) throw err;
    //Display results using console.table
    console.table(role);
    //restarts prompts after completion
    beginPrompt();
    })
}
//function to view all employees
function viewAllEmployees() {
    const query = `
        SELECT 
            e.id AS Employee_ID, 
            e.first_name AS First_Name, 
            e.last_name AS Last_Name, 
            r.title AS Job_Title, 
            d.name AS Department, 
            r.salary AS Salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS Manager
        FROM 
            employee e
        LEFT JOIN 
            role r ON e.role_id = r.id
        LEFT JOIN 
            department d ON r.department_id = d.id
        LEFT JOIN 
            employee m ON e.manager_id = m.id
    `;

    db.query(query, (err, employees) => {
        if (err) throw err;

        // Display results using console.table
        console.table('All Employees', employees);

        // Restart prompts after completion
        beginPrompt();
    });
}
//function to add a department
function addDepartment () {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the department:',
                validate: function (input) {
                    if (!input) {
                        return 'Please enter a department name.';
                    }
                    return true;
                }
            }
        ])
        .then((answer) => {
            //SQL INSERT query to add new department
            const query = 'INSERT INTO department (name) VALUES (?)';
            db.query(query, answer.departmentName, (err, result) => {
                if (err) {
                    console.error('Error adding department:', err);
                } else {
                    console.log(`'${answer.departmentName}' has been added.`)
                }
                beginPrompt();
            });
        });
}
//function to add a role
function addRole() {
    // Query to fetch department names
    const departmentQuery = 'SELECT id, name FROM department';

    db.query(departmentQuery, (err, departments) => {
        if (err) {
            console.error('Error fetching departments:', err);
            beginPrompt();
            return;
        }

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the role:',
                    validate: function (input) {
                        if (!input) {
                            return 'Please enter a role title.';
                        }
                        return true;
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary for this role:',
                    validate: function (input) {
                        if (!input || isNaN(input)) {
                            return 'Please enter a valid salary.';
                        }
                        return true;
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the department for this role:',
                    choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
                }
            ])
            .then((answers) => {
                // SQL INSERT query to add the new role
                const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
                db.query(query, [answers.title, answers.salary, answers.department], (err, result) => {
                    if (err) {
                        console.error('Error adding role:', err);
                    } else {
                        console.log(`'${answers.title}' role added successfully.`);
                    }
                    // Restart prompts after completion
                    beginPrompt();
                });
            });
    });
}
//function to add an employee
function addEmployee() {
    // Query to fetch roles
    const rolesQuery = 'SELECT id, title FROM role';

    // Query to fetch managers (employees who can be managers)
    const managersQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employee';

    db.query(rolesQuery, (err, roles) => {
        if (err) {
            console.error('Error fetching roles:', err);
            beginPrompt();
            return;
        }

        db.query(managersQuery, (err, managers) => {
            if (err) {
                console.error('Error fetching managers:', err);
                beginPrompt();
                return;
            }

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: "Enter the employee's first name:",
                        validate: function (input) {
                            if (!input) {
                                return "Please enter the employee's first name.";
                            }
                            return true;
                        }
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: "Enter the employee's last name:",
                        validate: function (input) {
                            if (!input) {
                                return "Please enter the employee's last name.";
                            }
                            return true;
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "Select the employee's role:",
                        choices: roles.map(role => ({ name: role.title, value: role.id }))
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Select the employee's manager:",
                        choices: [{ name: 'None', value: null }].concat(managers.map(manager => ({ name: manager.manager_name, value: manager.id })))
                    }
                ])
                .then((answers) => {
                    // SQL INSERT query to add the new employee
                    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                    db.query(query, [answers.first_name, answers.last_name, answers.role, answers.manager], (err, result) => {
                        if (err) {
                            console.error('Error adding employee:', err);
                        } else {
                            console.log(`Employee '${answers.first_name} ${answers.last_name}' added successfully.`);
                        }
                        // Restart prompts after completion
                        beginPrompt();
                    });
                });
        });
    });
}
//function to update employee role
function updateEmployeeRole() {
    // Query to fetch employees
    const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';

    // Query to fetch roles
    const rolesQuery = 'SELECT id, title FROM role';

    db.query(employeesQuery, (err, employees) => {
        if (err) {
            console.error('Error fetching employees:', err);
            beginPrompt();
            return;
        }

        db.query(rolesQuery, (err, roles) => {
            if (err) {
                console.error('Error fetching roles:', err);
                beginPrompt();
                return;
            }

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Select the employee to update:',
                        choices: employees.map(emp => ({ name: emp.employee_name, value: emp.id }))
                    },
                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'Select the new role for the employee:',
                        choices: roles.map(role => ({ name: role.title, value: role.id }))
                    }
                ])
                .then((answers) => {
                    // SQL UPDATE query to update employee's role
                    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
                    db.query(query, [answers.newRole, answers.employee], (err, result) => {
                        if (err) {
                            console.error('Error updating employee role:', err);
                        } else {
                            console.log('Employee role updated successfully.');
                        }
                        // Restart prompts after completion
                        beginPrompt();
                    });
                });
        });
    });
}