-- DROP DATABASE employee_CMS; --

CREATE DATABASE employee_CMS; 

USE employee_CMS; 

CREATE TABLE department(
id INTEGER AUTO_INCREMENT UNIQUE,
name VARCHAR(30) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE role(
id INTEGER AUTO_INCREMENT UNIQUE,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INTEGER NULL,
FOREIGN KEY(department_id) REFERENCES department(id),
PRIMARY KEY(id)
);

CREATE TABLE employee(
id INTEGER AUTO_INCREMENT UNIQUE,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NULL,
manager_id INTEGER NULL,
FOREIGN KEY(role_id) REFERENCES role(id),
FOREIGN KEY(manager_id) REFERENCES employee(id),
PRIMARY KEY(id)
);

INSERT INTO department (name) 
VALUES ("Web Development");

INSERT INTO department (name) 
VALUES ("Finance");

INSERT INTO department (name) 
VALUES ("Marketing");

INSERT INTO department (name) 
VALUES ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES("Junior Developer",90000,1); 

INSERT INTO role (title, salary, department_id)
VALUES("Senior Developer",120000,1); 

INSERT INTO role (title, salary, department_id)
VALUES("Software Director",140000,1); 

INSERT INTO role (title, salary, department_id)
VALUES("Accountant",110000,2); 

INSERT INTO role (title, salary, department_id)
VALUES("Financial Analyst",150000,2); 

INSERT INTO role (title, salary, department_id)
VALUES("Marketing Coordinator",70000,3);

INSERT INTO role (title, salary, department_id)
VALUES("Marketing Director",110000,3);

INSERT INTO role (title, salary, department_id)
VALUES("HR Director",120000,4);

INSERT INTO role (title, salary, department_id)
VALUES("HR Specialist",90000,4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Max","Frank",3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Jane","Doe",2,1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Jim","Smith",1,2); 

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Jason","Akins",4); 

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Sarah","French",5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Rebecca","Jamison",7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Jessica","Elliot",6,6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Rachel","Johnson",8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Michael","Jared",9,8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Tom","Savage",1,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Jill","Robinson",1,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Sammy","Ricks",9,8);


