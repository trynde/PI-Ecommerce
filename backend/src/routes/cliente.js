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

      // Função para atualizar os dados do usuário no banco de dados
      const updateUser = (hashedPassword) => {
          let fields = [];
          let values = [];

          if (nome) {
              fields.push('nome = ?');
              values.push(nome);
          }
          if (data_nascimento) {
              fields.push('data_nascimento = ?');
              values.push(data_nascimento);
          }
          if (genero) {
              fields.push('genero = ?');
              values.push(genero);
          }
          if (email) {
              fields.push('email = ?');
              values.push(email);
          }
          if (cpf) {
              fields.push('cpf = ?');
              values.push(cpf);
          }
          if (senha && hashedPassword) {
              fields.push('senha = ?');
              values.push(hashedPassword);
          }

          values.push(userId);

          if (fields.length === 0) {
              return res.status(400).json({ mensagem: 'Nenhum campo para atualizar' });
          }

          const queryUpdate = `UPDATE cliente SET ${fields.join(', ')} WHERE id = ?`;
          connection.query(queryUpdate, values, (updateErr, result) => {
              if (updateErr) {
                  console.error('Erro ao atualizar usuário:', updateErr);
                  return res.status(500).json({ mensagem: 'Ocorreu um erro ao atualizar o usuário' });
              }
              res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
          });
      };

      if (senha) {
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

                  // Chama a função para atualizar o usuário com a nova senha hash
                  updateUser(hashedPassword);
              });
          });
      } else {
          // Senha não está sendo atualizada, chama a função para atualizar o usuário sem alterar a senha
          updateUser(null);
      }
  });
});

rotas.post('/endereco', async (req, res) => {
  const { cliente_id, endereco, numero, bairro, cidade, estado, tipo, situacao } = req.body;

  const query = 'INSERT INTO enderecoAlternativo (cliente_id, endereco, numero, bairro, cidade, estado, tipo, situacao) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
  const values = [cliente_id, endereco, numero, bairro, cidade, estado, tipo, situacao];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao adicionar endereço:', err);
      res.status(500).send('Erro ao adicionar endereço');
      return;
    }
    console.log('Novo endereço adicionado com sucesso');
    res.status(201).send('Endereço adicionado com sucesso');
  });
  
});

rotas.get('/enderecos/:cliente_id', (req, res) => {
  const { cliente_id } = req.params;

  const queryGetEnderecos = `
      SELECT 
          id,
          endereco, 
          numero, 
          bairro, 
          cidade, 
          estado, 
          tipo, 
          situacao 
      FROM 
          enderecoAlternativo 
      WHERE 
          cliente_id = ?`;

  connection.query(queryGetEnderecos, [cliente_id], (err, results) => {
      if (err) {
          console.error('Erro ao consultar endereços alternativos:', err);
          return res.status(500).json({ mensagem: 'Ocorreu um erro ao consultar os endereços alternativos' });
      }

      if (results.length === 0) {
          return res.status(404).json({ mensagem: 'Nenhum endereço alternativo encontrado' });
      }

      res.status(200).json(results);
  });
});

rotas.get('/enderecosCompra/:cliente_id', (req, res) => {
  const { cliente_id } = req.params;

  const queryGetEnderecos = `
      SELECT 
          id,
          endereco, 
          numero, 
          bairro, 
          cidade, 
          estado, 
          tipo, 
          situacao 
      FROM 
          enderecoAlternativo 
      WHERE 
          cliente_id = ? AND situacao = 'ativo';`;

  connection.query(queryGetEnderecos, [cliente_id], (err, results) => {
      if (err) {
          console.error('Erro ao consultar endereços alternativos:', err);
          return res.status(500).json({ mensagem: 'Ocorreu um erro ao consultar os endereços alternativos' });
      }

      if (results.length === 0) {
          return res.status(404).json({ mensagem: 'Nenhum endereço alternativo encontrado' });
      }

      res.status(200).json(results);
  });
});

