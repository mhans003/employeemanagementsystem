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
                "View Departments",
                "View Roles",
                "View Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Department",
                "Update Role",
                "Update Employee",
                "Quit \n"
            ],
            name: "choice"
        }
    ])
    .then(answer => {
        const { choice } = answer; 

        switch(choice) {
            case "View Departments":
                viewDepartments(); 
                break; 
            case "View Roles":
                viewRoles(); 
                break; 
            case "View Employees": 
                viewEmployees(); 
                break; 
            case "Add Department":
                addDepartment();
                break; 
            case "Add Role": 
                addRole(); 
                break; 
            case "Add Employee":
                addEmployee(); 
                break; 
            case "Update Department":
                updateDepartment(); 
                break; 
            case "Update Role":
                updateRole(); 
                break; 
            case "Update Employee":
                updateEmployee(); 
                break; 
            case "Quit \n":
                console.log(`Goodbye!`); 
                connection.end(); 
        } 
    }); 
}

function viewDepartments() {
    let departments = []; 
    const query = "SELECT department.* from department ORDER BY department.id"; 

    connection.query(query, function(err, res) {
        if(err) throw err; 

        res.forEach((department, key, departmentArray) => {
            departments.push({
                "ID": department.id,
                "Name": department.name
            }); 

            if(Object.is(departmentArray.length - 1, key)) {
                console.log(""); 
                console.log("------------------------------------- DEPARTMENT LIST -------------------------------------");
                console.log(""); 
                console.table(departments); 
                console.log("-------------------------------------------------------------------------------------------");
                return displayMenu(); 
            }
        }); 
    }); 
}

function viewRoles() {
    let roles = []; 
    const query = "SELECT role.*, department.name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY role.id";

    connection.query(query, function(err, res) {
        if(err) throw err; 

        res.forEach((role, key, roleArray) => {
            roles.push({
                "ID": role.id,
                "Title": role.title,
                "Salary": role.salary,
                "Department": role.name
            }); 

            if(Object.is(roleArray.length - 1, key)) {
                console.log(""); 
                console.log("------------------------------------- ROLE LIST -------------------------------------");
                console.log(""); 
                console.table(roles); 
                console.log("-------------------------------------------------------------------------------------");
                return displayMenu(); 
            }
        }); 
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
                    console.log(""); 
                    console.log("------------------------------------- EMPLOYEE LIST -------------------------------------");
                    console.log(""); 
                    console.table(employees); 
                    console.log("-----------------------------------------------------------------------------------------");
                    return displayMenu(); 
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

                console.log("---------------------------------------------------------------------");
                console.log(`DEPARTMENT INSERTED SUCCESSFULLY.`);
                console.log(`INSERTED DEPARTMENT "${userInput}" INTO DATABASE.`); 
                console.log("---------------------------------------------------------------------");

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

                        console.log("---------------------------------------------------------------------");
                        console.log(`ROLE INSERTED SUCCESSFULLY.`);
                        console.log(`INSERTED ROLE "${titleInput}" INTO DATABASE.`); 
                        console.log("---------------------------------------------------------------------"); 

                        return displayMenu(); 
                    }); 
                }); 
            }); 
        }); 

    }); 
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter employee's first name:",
            name: "firstNameInput"
        },
        {
            type: "input",
            message: "Enter employee's last name:",
            name: "lastNameInput"
        }
    ])
    .then(answers => {
        const { firstNameInput, lastNameInput } = answers; 

        //Get every role title to choose from. 
        connection.query("SELECT role.id, role.title FROM role", function(err, res) {
            if(err) throw err; 

            let allRoles = []; 
            let allRoleTitles = []; 

            res.forEach(role => {
                allRoles.push({
                    roleID: role.id,
                    roleTitle: role.title
                }); 

                allRoleTitles.push(role.title); 
            }); 

            console.log(allRoles); 
            inquirer.prompt([
                {
                    type: "list",
                    message: "Select this employee's role:",
                    choices: [
                        ...allRoleTitles
                    ],
                    name: "employeeRoleChoice"
                }
            ])
            .then(answer => {
                const { employeeRoleChoice } = answer; 

                //console.log(employeeRoleChoice); 

                //Get every manager to choose from.
                connection.query("SELECT * FROM employee", function(err, res) {
                    if(err) throw err; 

                    let allEmployees = []; 
                    let allEmployeeNames = []; 

                    res.forEach(employee => {
                        allEmployees.push({
                            employeeID: employee.id,
                            employeeName: `${employee.first_name} ${employee.last_name}`
                        }); 

                        allEmployeeNames.push(`${employee.first_name} ${employee.last_name}`); 
                    }); 

                    console.log(allEmployees); 

                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Who is this employee's manager?",
                            choices: [
                                "None",
                                ...allEmployeeNames
                            ], 
                            name: "employeeManagerChoice"
                        }
                    ])
                    .then(answer => {
                        const { employeeManagerChoice } = answer; 

                        //console.log(employeeManagerChoice); 
                        let employeeRole; 
                        let employeeManager; 

                        for(let i = 0; i < allRoles.length; i++) {
                            if(allRoles[i].roleTitle === employeeRoleChoice) {
                                employeeRole = allRoles[i].roleID; 
                                break; 
                            }
                        }

                        for(let i = 0; i < allEmployees.length; i++) {
                            if(allEmployees[i].employeeName === employeeManagerChoice) {
                                employeeManager = allEmployees[i].employeeID; 
                                break; 
                            }
                        }

                        if(employeeManager === undefined) {
                            employeeManager = null; 
                        }

                        //console.log(`${employeeRole}; ${employeeManager}`); 
                        connection.query("INSERT INTO employee SET ?", {
                            first_name: firstNameInput,
                            last_name: lastNameInput,
                            role_id: employeeRole,
                            manager_id: employeeManager
                        },
                        function(err) {
                            if(err) throw err; 

                            console.log("---------------------------------------------------------------------");
                            console.log(`EMPLOYEE INSERTED SUCCESSFULLY.`);
                            console.log(`INSERTED EMPLOYEE "${firstNameInput} ${lastNameInput}" INTO DATABASE.`); 
                            console.log("---------------------------------------------------------------------"); 

                            return displayMenu(); 
                        }); 
                    }); 
                }); 
            }); 
        }); 
    }); 
}

