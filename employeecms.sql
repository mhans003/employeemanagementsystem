DROP DATABASE employee_CMS; 

CREATE DATABASE employee_CMS; 

USE employee_CMS; 

CREATE TABLE department(
id INTEGER AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE role(
id INTEGER AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INTEGER NOT NULL,
FOREIGN KEY(department_id) REFERENCES department(id),
PRIMARY KEY(id)
);

CREATE TABLE employee(
id INTEGER AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL,
manager_id INTEGER NULL,
FOREIGN KEY(role_id) REFERENCES role(id),
FOREIGN KEY(manager_id) REFERENCES employee(id),
PRIMARY KEY(id)
);

INSERT INTO department (name) 
VALUES ("web development");

INSERT INTO role (title, salary, department_id)
VALUES("web designer",70000,1); 

INSERT INTO role (title, salary, department_id)
VALUES("manager",100000,1); 

INSERT INTO role (title, salary, department_id)
VALUES("junior engineer",110000,1); 

INSERT INTO role (title, salary, department_id)
VALUES("senior engineer",140000,1); 

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Jane","Doe",2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Jim","Smith",1,1); 

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Max","F",4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Jason","A",3,3); 




