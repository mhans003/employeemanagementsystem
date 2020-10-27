const inquirer = require("inquirer"); 
const mysql = require("mysql"); 
const cTable = require('console.table');

//let table; 

//Configure and connect to mysql. 
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_CMS"
}); 

connection.connect(function(err) {
    if(err) displayError(); 

    displayLogo(); 
    displayMenu(); 
}); 

function displayLogo() {

    let logo = `
        #######                                                    ######                                                  
        #       #    # #####  #       ####  #   # ###### ######    #     #   ##   #####   ##   #####    ##    ####  ###### 
        #       ##  ## #    # #      #    #  # #  #      #         #     #  #  #    #    #  #  #    #  #  #  #      #      
        #####   # ## # #    # #      #    #   #   #####  #####     #     # #    #   #   #    # #####  #    #  ####  #####  
        #       #    # #####  #      #    #   #   #      #         #     # ######   #   ###### #    # ######      # #      
        #       #    # #      #      #    #   #   #      #         #     # #    #   #   #    # #    # #    # #    # #      
        ####### #    # #      ######  ####    #   ###### ######    ######  #    #   #   #    # #####  #    #  ####  ###### 
    `;

    console.log(logo); 
}

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
                "Delete Department",
                "Delete Role",
                "Delete Employee",
                "View Total Utilized Budget",
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
            case "Delete Department":
                deleteDepartment(); 
                break; 
            case "Delete Role":
                deleteRole();
                break; 
            case "Delete Employee":
                deleteEmployee(); 
                break; 
            case "View Total Utilized Budget":
                viewTotalBudget(); 
                break; 
            case "Quit \n":
                console.log("------------------------------------ GOODBYE! ------------------------------------"); 
                console.log("----------------------------------------------------------------------------------");
                connection.end(); 
        } 
    }); 
}