/*
function updateEmployee() {
    let employees = []; 

    //Get all employees 
    const query = "SELECT employee.id, employee.first_name, employee.last_name FROM employee ORDER BY employee.id";

    connection.query(query, function(err, res) {
        if(err) throw err; 

        res.forEach(employee => {
            employees.push(`${employee.id}. ${employee.first_name} ${employee.last_name}`); 
        }); 

        inquirer.prompt([
            {
                type: "list",
                message: "Select the employee you want to modify.",
                choices: [
                    ...employees
                ],
                name: "employeeChoice"
            }
        ])
        .then(answer => {
            const { employeeChoice } = answer; 

            const employeeID = Number(employeeChoice.slice(0, employeeChoice.indexOf("."))); 

            //console.log(employeeID); 
            inquirer.prompt([
                {
                    type: "list",
                    message: "What field do you want to update?",
                    choices: [
                        "first_name",
                        "last_name",
                        "role_id",
                        "manager_id"
                    ],
                    name: "fieldToUpdate"
                }
            ])
            .then(answer => {
                const { fieldToUpdate } = answer; 
        
                inquirer.prompt([
                    {
                        type: "input",
                        message: `Enter the new value for ${fieldToUpdate}`,
                        name: "newValue"
                    }
                ])
                .then(answer => {
                    const { newValue } = answer; 
        
                    updateFields("employee", fieldToUpdate, newValue, employeeID); 
                }); 
            }); 

        }); 
    }); 

}
*/

function updateDepartment() {
    let departments = []; 

    //Get all roles.
    const query = "SELECT department.* FROM department ORDER BY department.id";

    connection.query(query, function(err, res) {
        if(err) throw err; 

        res.forEach(department => {
            departments.push(`${department.id}. ${department.name}`); 
        }); 

        inquirer.prompt([
            {
                type: "list",
                message: "Select the department you want to modify.",
                choices: [
                    ...departments
                ],
                name: "departmentChoice"
            }
        ])
        .then(answer => {
            const { departmentChoice } = answer; 

            const departmentID = Number(departmentChoice.slice(0, departmentChoice.indexOf("."))); 

            inquirer.prompt([
                {
                    type: "list",
                    message: "What field do you want to update?",
                    choices: [
                        "name"
                    ],
                    name: "fieldToUpdate"
                }
            ])
            .then(answer => {
                const { fieldToUpdate } = answer; 

                inquirer.prompt([
                    {
                        type: "input",
                        message: `Enter the new value for ${fieldToUpdate}. (To go back and view departments, enter D.)`,
                        name: "newValue"
                    }
                ])
                .then(answer => {
                    const { newValue } = answer; 

                    if(newValue === "d" || newValue === "D") return viewDepartments(); 
        
                    updateFields("department", fieldToUpdate, newValue, departmentID); 
                }); 
            }); 
        }); 
    }); 
}

