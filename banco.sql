create database backend;
use backend;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    grupo VARCHAR(50) NOT NULL, 
    situacao VARCHAR(50) NOT NULL
    );
