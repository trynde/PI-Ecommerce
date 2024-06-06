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

    -- Criação da tabela 'produto'
CREATE TABLE produto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomeProduto VARCHAR(255) NOT NULL,
  avaliacao VARCHAR(255) NOT NULL,
  descricao VARCHAR(2000) NOT NULL,
  preco VARCHAR(255) NOT NULL,
  estoque VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL
);

-- Criação da tabela 'imagemProduto'
CREATE TABLE imagemProduto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomeImagem VARCHAR(255) NOT NULL,
  produtoId  INT,
  FOREIGN KEY (produtoId) REFERENCES produto(id) ON DELETE CASCADE
);

CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento date NOT NULL,
    genero ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    numero VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    cep VARCHAR(10) NOT NULL
);

CREATE TABLE enderecoAlternativo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    endereco VARCHAR(255) NOT NULL,
    numero VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
	tipo ENUM('principal', 'alternativo') NOT NULL,
    situacao ENUM('ativo', 'inativo') NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

CREATE TABLE `carrinho` (
	`id` INT AUTO_INCREMENT PRIMARY KEY,
    `cliente_id` INT NOT NULL,
    `compra_id` INT NULL,
    `status` ENUM('OPEN', 'DELETED', 'DONE') NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE `carrinho_produtos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `carrinho_id` INT NOT NULL,
    `produto_id` INT NOT NULL,
    `quantidade` INT NOT NULL
);

CREATE TABLE compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('AGUARDANDO_PAGAMENTO', 'PAGO_COM_SUCESSO', 'AGUARDANDO_RETIRADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA', 'FINALIZADA') NOT NULL DEFAULT 'DADOS_PENDENTES',
    cliente_id INT NOT NULL,
    carrinho_id INT NOT NULL,
    endereco VARCHAR(255) NULL,
    tipo_pagamento VARCHAR(255) NULL,
    parcelas INT NULL,
    valor_parcelas DECIMAL(10,2) NULL,
    valor_total DECIMAL(10,2) NULL,
    pago_em DATETIME(3) NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

CREATE TABLE compras (
      id INTEGER PRIMARY KEY AUTO_INCREMENT,
      protocolo VARCHAR(255),
      total REAL,
      frete REAL,
      situacao VARCHAR(255));
