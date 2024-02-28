create database backend;
use backend;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    grupo VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
);

INSERT INTO usuario (email, cpf, senha, grupo, status)
VALUES 
('usuario1@example.com', '12345678901', 'senha123', 'grupo1', 'ativo'),
('usuario2@example.com', '23456789012', 'senha456', 'grupo2', 'inativo'),
('usuario3@example.com', '34567890123', 'senha789', 'grupo1', 'ativo');

drop table usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    grupo VARCHAR(50) NOT NULL, 
    situacao VARCHAR(50) NOT NULL
    );
