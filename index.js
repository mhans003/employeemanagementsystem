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
            case "Quit \n":
                console.log(`Goodbye!`); 
                connection.end(); 
        }
    }); 
}

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