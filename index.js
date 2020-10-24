const inquirer = require("inquirer"); 
const mysql = require("mysql"); 
const cTable = require('console.table');

let table; 

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_CMS"
}); 

connection.connect(function(err) {
    if(err) throw err; 

    displayMenu(); 
}); 

function displayMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Employees",
                "Add Department",
                "Add Role",
                "Quit \n"
            ],
            name: "choice"
        }
    ])
    .then(answer => {
        const { choice } = answer; 

        switch(choice) {
            case "View Employees": 
                viewEmployees(); 
                break; 
            case "Add Department":
                addDepartment();
                break; 
            case "Add Role": 
                addRole(); 
                break; 
            case "Quit \n":
                console.log(`Goodbye!`); 
                connection.end(); 
        }
    }); 
}

function viewEmployees() {
    let employees = []; 
    //const query = "SELECT employee.*, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id ORDER BY employee.id"; 
    const query = "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.id"; 
    connection.query(query, function(err, res) {
        if(err) throw err; 

        res.forEach((employee,key,employeeArray) => {

            //Get this employee's manager, if any. 
            const managerQuery = "SELECT employee.first_name, employee.last_name FROM employee WHERE id = ?"; 
            connection.query(managerQuery, [employee.manager_id],function(err, res) {
                if(err) throw err; 

                let thisManager; 

                if(res.length > 0) {
                    thisManager = `${res[0].first_name} ${res[0].last_name}`; 
                } else {
                    thisManager = `None`; 
                }

                employees.push({
                    "ID": employee.id,
                    "First Name": employee.first_name,
                    "Last Name": employee.last_name,
                    "Title": employee.title,
                    "Department": employee.name,
                    "Salary": employee.salary,
                    "Manager": thisManager
                }); 
    
                if(Object.is(employeeArray.length - 1, key)) {
                    console.table(employees); 
                    displayMenu(); 
                }
            }); 


            
        }); 
    }); 
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter Department Name (enter 'b' to go back)",
            name: "userInput"
        }
    ])
    .then(answer => {
        const { userInput } = answer; 

        if(userInput === "b" || userInput === "") {
            return displayMenu(); 
        }

        inquirer.prompt([
            {
                type: "list",
                message: `You entered ${userInput}. Confirm:`,
                choices: [
                    "Yes",
                    "No. Go Back."
                ],
                name: "userSelection"
            }
        ])
        .then(answer => {
            const { userSelection } = answer; 

            if(userSelection === "No. Go Back.") return displayMenu(); 

            connection.query("INSERT INTO department SET ?", {
                name: userInput
            },
            function(err) {
                if(err) throw err; 

                console.log(`Inserted department "${userInput}" into database.`); 
                return displayMenu(); 
            }); 
        }); 

    }); 
}

function addRole() {

    //Get all departments.
    connection.query("SELECT department.name FROM department", function(err, res) {
        if(err) throw err; 

        let departmentNames = []; 

        //For each department, save the name of the department. 
        res.forEach(department => {
            departmentNames.push(department.name); 
        }); 

        //Select the department to add the role to. 
        inquirer.prompt([
            {
                type: "list",
                message: "Select department to add role:",
                choices: [...departmentNames, "Go Back"],
                name: "userSelection"
            }
        ])
        .then(answer => {
            const { userSelection } = answer; 

            if(userSelection === "Go Back") return displayMenu(); 

            //Get ID for the selected department. 
            connection.query("SELECT department.id FROM department WHERE department.name =?", [userSelection], function(err, res) {
                if(err) throw err; 

                let departmentID = Number(res[0].id); 

                //Get the title and salary for the new role. 
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter the title for this role:",
                        name: "titleInput"
                    },
                    {
                        type: "input",
                        message: "Enter the salary for this role:",
                        name: "salaryInput"
                    }
                ])
                .then(answers => {
                    const { titleInput, salaryInput } = answers; 

                    //Insert new role. 
                    connection.query("INSERT INTO role SET ?", {
                        title: titleInput,
                        salary: salaryInput,
                        department_id: departmentID
                    },
                    function(err) {
                        if(err) throw err; 

                        console.log(`Inserted role "${titleInput}" into database.`); 
                        return displayMenu(); 
                    }); 
                }); 
            }); 
        }); 

    }); 
}

/*
function viewEmployees() {
    let employees = []; 
    const query = "SELECT * from employee"; 
    connection.query(query, function(err, res) {
        if(err) throw err;  

        //console.log(res); 
        res.forEach((employee,key,employeeArray) => {

            //get Role Title 
            const query = "SELECT title FROM role WHERE id=?"; 
            var thisRoleTitle; 
            connection.query(query, [employee.id], function(err, res) {
                if(err) throw err;
            
                thisRoleTitle = res[0].title; 

                employees.push({
                    ID: employee.id,
                    First_Name: employee.first_name,
                    Last_Name: employee.last_name,
                    Title: thisRoleTitle
                }); 

                //console.log("Employees so far: ",employees); 

                if(Object.is(employeeArray.length - 1, key)) {
                    console.table(employees); 
                    displayMenu(); 
                }
                
            }); 
            
        }); 
    }); 
}
*/




/*
                console.table([ 
                    {
                        ID: employee.id,
                        First_Name: employee.first_name,
                        Last_Name: employee.last_name,
                        Title: thisRoleTitle
                    }
                ]); 
                */