rotas.put('/endereco/:id/situacao', async (req, res) => {
  const { id } = req.params;
  const { situacao } = req.body;

  // Verificar se a situação fornecida é válida
  if (!situacao) {
      return res.status(400).json({ mensagem: "A situação não foi fornecida." });
  }

  // Atualizar a situação do usuário no banco de dados
  connection.query('UPDATE enderecoAlternativo SET situacao = ? WHERE id = ?', [situacao, id], (error, results) => {
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

rotas.post('/api/saveCompra', (req, res) => {
    const { compra } = req.body;

    const checkSql = 'SELECT COUNT(*) AS count FROM compras WHERE protocolo = ?';
    const insertSql = 'INSERT INTO compras (protocolo, total, frete, situacao) VALUES (?, ?, ?, ?)';
    const params = [compra.protocolo, compra.total, compra.frete, 'Aguardando Pagamento'];

    // Verificar se já existe uma compra com o mesmo protocolo
    connection.query(checkSql, [compra.protocolo], (err, results) => {
        if (err) {
            console.error('Erro ao verificar a compra:', err.message);
            return res.status(500).json({ error: err.message });
        }

        if (results[0].count > 0) {
            // Já existe uma compra com o mesmo protocolo
            return res.status(409).json({ message: 'Compra já existe' });
        }

        // Se não existe, insere a nova compra
        connection.query(insertSql, params, (err, result) => {
            if (err) {
                console.error('Erro ao salvar a compra:', err.message);
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({ message: 'Compra salva com sucesso', id: result.insertId });
        });
    });
});

rotas.post('/ComprasF', (req, res) => {
    const { cliente_id, endereco_id, formaPagamento, numeroCartao, codigoVerificador, nomeCompleto, dataVencimento, quantidadeParcelas, frete, total, protocolo, situacao } = req.body;
  
    const query = 'INSERT INTO comprasteste (cliente_id, endereco_id, formaPagamento, numeroCartao, codigoVerificador, nomeCompleto, dataVencimento, quantidadeParcelas, frete, total, protocolo, situacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [cliente_id, endereco_id, formaPagamento, numeroCartao, codigoVerificador, nomeCompleto, dataVencimento, quantidadeParcelas, frete, total, protocolo, situacao];
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Erro ao adicionar compra:', err);
        res.status(500).send('Erro ao adicionar compra');
        return;
      }
      console.log('Compra adicionada com sucesso');
      res.status(201).send('Compra adicionada com sucesso');
    });
  });
  
  rotas.get('/compras/:cliente_id', (req, res) => {
    const { cliente_id } = req.params;
  
    connection.query('SELECT * FROM comprasteste WHERE cliente_id = ?', [cliente_id], (err, results) => {
      if (err) {
        console.error('Erro ao buscar compras:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar compras' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ mensagem: 'Nenhuma compra encontrada' });
        return;
      }
      res.status(200).json(results);
    });
  });
  
  // Rotas para a tabela CartItems
  rotas.post('/cartItems', (req, res) => {
    const { cliente_id, produto_id, nomeProduto, preco, quantidade } = req.body;
  
    // Primeiro, execute uma consulta para obter o compra_id da tabela compras
    const getCompraIdQuery = 'SELECT id FROM comprasteste WHERE cliente_id = ?';
    connection.query(getCompraIdQuery, [cliente_id], (err, results) => {
        if (err) {
            console.error('Erro ao obter o compra_id:', err);
            res.status(500).send('Erro ao obter o compra_id');
            return;
        }

        if (results.length === 0) {
            console.error('Nenhuma compra encontrada para o cliente');
            res.status(404).send('Nenhuma compra encontrada para o cliente');
            return;
        }

        const compra_id = results[0].id;

        // Agora que temos o compra_id, podemos inserir o item no carrinho (cartitems)
        const insertCartItemQuery = 'INSERT INTO cartitems (cliente_id, produto_id, compra_id, nomeProduto, preco, quantidade) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [cliente_id, produto_id, compra_id, nomeProduto, preco, quantidade];
      
        connection.query(insertCartItemQuery, values, (err, result) => {
            if (err) {
                console.error('Erro ao adicionar item ao carrinho:', err);
                res.status(500).send('Erro ao adicionar item ao carrinho');
                return;
            }
            console.log('Item adicionado ao carrinho com sucesso');
            res.status(201).send('Item adicionado ao carrinho com sucesso');
        });
    });
});


  
rotas.get('/cartItems/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT * FROM cartitems WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar itens do carrinho:', err);
      res.status(500).json({ mensagem: 'Erro ao buscar itens do carrinho' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ mensagem: 'Nenhum item do carrinho encontrado' });
      return;
    }

    // Supondo que os campos da tabela cartitems sejam: id, protocolo, formaPagamento, total, enderecoSelecionado, nomeProduto
    const compra = {
      protocolo: results[0].protocolo,
      formaPagamento: results[0].formaPagamento,
      total: results[0].preco,
      enderecoSelecionado: results[0].enderecoSelecionado,
      itens: results.map(item => ({
        nomeProduto: item.nomeProduto
      }))
    };

    res.status(200).json(compra);
  });
});

rotas.post('/ComprasF', (req, res) => {
  const { cliente_id, endereco_id, formaPagamento, numeroCartao, codigoVerificador, nomeCompleto, dataVencimento, quantidadeParcelas, frete, total, protocolo, situacao } = req.body;

  const query = `
    INSERT INTO cartitems (cliente_id, endereco_id, formaPagamento, numeroCartao, codigoVerificador, nomeCompleto, dataVencimento, quantidadeParcelas, frete, total, protocolo, situacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [cliente_id, endereco_id, formaPagamento, numeroCartao, codigoVerificador, nomeCompleto, dataVencimento, quantidadeParcelas, frete, total, protocolo, situacao], (err, result) => {
    if (err) {
      console.error('Erro ao salvar compra:', err);
      res.status(500).json({ mensagem: 'Erro ao salvar compra' });
      return;
    }
    // Retornar o ID da compra recém-criada
    res.status(201).json({ compra_id: result.insertId });
  });
});




  rotas.get('/compras', (req, res) => {
  
    connection.query('SELECT * FROM comprasteste', (err, results) => {
      if (err) {
        console.error('Erro ao buscar compras:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar compras' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ mensagem: 'Nenhuma compra encontrada' });
        return;
      }
      res.status(200).json(results);
    });
  });
  

  rotas.put('/compras/:id/situacao', (req, res) => {
    const { id } = req.params;
    const { situacao } = req.body;
  
    // Verificar se a situação fornecida é válida
    if (!situacao) {
      return res.status(400).json({ mensagem: "A situação não foi fornecida." });
    }
  
    // Atualizar a situação da compra no banco de dados
    connection.query('UPDATE comprasteste SET situacao = ? WHERE id = ?', [situacao, id], (error, results) => {
      if (error) {
        console.error('Erro ao atualizar situação da compra:', error);
        return res.status(500).json({ mensagem: 'Erro ao atualizar situação da compra.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ mensagem: 'Compra não encontrada.' });
      }
      console.log('Situação da compra atualizada com sucesso.');
      res.status(200).json({ mensagem: 'Situação da compra atualizada com sucesso.' });
    });
  });
module.exports = rotas