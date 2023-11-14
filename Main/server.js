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
})