function viewDepartments() {
    let departments = [];  

    //Get the listing preference from the user. 
    inquirer.prompt([
        {
            type: "list",
            message: "Order By:",
            choices: [
                "ID",
                "Name"
            ],
            name: "orderChoice"
        }
    ])
    .then(answer => {
        const { orderChoice } = answer; 

        let query = ""; 

        //Adjust query depending on sorting option. 
        if(orderChoice === "ID") {
            query = "SELECT department.* from department ORDER BY department.id";
        } else if(orderChoice === "Name") {
            query = "SELECT department.* from department ORDER BY department.name";
        }

        connection.query(query, function(err, res) {
            if(err) displayError(); 
    
            //For each department, store the ID and name. 
            res.forEach((department, key, departmentArray) => {
                departments.push({
                    "ID": department.id,
                    "Name": department.name
                }); 
    
                //At the end of the iteration, output the department list. 
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
    }); 
}

function viewRoles() {
    let roles = []; 

    //Get the listing preference from the user. 
    inquirer.prompt([
        {
            type: "list",
            message: "Order By:",
            choices: [
                "ID",
                "Role Title",
                "Salary",
                "Department"
            ],
            name: "orderChoice"
        }
    ])
    .then(answer => {
        const { orderChoice } = answer; 

        let query = ""; 

        //Depending on sorting preference, retrieve job roles. 
        if(orderChoice === "ID") {
            query = "SELECT role.*, department.name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY role.id";
        } else if(orderChoice === "Role Title") {
            query = "SELECT role.*, department.name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY role.title";
        } else if(orderChoice === "Salary") {
            query = "SELECT role.*, department.name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY role.salary DESC";
        } else if(orderChoice === "Department") {
            query = "SELECT role.*, department.name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY department.name";
        }

        connection.query(query, function(err, res) {
            if(err) displayError(); 
    
            //For each role retrieved, create the table and headings. 
            res.forEach((role, key, roleArray) => {
                roles.push({
                    "ID": role.id,
                    "Title": role.title,
                    "Salary": role.salary,
                    "Department": role.name
                }); 
    
                //At the end of the iteration, output the table. 
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
    }); 
}

function viewEmployees() {
    let employees = []; 

    //Get the sorting preference from the user. 
    inquirer.prompt([
        {
            type: "list",
            message: "Order By:",
            choices: [
                "ID",
                "Manager",
                "Department",
                "Salary",
                "Role Title",
                "First Name",
                "Last Name"
            ],
            name: "orderChoice"
        }
    ])
    .then(answer => {
        const { orderChoice } = answer; 

        let query = ""; 

        //Choose correct query depending on sorting preference. 
        if(orderChoice === "ID") {
            query = "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.id"; 
        } else if(orderChoice === "Manager") {
            query = "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.manager_id"; 
        } else if(orderChoice === "Department") {
            query = "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY department.name"; 
        } else if(orderChoice === "Salary") {
            query = "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY role.salary DESC"; 
        } else if(orderChoice === "Role Title") {
            query = "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY role.title"; 
        } else if(orderChoice === "First Name") {
            query = "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.first_name"; 
        } else if(orderChoice === "Last Name") {
            query = "SELECT employee.*, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.last_name"; 
        }

        connection.query(query, function(err, res) {
            if(err) displayError(); 
    
            res.forEach((employee,key,employeeArray) => {
    
                //Get this employee's manager, if any. 
                const managerQuery = "SELECT employee.first_name, employee.last_name FROM employee WHERE id = ?"; 
                connection.query(managerQuery, [employee.manager_id],function(err, res) {
                    if(err) displayError(); 
    
                    let thisManager; 
    
                    if(res.length > 0) {
                        thisManager = `${res[0].first_name} ${res[0].last_name}`; 
                    } else {
                        thisManager = `None`; 
                    }
    
                    //Prepare the table. 
                    employees.push({
                        "ID": employee.id,
                        "First Name": employee.first_name,
                        "Last Name": employee.last_name,
                        "Title": employee.title,
                        "Department": employee.name,
                        "Salary": employee.salary,
                        "Manager": thisManager
                    }); 
        
                    //At the end of the iteration, output the table. 
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

        //Allow user to go back. 
        if(userInput === "b" || userInput === "") {
            return displayMenu(); 
        }

        //Confirm input. 
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

            //Using the user's input for the name, set this new department name. 
            connection.query("INSERT INTO department SET ?", {
                name: userInput
            },
            function(err) {
                if(err) displayError(); 

                //Output the results of the operation. 
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
        if(err) displayError(); 

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
                if(err) displayError(); 

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
                        if(err) displayError(); 

                        //Output the results of the operation. 
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
            if(err) displayError(); 

            //Create an array for the roles(with id) and just role titles. 
            let allRoles = []; 
            let allRoleTitles = []; 

            res.forEach(role => {
                allRoles.push({
                    roleID: role.id,
                    roleTitle: role.title
                }); 

                allRoleTitles.push(role.title); 
            }); 

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

                //Get every manager to choose from.
                connection.query("SELECT * FROM employee", function(err, res) {
                    if(err) displayError(); 

                    //Create arrays to hold employee data and just employee names. 
                    let allEmployees = []; 
                    let allEmployeeNames = []; 

                    res.forEach(employee => {
                        allEmployees.push({
                            employeeID: employee.id,
                            employeeName: `${employee.first_name} ${employee.last_name}`
                        }); 

                        allEmployeeNames.push(`${employee.first_name} ${employee.last_name}`); 
                    }); 

                    //Using the employee names, see if any are the manager. 
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

                        let employeeRole; 
                        let employeeManager; 

                        //Get the role and manager for this employee. 
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

                        //Using the collected data, create the employee. 
                        connection.query("INSERT INTO employee SET ?", {
                            first_name: firstNameInput,
                            last_name: lastNameInput,
                            role_id: employeeRole,
                            manager_id: employeeManager
                        },
                        function(err) {
                            if(err) {
                                console.log("---------------------------------------------------------------------");
                                console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                                console.log("---------------------------------------------------------------------");
                                return displayMenu(); 
                            }  

                            //At the end, output the results. 
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

function updateDepartment() {
    let departments = []; 

    //Get all roles.
    const query = "SELECT department.* FROM department ORDER BY department.id";

    connection.query(query, function(err, res) {
        if(err) displayError(); 

        //Generate the list for user to choose from. 
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

            //Extract the ID. 
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
        
                    //Using the new input value, pass into the function to update the fields. 
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
        if(err) displayError(); 

        //Output all the roles for the user to choose from. 
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

            //Extract the ID. 
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
        
                    //Using the input information, pass along the information to update. 
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
        if(err) displayError();

        //Create list of employees for user to choose. 
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

            //Extract the ID. 
            const employeeID = Number(employeeChoice.slice(0, employeeChoice.indexOf("."))); 

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
                        message: `Enter the new value for ${fieldToUpdate}. (To go back and view roles, enter R. To go back and view employees, enter E. To remove a manager, enter null.)`,
                        name: "newValue"
                    }
                ])
                .then(answer => {
                    const { newValue } = answer; 

                    if(newValue === "r" || newValue === "R") return viewRoles(); 
                    if(newValue === "e" || newValue === "E") return viewEmployees(); 
        
                    //Using the retrieved data, update this employee. 
                    updateFields("employee", fieldToUpdate, newValue, employeeID); 
                }); 
            }); 
        }); 
    }); 
}

function deleteDepartment() {
    let departmentNames = []; 

    connection.query("SELECT * FROM department ORDER BY department.id", function(err, res) {
        if(err) displayError();

        //Get each department. 
        res.forEach(department => departmentNames.push(department.name)); 

        inquirer.prompt([
            {
                type: "list",
                message: "Select the department to delete:",
                choices: [
                    ...departmentNames
                ], 
                name: "departmentChoice"
            }
        ])
        .then(answer => {
            const { departmentChoice } = answer; 

            //Verify that the user wants to delete this department. 
            inquirer.prompt([
                {
                    type:"list",
                    message: `ARE YOU SURE YOU WANT TO DELETE THE ${departmentChoice} DEPARTMENT?`,
                    choices: [
                        "NO",
                        "YES"
                    ],
                    name: "userChoice"
                }
            ])
            .then(answer => {
                const { userChoice } = answer; 

                if(userChoice === "NO") return displayMenu(); 

                const empQuery = `SELECT employee.id, role.title, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.name = "${departmentChoice}" ORDER BY department.name`; 

                connection.query(empQuery, function(err, res) {
                    if(err) {
                        console.log("---------------------------------------------------------------------");
                        console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                        console.log("---------------------------------------------------------------------");
                        return displayMenu(); 
                    }  

                    if(res.length > 0) {
                        //Delete every employee in this department. 
                        for(let empIndex = 0; empIndex < res.length; empIndex++) {
                            const query = `DELETE FROM employee WHERE employee.id = ${res[empIndex].id}`; 
                            connection.query(query, function(err) {
                                if(err) {
                                    console.log("---------------------------------------------------------------------");
                                    console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                                    console.log("---------------------------------------------------------------------");
                                    return displayMenu(); 
                                }  

                                console.log(`DELETED EMPLOYEE WITH ID #${res[empIndex].id}`); 
                            }); 
                        }
                    }

                }); 

                const roleQuery = `SELECT role.id, role.title, department.name FROM role LEFT JOIN department ON role.department_id = department.id WHERE department.name = "${departmentChoice}" ORDER BY department.name`; 

                connection.query(roleQuery, function(err, res) {
                    if(err) {
                        console.log("---------------------------------------------------------------------");
                        console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                        console.log("---------------------------------------------------------------------");
                        return displayMenu(); 
                    }  

                    if(res.length > 0) {
                        //Delete every role in this department. 
                        for(let roleIndex = 0; roleIndex < res.length; roleIndex++) {
                            const query = `DELETE FROM role WHERE role.id = ${res[roleIndex].id}`; 
                            connection.query(query, function(err) {
                                if(err) {
                                    console.log("---------------------------------------------------------------------");
                                    console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                                    console.log("---------------------------------------------------------------------");
                                    return displayMenu(); 
                                } 

                                console.log(`DELETED ROLE WITH ID #${res[roleIndex].id}`); 
                                
                            }); 
                        }
                        
                    }

                    const query = `DELETE FROM department WHERE department.name = "${departmentChoice}"`; 

                    connection.query(query, function(err) {
                        if(err) {
                            console.log("---------------------------------------------------------------------");
                            console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                            console.log("---------------------------------------------------------------------");
                            return displayMenu(); 
                        }  
                        
                        //Output the results from this operation. 
                        console.log("---------------------------------------------------------------------");
                        console.log(`DEPARTMENT DELETED SUCCESSFULLY.`);
                        console.log(`DELETED DEPARTMENT "${departmentChoice}" FROM DATABASE.`); 
                        console.log("---------------------------------------------------------------------"); 

                        return displayMenu(); 
                    }); 
                });  
            }); 
        });
    }); 
}

function deleteRole() {
    let roleTitles = []; 

    connection.query("SELECT * FROM role ORDER BY role.id", function(err, res) {
        if(err) displayError(); 

        //Get every role for the user to choose. 
        res.forEach(role => roleTitles.push(role.title)); 

        inquirer.prompt([
            {
                type: "list",
                message: "Select the role to delete:",
                choices: [
                    ...roleTitles
                ], 
                name: "roleChoice"
            }
        ])
        .then(answer => {
            const { roleChoice } = answer; 

            inquirer.prompt([
                {
                    type:"list",
                    message: `ARE YOU SURE YOU WANT TO DELETE THE ${roleChoice} ROLE?`,
                    choices: [
                        "NO",
                        "YES"
                    ],
                    name: "userChoice"
                }
            ])
            .then(answer => {
                const { userChoice } = answer; 

                if(userChoice === "NO") return displayMenu(); 

                const roleQuery = `SELECT role.title, employee.id FROM role LEFT JOIN employee ON employee.role_id = role.id WHERE role.title = "${roleChoice}" ORDER BY role.title`; 

                connection.query(roleQuery, function(err, res) {
                    if(err) {
                        console.log("---------------------------------------------------------------------");
                        console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                        console.log("---------------------------------------------------------------------");
                        return displayMenu(); 
                    }  

                    if(res.length > 0) {
                        //Delete every employee with this role.
                        for(let empIndex = 0; empIndex < res.length; empIndex++) {
                            const query = `DELETE FROM employee WHERE employee.id = ${res[empIndex].id}`; 
                            connection.query(query, function(err) {
                                if(err) {
                                    console.log("---------------------------------------------------------------------");
                                    console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                                    console.log("---------------------------------------------------------------------");
                                    return displayMenu(); 
                                }  

                                console.log(`DELETED EMPLOYEE WITH ID #${res[empIndex].id}`); 
                            }); 
                        }

                    }

                    const query = `DELETE FROM role WHERE role.title = "${roleChoice}"`; 

                    connection.query(query, function(err) {
                        if(err) {
                            console.log("---------------------------------------------------------------------");
                            console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
                            console.log("---------------------------------------------------------------------");
                            return displayMenu(); 
                        }  
                        
                        //Output the results of this operation. 
                        console.log("---------------------------------------------------------------------");
                        console.log(`ROLE DELETED SUCCESSFULLY.`);
                        console.log(`DELETED ROLE "${roleChoice}" FROM DATABASE.`); 
                        console.log("---------------------------------------------------------------------"); 

                        return displayMenu(); 
                    }); 
                }); 
            }); 
        });
    }); 
}

function deleteEmployee() {
    let employeeNames = []; 

    connection.query("SELECT * FROM employee ORDER BY employee.id", function(err, res) {
        if(err) displayError(); 

        //Create list of employees for user to choose from. 
        res.forEach(employee => employeeNames.push(`${employee.id}. ${employee.first_name} ${employee.last_name}`)); 

        inquirer.prompt([
            {
                type: "list",
                message: "Select the employee to delete:",
                choices: [
                    ...employeeNames
                ], 
                name: "employeeName"
            }
        ])
        .then(answer => {
            const { employeeName } = answer; 

            let employeeChoice = Number(employeeName.slice(0, employeeName.indexOf("."))); 

            inquirer.prompt([
                {
                    type:"list",
                    message: `ARE YOU SURE YOU WANT TO DELETE ${employeeName}?`,
                    choices: [
                        "NO",
                        "YES"
                    ],
                    name: "userChoice"
                }
            ])
            .then(answer => {
                const { userChoice } = answer; 

                if(userChoice === "NO") return displayMenu(); 

                const empQuery = `DELETE FROM employee WHERE employee.id = ${employeeChoice}`; 

                connection.query(empQuery, function(err) {
                    if(err) {
                        console.log("---------------------------------------------------------------------");
                        console.log(`ERROR: CHECK TO SEE IF THIS EMPLOYEE IS A MANAGER OF OTHER EMPLOYEES.`);
                        console.log(`BEFORE DELETING ${employeeName}, REASSIGN MANAGER OF ALL DIRECT REPORTING EMPLOYEES.`); 
                        console.log("---------------------------------------------------------------------");
                    } else {
                        console.log("---------------------------------------------------------------------");
                        console.log(`EMPLOYEE DELETED SUCCESSFULLY.`);
                        console.log(`DELETED EMPLOYEE "${employeeName}" FROM DATABASE.`); 
                        console.log("---------------------------------------------------------------------"); 
                    }

                    return displayMenu(); 
                }); 
            }); 
        });
    }); 
}

function updateFields(table, field, newValue, id) {
    let query = ""; 

    //Depending on input type, create query string. 
    if(newValue === "null" || newValue === "NULL") {
        query = `UPDATE ${table} SET ${field}=${newValue} WHERE id=${id}`; 
    } else {
        query = `UPDATE ${table} SET ${field}='${newValue}' WHERE id=${id}`; 
    }
 
    //Update fields and return back to main menu. 
    connection.query(query, function(err) {
        if(err) displayError();
        
        console.log("---------------------------------------------------------------------");
        console.log(`FIELD UPDATED SUCCESSFULLY.`);
        console.log(`UPDATED ID #${id} IN FIELD ${field} OF TABLE ${table} TO ${newValue}.`); 
        console.log("---------------------------------------------------------------------");
        return displayMenu(); 
    }); 
}

function viewTotalBudget() {
    console.log("ADD TOTAL SALARY OF ALL EMPLOYEES IN A DEPT."); 

    query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, department.id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY department.id"; 

    //Access every employee in each department. 
    connection.query(query, function(err, res) {
        if(err) displayError(); 

        let departmentBudgets = [];
        let currentTotal = 0;  
        let totalEmployees = 0; 

        //Go through each of the results (each employee) and keep track of the total employees and the current total for each department. 
        //Each time a new department is found, package and store data for that department and move on to the next. 
        //Special cases for if there is only one entry or if the program has reached the end of the results. 
        for(let resIndex = 0; resIndex < res.length; resIndex++) {
            if(resIndex === 0) {
                currentTotal = res[resIndex].salary;
                totalEmployees++; 
                if(res.length === 1) {
                    departmentBudgets.push({
                        "Department:": res[resIndex].name,
                        "Total Employees":totalEmployees,
                        "Total Utilized Budget":currentTotal
                    }); 
                }
            } else if(resIndex === res.length - 1) {
                if(res[resIndex - 1].id !== res[resIndex].id) {
                    departmentBudgets.push({
                        "Department":res[resIndex - 1].name,
                        "Total Employees":totalEmployees,
                        "Total Utilized Budget":currentTotal
                    }); 
                    departmentBudgets.push({
                        "Department":res[resIndex].name,
                        "Total Employees":1,
                        "Total Utilized Budget":res[resIndex].salary
                    }); 
                } else {
                    currentTotal += res[resIndex].salary;
                    totalEmployees++;  
                    departmentBudgets.push({
                        "Department":res[resIndex].name,
                        "Total Employees":totalEmployees,
                        "Total Utilized Budget":currentTotal
                    }); 
                }
            } else if(res[resIndex].id === res[resIndex - 1].id) {
                currentTotal += res[resIndex].salary; 
                totalEmployees++; 
            } else {
                departmentBudgets.push({
                    "Department":res[resIndex - 1].name,
                    "Total Employees":totalEmployees,
                    "Total Utilized Budget":currentTotal
                }); 
                currentTotal = res[resIndex].salary; 
                totalEmployees = 1; 
            }
        }

        //Output results. 
        console.log(""); 
        console.log("----------------------- TOTAL UTILIZED BUDGET (BY DEPARTMENT) ------------------------");
        console.log(""); 
        console.table(departmentBudgets); 
        console.log("--------------------------------------------------------------------------------------");

        //Track the total expenditures in all and output. 
        let companyTotal = 0; 

        departmentBudgets.forEach(department => {
            companyTotal += department["Total Utilized Budget"];
        }); 

        console.log(`TOTAL COMPANY UTILIZED BUDGET: ${companyTotal}`); 
        console.log("--------------------------------------------------------------------------------------");

        return displayMenu();
    }); 
}

function displayError() {
    console.log("---------------------------------------------------------------------");
    console.log(`ERROR: SOMETHING WENT WRONG. RETURNING TO MAIN MENU.`);
    console.log("---------------------------------------------------------------------");
    return displayMenu(); 
}



