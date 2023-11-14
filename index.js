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
    console.log(`Connected to the 'employees_db database.`);

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
        }
    });
}

//Function to view all departments
function viewAllDepartments () {
    const query = 'SELECT id, name FROM department';
    db.query(query, (err, results) => {
        if (err) throw err;

    //Display results using console.table
    console.table('All Departments', results);

    //restarts prompts after completion
    beginPrompt();
    });
}