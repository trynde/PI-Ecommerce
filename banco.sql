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

    CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
	  nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    numero VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL
    );

    -- Criação da tabela 'produto'
CREATE TABLE produto (
  id SERIAL PRIMARY KEY,
  nomeProduto VARCHAR(255) NOT NULL,
  avaliacao VARCHAR(255) NOT NULL,
  descricao VARCHAR(2000) NOT NULL,
  preco VARCHAR(255) NOT NULL,
  estoque VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL
);

-- Criação da tabela 'imagemProduto'
CREATE TABLE imagemProduto (
  id SERIAL PRIMARY KEY,
  nomeImagem VARCHAR(255) NOT NULL,
  produtoId  VARCHAR(255),
  FOREIGN KEY (produtoId) REFERENCES produto(id) ON DELETE CASCADE
);
