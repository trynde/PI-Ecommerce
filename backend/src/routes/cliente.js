const express = require("express");
const rotas = express.Router();
const connection = require("../db/db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


rotas.get("/cliente", async (req,res) => {
  connection.query('SELECT * FROM cliente', (err, result) =>  {
      res.send(result);
  })
})

// Rota para buscar um cliente específico pelo ID
rotas.get('/BuscarClientes/:id', (req, res) => {
  const clienteId = req.params.id;
  connection.query('SELECT * FROM cliente WHERE id = ?', [clienteId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar cliente:', err);
      res.status(500).json({ message: 'Erro ao buscar cliente' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Cliente não encontrado' });
      return;
    }
    res.json(results[0]);
  });
});


rotas.post('/loginU', (req, res) => {
    const { email, senha } = req.body;
  
    // Verifica se o email e a senha foram fornecidos para prosseguir
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Por favor, forneça email e senha' });
    }
  
    // Consulta o banco de dados para obter os dados do usuário associado ao email fornecido
    const query = 'SELECT id, senha FROM cliente WHERE email = ?';
    connection.query(query, [email], (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta:', err);
        return res.status(500).json({ mensagem: 'Ocorreu um erro ao tent  ar fazer login' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }
      const { id, senha: hashSenha } = results[0];
  
      // Compara a senha fornecida pelo usuário com a senha criptografada armazenada no banco de dados
      bcrypt.compare(senha, hashSenha, (err, result) => {
        if (err) {
          console.error('Erro ao comparar senhas:', err);
          return res.status(500).json({ mensagem: 'Ocorreu um erro ao tentar fazer login' });
        }
  
        if (result) {
          // Senha correta
          res.status(200).json({ mensagem: 'Login bem-sucedido', id });
        } else {
          // Senha incorreta
          res.status(401).json({ mensagem: 'Credenciais inválidas' });
        }
      });
    });
  });

  rotas.post('/cliente', async (req, res) => {
    const { nome, data_nascimento, genero, email, cpf, senha, endereco, numero, bairro, cidade, estado, cep  } = req.body;
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);
  
    // Verifica se todos os campos foram fornecidos
   
  
    // Consulta SQL para verificar se o e-mail já está cadastrado
    connection.query('SELECT * FROM cliente WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Erro ao verificar e-mail:', error);
            return res.status(500).json({ mensagem: 'Erro ao verificar e-mail.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ mensagem: "E-mail já cadastrado" });
        }
  
        // Consulta SQL para verificar se o CPF já está cadastrado
        connection.query('SELECT * FROM cliente WHERE cpf = ?', [cpf], (error, results) => {
            if (error) {
                console.error('Erro ao verificar CPF:', error);
                return res.status(500).json({ mensagem: 'Erro ao verificar CPF.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ mensagem: "CPF já cadastrado" });
            }
  
            // Insere os dados na tabela usuarios
            const query = 'INSERT INTO cliente (nome, data_nascimento, genero, email, cpf, senha, endereco, numero, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(query, [nome, data_nascimento, genero, email, cpf, passwordHash, endereco, numero, bairro, cidade, estado, cep], (error, results) => {
                if (error) {
                    console.error('Erro ao inserir dados:', error);
                    return res.status(500).json({ mensagem: 'Erro ao inserir dados.' });
                }
                console.log('Dados inseridos com sucesso:', results);
                res.status(201).json({ mensagem: 'Dados inseridos com sucesso.' });
            });
        });
    });
  });

  rotas.get('/cliente/:id', async(req, res)=>{
    const {id} = req.params;
    connection.query('SELECT * FROM cliente WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar situação:', error);
            return res.status(500).json({ mensagem: 'Erro ao atualizar situação.' });
        }
        res.send(results);
    });
})

rotas.get('/buscarcliente/:id', async(req, res)=>{
  const {id} = req.params;
  connection.query('SELECT * FROM cliente WHERE id = ?', [id], (error, results) => {
      if (error) {
          console.error('Erro ao atualizar situação:', error);
          return res.status(500).json({ mensagem: 'Erro ao atualizar situação.' });
      }
      res.send(results);
  });
})

rotas.put('/editarCliente/:id', (req, res) => {
  const userId = req.params.id;
  const { nome, data_nascimento, genero, email, cpf, senha } = req.body;

  // Consulta o banco de dados para obter a senha atual do usuário
  const queryGetPassword = `SELECT senha FROM cliente WHERE id = ?`;
  connection.query(queryGetPassword, [userId], (err, results) => {
      if (err) {
          console.error('Erro ao consultar senha do usuário:', err);
          return res.status(500).json({ mensagem: 'Ocorreu um erro ao consultar a senha do usuário' });
      }

      if (results.length === 0) {
          return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      const userPasswordHash = results[0].senha;

      // Compara a senha fornecida com a senha armazenada no banco de dados
      bcrypt.compare(senha, userPasswordHash, (compareErr, isMatch) => {
          if (compareErr) {
              console.error('Erro ao comparar senhas:', compareErr);
              return res.status(500).json({ mensagem: 'Ocorreu um erro ao comparar as senhas' });
          }

          if (isMatch) {
              // Senha fornecida é igual à senha do usuário no banco de dados, retornar erro
              return res.status(400).json({ mensagem: 'A nova senha deve ser diferente da senha atual' });
          }

          // As senhas não são iguais, prosseguir com a atualização
          // Hash da nova senha
          bcrypt.hash(senha, 10, (hashErr, hashedPassword) => {
              if (hashErr) {
                  console.error('Erro ao gerar hash da senha:', hashErr);
                  return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar a senha' });
              }

              // Atualiza os dados do usuário no banco de dados
              const queryUpdate = `UPDATE cliente SET nome = ?, data_nascimento = ?, genero = ?, email = ?, cpf = ?, senha = ? WHERE id = ?`;
              connection.query(queryUpdate, [nome, data_nascimento, genero, email, cpf, senha], (updateErr, result) => {
                  if (updateErr) {
                      console.error('Erro ao atualizar usuário:', updateErr);
                      return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar o usuário' });
                  }
                  res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
              });
          });
      });
  });
});

rotas.post('/endereco', async (req, res) => {
  const { cliente_id, endereco, numero, bairro, cidade, estado } = req.body;


  // Insere os dados na tabela enderecos
  const query = 'INSERT INTO endereco_alternativo (cliente_id, endereco, numero, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [cliente_id, endereco, numero, bairro, cidade, estado], (error, results) => {
    if (error) {
      console.error('Erro ao inserir dados:', error);
      return res.status(500).json({ mensagem: 'Erro ao inserir dados.' });
    }
    console.log('Dados inseridos com sucesso:', results);
    res.status(201).json({ mensagem: 'Dados inseridos com sucesso.' });
  });
});



  module.exports = rotas