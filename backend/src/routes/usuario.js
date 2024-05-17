const express = require("express");
const rotas = express.Router();
const connection = require("../db/db")
const bcrypt = require("bcrypt");

rotas.get("/", async (req,res) => {
    connection.query('SELECT * FROM USUARIOS', (err, result) =>  {
        res.send(result);
    })
})

rotas.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verifica se o email e a senha foram fornecidos para prosseguir
  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Por favor, forneça email e senha' });
  }

  // Consulta o banco de dados para obter os dados do usuário associado ao email fornecido
  const query = 'SELECT id, grupo, situacao, senha FROM usuarios WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      return res.status(500).json({ mensagem: 'Ocorreu um erro ao tentar fazer login' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }
    const { id, situacao, grupo, senha: hashSenha } = results[0];

    // Compara a senha fornecida pelo usuário com a senha criptografada armazenada no banco de dados
    bcrypt.compare(senha, hashSenha, (err, result) => {
      if (err) {
        console.error('Erro ao comparar senhas:', err);
        return res.status(500).json({ mensagem: 'Ocorreu um erro ao tentar fazer login' });
      }

      if (result) {
        // Senha correta
        res.status(200).json({ mensagem: 'Login bem-sucedido', id, grupo, situacao });
      } else {
        // Senha incorreta
        res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }
    });
  });
});

rotas.post('/usuarios', async (req, res) => {
  const { nome, email, cpf, senha, grupo, situacao } = req.body;
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(senha, salt);

  // Verifica se todos os campos foram fornecidos
  if (!nome || !email || !cpf || !senha || !grupo || !situacao) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  // Consulta SQL para verificar se o e-mail já está cadastrado
  connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
      if (error) {
          console.error('Erro ao verificar e-mail:', error);
          return res.status(500).json({ mensagem: 'Erro ao verificar e-mail.' });
      }
      if (results.length > 0) {
          return res.status(400).json({ mensagem: "E-mail já cadastrado" });
      }

      // Consulta SQL para verificar se o CPF já está cadastrado
      connection.query('SELECT * FROM usuarios WHERE cpf = ?', [cpf], (error, results) => {
          if (error) {
              console.error('Erro ao verificar CPF:', error);
              return res.status(500).json({ mensagem: 'Erro ao verificar CPF.' });
          }
          if (results.length > 0) {
              return res.status(400).json({ mensagem: "CPF já cadastrado" });
          }

          // Insere os dados na tabela usuarios
          const query = 'INSERT INTO usuarios (nome, email, cpf, senha, grupo, situacao) VALUES (?, ?, ?, ?, ?, ?)';
          connection.query(query, [nome, email, cpf, passwordHash, grupo, situacao], (error, results) => {
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


rotas.put('/Editar/:id', (req, res) => {
    const userId = req.params.id;
    const { nome, cpf, senha, grupo } = req.body;

    // Consulta o banco de dados para obter a senha atual do usuário
    const queryGetPassword = `SELECT senha FROM usuarios WHERE id = ?`;
    connection.query(queryGetPassword, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao consultar senha do usuário:', err);
            return res.status(500).json({ mensagem: 'Ocorreu um erro ao consultar a senha do usuário' });
        }

        if (results.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        const userPasswordHash = results[0].senha;

        // Verifica se a senha foi fornecida e precisa ser atualizada
        if (senha) {
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

                    // Atualiza a senha no banco de dados
                    atualizarUsuario(userId, nome, cpf, hashedPassword, grupo, res);
                });
            });
        } else {
            // Não precisa atualizar a senha, prosseguir com a atualização dos outros campos
            atualizarUsuario(userId, nome, cpf, null, grupo, res);
        }
    });
});

function atualizarUsuario(userId, nome, cpf, senha, grupo, res) {
    // Cria um objeto com os campos a serem atualizados
    const camposParaAtualizar = {};
    if (nome) camposParaAtualizar.nome = nome;
    if (cpf) camposParaAtualizar.cpf = cpf;
    if (senha) camposParaAtualizar.senha = senha;
    if (grupo) camposParaAtualizar.grupo = grupo;

    // Monta a query de atualização dinamicamente
    const setClause = Object.keys(camposParaAtualizar).map(campo => `${campo} = ?`).join(', ');
    const queryUpdate = `UPDATE usuarios SET ${setClause} WHERE id = ?`;
    const valores = [...Object.values(camposParaAtualizar), userId];

    connection.query(queryUpdate, valores, (updateErr, result) => {
        if (updateErr) {
            console.error('Erro ao atualizar usuário:', updateErr);
            return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar o usuário' });
        }
        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    });
}

rotas.put('/Editar/semSenha/:id', (req, res) => {
    const userId = req.params.id;
    const { nome, cpf, grupo } = req.body;
  // Atualiza os dados do usuário no banco de dados
                const queryUpdate = `UPDATE usuarios SET nome = ?, cpf = ?, grupo = ? WHERE id = ?`;
                connection.query(queryUpdate, [nome, cpf, grupo, userId], (updateErr, result) => {
                    if (updateErr) {
                        console.error('Erro ao atualizar usuário:', updateErr);
                        return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar o usuário' });
                    }
                    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
                });
            });

  rotas.get('/pescarusuarios/:id', async(req, res)=>{
      const {id} = req.params;
      connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (error, results) => {
          if (error) {
              console.error('Erro ao atualizar situação:', error);
              return res.status(500).json({ mensagem: 'Erro ao atualizar situação.' });
          }
          res.send(results);
      });
  })

  rotas.put('/usuarios/:id/situacao', async (req, res) => {
    const { id } = req.params;
    const { situacao } = req.body;

    // Verificar se a situação fornecida é válida
    if (!situacao) {
        return res.status(400).json({ mensagem: "A situação não foi fornecida." });
    }

    // Atualizar a situação do usuário no banco de dados
    connection.query('UPDATE usuarios SET situacao = ? WHERE id = ?', [situacao, id], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar situação:', error);
            return res.status(500).json({ mensagem: 'Erro ao atualizar situação.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
        console.log('Situação atualizada com sucesso.');
        res.status(200).json({ mensagem: 'Situação atualizada com sucesso.' });
    });
});

rotas.get('/usuario/:id', async(req, res)=>{
    const {id} = req.params;
    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar situação:', error);
            return res.status(500).json({ mensagem: 'Erro ao atualizar situação.' });
        }
        res.send(results);
    });
})

module.exports = rotas;