function updateRole() {
    let roles = []; 

    //Get all roles.
    const query = "SELECT role.*, department.name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY role.id";

    connection.query(query, function(err, res) {
        if(err) throw err; 

        res.forEach(role => {
            roles.push(`${role.id}. ${role.title} (${role.name} - $${role.salary})`); 
        }); 

        inquirer.prompt([
            {
                type: "list",
                message: "Select the role you want to modify.",
                choices: [
                    ...roles
                ],
                name: "roleChoice"
            }
        ])
        .then(answer => {
            const { roleChoice } = answer; 

            const roleID = Number(roleChoice.slice(0, roleChoice.indexOf("."))); 

            inquirer.prompt([
                {
                    type: "list",
                    message: "What field do you want to update?",
                    choices: [
                        "title",
                        "salary",
                        "department_id"
                    ],
                    name: "fieldToUpdate"
                }
            ])
            .then(answer => {
                const { fieldToUpdate } = answer; 

                inquirer.prompt([
                    {
                        type: "input",
                        message: `Enter the new value for ${fieldToUpdate}. (To go back and view roles, enter R. To go back and view departments, enter D.)`,
                        name: "newValue"
                    }
                ])
                .then(answer => {
                    const { newValue } = answer; 

                    if(newValue === "r" || newValue === "R") return viewRoles(); 
                    if(newValue === "d" || newValue === "D") return viewDepartments(); 
        
                    updateFields("role", fieldToUpdate, newValue, roleID); 
                }); 
            }); 
        }); 
    }); 
}

function updateEmployee() {
    let employees = []; 

    //Get all employees 
    const query = "SELECT employee.id, employee.first_name, employee.last_name FROM employee ORDER BY employee.id";

    connection.query(query, function(err, res) {
        if(err) throw err; 

        res.forEach(employee => {
            employees.push(`${employee.id}. ${employee.first_name} ${employee.last_name}`); 
        }); 

        inquirer.prompt([
            {
                type: "list",
                message: "Select the employee you want to modify.",
                choices: [
                    ...employees
                ],
                name: "employeeChoice"
            }
        ])
        .then(answer => {
            const { employeeChoice } = answer; 

            const employeeID = Number(employeeChoice.slice(0, employeeChoice.indexOf("."))); 

            //console.log(employeeID); 
            inquirer.prompt([
                {
                    type: "list",
                    message: "What field do you want to update?",
                    choices: [
                        "first_name",
                        "last_name",
                        "role_id",
                        "manager_id"
                    ],
                    name: "fieldToUpdate"
                }
            ])
            .then(answer => {
                const { fieldToUpdate } = answer; 
        
                inquirer.prompt([
                    {
                        type: "input",
                        message: `Enter the new value for ${fieldToUpdate}. (To go back and view roles, enter R. To go back and view employees, enter E.)`,
                        name: "newValue"
                    }
                ])
                .then(answer => {
                    const { newValue } = answer; 

                    if(newValue === "r" || newValue === "R") return viewRoles(); 
                    if(newValue === "e" || newValue === "E") return viewEmployees(); 
        
                    updateFields("employee", fieldToUpdate, newValue, employeeID); 
                }); 
            }); 

        }); 
    }); 

}

function updateFields(table, field, newValue, id) {
    const query = `UPDATE ${table} SET ${field}='${newValue}' WHERE id=${id}`; 
 
    connection.query(query, function(err) {
        if(err) throw err; 
        console.log("---------------------------------------------------------------------");
        console.log(`FIELD UPDATED SUCCESSFULLY.`);
        console.log(`UPDATED ID #${id} IN FIELD ${field} OF TABLE ${table} TO ${newValue}.`); 
        console.log("---------------------------------------------------------------------");
        return displayMenu(); 
    }); 
}



