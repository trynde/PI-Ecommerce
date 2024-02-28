const express = require("express");
const rotas = express.Router();
const connection = require("../db/db")

rotas.get("/", async (req,res) => {
    connection.query('SELECT * FROM USUARIOS', (err, result) =>  {
        res.send(result);
    })
})
rotas.post('/usuarios', (req, res) => {
    const { nome, email, cpf, senha, grupo, situacao } = req.body;
  
    // Verifica se todos os campos foram fornecidos
    if (!nome || !email || !cpf || !senha || !grupo || !situacao) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
  
    // Insere os dados na tabela usuarios
    const query = 'INSERT INTO usuarios (nome, email, cpf, senha, grupo, situacao) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [nome, email, cpf, senha, grupo, situacao], (error, results) => {
      if (error) {
        console.error('Erro ao inserir dados:', error);
        return res.status(500).json({ message: 'Erro ao inserir dados.' });
      }
      console.log('Dados inseridos com sucesso:', results);
      res.status(201).json({ message: 'Dados inseridos com sucesso.' });
    });
  });  

  
  rotas.put('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    const { nome, cpf, senha, grupo } = req.body;
  
    // Verifica se todos os campos necessários foram fornecidos
    if (!nome || !cpf || !senha || !grupo) {
      return res.status(400).json({ mensagem: 'Por favor, forneça todos os campos: nome, cpf, senha, grupo' });
    }
  
    // Atualiza os dados do usuário no banco de dados
    const query = `UPDATE usuarios SET nome = ?, cpf = ?, senha = ?, grupo = ? WHERE id = ?`;
    connection.query(query, [nome, cpf, senha, grupo, userId], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar o usuário' });
      }
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    });
  });

module.exports = rotas;