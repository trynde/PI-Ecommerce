const express = require('express');
const multer = require('multer');
const rotas = express();
const connection = require("../db/db");
const path = require('path');
const fs = require('fs');
rotas.use(express.json());

rotas.get("/produto", async (req,res) => {
  connection.query('SELECT * FROM produto', (err, result) =>  {
      res.send(result);
  })
})
// Rota para listar produtos com suas imagens
rotas.get("/listarProdutosImagens", async (req, res) => {
    try {
        // Consulta SQL para selecionar produtos com apenas uma imagem por produto
        const query = `
            SELECT p.*, MIN(i.nomeImagem) AS nomeImagem
            FROM produto p
            LEFT JOIN imagemProduto i ON p.id = i.produtoId
            GROUP BY p.id
            ORDER BY p.id DESC
        `;

        // Execute a consulta SQL
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.error("Erro ao buscar produtos:", error);
                res.status(500).json({ error: "Falha ao buscar produtos" });
                return;
            }

            // Envie os resultados como resposta
            res.json(results);
        });
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ error: "Falha ao buscar produtos" });
    }
});


// Rota para upload de imagem
rotas.post("/upload/:id", function (req, res) {
    connection.connect((err) => {
        if (err) {
          console.error('Erro ao conectar ao banco de dados:', err);
          return;
        }
        console.log('Conexão bem-sucedida ao banco de dados!');
      });
    const { id } = req.params;

    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `${__dirname}/public`);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + ".jpg");
            },
        });

        const upload = multer({ storage: storage }).single("file");

        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).send(err);
            } else if (err) {
                return res.status(500).send(err);
            }
            const fileName = req.file.filename;

            const query = `INSERT INTO ImagemProduto (produtoId, nomeImagem) VALUES (?, ?)`;
            const values = [id, fileName];

            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Erro ao inserir dados na tabela ImagemProduto:', err);
                    res.status(500).json({ error: 'Erro ao inserir dados na tabela ImagemProduto' });
                    return;
                }
                console.log('Dados inseridos com sucesso na tabela ImagemProduto!');
                return res.status(200).send({ msg: "Imagem enviada e dados inseridos com sucesso" });
            });
        });

    } catch (error) {
        console.error('Erro ao enviar imagens:', error);
        res.status(500).json({ error: 'Falha ao enviar imagens' });
    }
});
// Rota POST para adicionar um novo produto
rotas.post('/criarProduto', (req, res) => {
    const { nomeProduto, avaliacao, descricao, preco, estoque, status } = req.body;

    const queryString = `INSERT INTO PRODUTO (nomeProduto, avaliacao, descricao, preco, estoque, status) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [nomeProduto, avaliacao, descricao, preco, estoque, status];

    connection.query(queryString, values, (error, results) => {
        if (error) {
            console.error("Erro ao inserir produto:", error);
            return res.status(500).send({ msg: "Erro ao inserir produto" });
        }

        console.log("Produto inserido com sucesso");
        return res.status(201).send(results);
    });
});

// Rota para listar todos os produtos
rotas.get("/listarProdutos", async (req, res) => {
    connection.query('SELECT * FROM PRODUTO', (err, result) => {
        res.send(result);
    });
});
rotas.get('/buscarImagem/:id', async (req, res) => {
    const { id } = req.params;

    try {
        connection.query('SELECT nomeImagem FROM ImagemProduto WHERE produtoId = ?', id, (err, result) => {
            if (err) {
                console.error('Erro ao buscar imagens:', err);
                res.status(500).json({ error: 'Falha ao buscar imagens' });
                return;
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        res.status(500).json({ error: 'Falha ao buscar imagens' });
    }
});

rotas.get("/buscarImagens", async (req, res) => {
    try {
        connection.query('SELECT * FROM ImagemProduto', (err, result) => {
            if (err) {
                console.error('Erro ao listar imagens:', err);
                res.status(500).json({ error: 'Falha ao listar imagens' });
                return;
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error('Erro ao listar imagens:', error);
        res.status(500).json({ error: 'Falha ao listar imagens' });
    }
});


// Rota PUT para editar um produto existente
rotas.put('/editarprodutos/:id', (req, res) => {
    const id = req.params.id;
    const { nomeProduto, avaliacao, descricao, preco, estoque } = req.body;
  
    const queryString = `UPDATE PRODUTO SET nomeProduto=?, avaliacao=?, descricao=?, preco=?, estoque=? WHERE id=?`;
    const values = [nomeProduto, avaliacao, descricao, preco, estoque, id];
  
    connection.query(queryString, values, (error, results) => {
        if (error) {
            console.error("Erro ao editar produto:", error);
            return res.status(500).send({ msg: "Erro ao editar produto" });
        }
  
        console.log("Produto editado com sucesso");
        return res.status(200).send({ msg: "Produto editado com sucesso" });
    });
  });
  
  rotas.put('/produto/:id/status', async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
  
      // Verificar se a situação fornecida é válida
      if (!status) {
          return res.status(400).json({ mensagem: "A situação não foi fornecida." });
      }
  
      // Atualizar a situação do usuário no banco de dados
      connection.query('UPDATE produto SET status = ? WHERE id = ?', [status, id], (error, results) => {
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
  
  
  rotas.get('/pescarproduto/:id', async(req, res)=>{
      const {id} = req.params;
      connection.query('SELECT * FROM produto WHERE id = ?', [id], (error, results) => {
          if (error) {
              console.error('Erro ao atualizar situação:', error);
              return res.status(500).json({ mensagem: 'Erro ao atualizar situação.' });
          }
          res.send(results);
      });
  })
  rotas.delete("/deletarImagem/:nomeImagem", async (req, res) => {
    const { nomeImagem } = req.params;

    try {
        // Verifica se a imagem existe no banco de dados
        connection.query('SELECT * FROM ImagemProduto WHERE nomeImagem = ?', nomeImagem, (err, result) => {
            if (err) {
                console.error('Erro ao buscar imagem:', err);
                res.status(500).json({ message: 'Erro ao buscar imagem' });
                return;
            }

            // Se não houver resultado, significa que a imagem não foi encontrada
            if (result.length === 0) {
                return res.status(404).json({ message: 'Imagem não encontrada' });
            }

            // Exclui a imagem do banco de dados
            connection.query('DELETE FROM ImagemProduto WHERE nomeImagem = ?', nomeImagem, (err, result) => {
                if (err) {
                    console.error('Erro ao deletar imagem:', err);
                    res.status(500).json({ message: 'Erro ao deletar imagem' });
                    return;
                }

                // Define o diretório onde a imagem está armazenada
                const diretorioImagens = path.join(__dirname, 'public');
                const caminhoImagem = path.join(diretorioImagens, nomeImagem);

                // Verifica se o arquivo existe antes de tentar excluí-lo
                if (fs.existsSync(caminhoImagem)) {
                    // Exclui o arquivo
                    fs.unlinkSync(caminhoImagem);
                }

                res.status(200).json({ message: 'Imagem deletada com sucesso' });
            });
        });
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        res.status(500).json({ message: 'Erro ao deletar imagem' });
    }
});

rotas.get('/buscarProduto/:id', async (req, res) => {
    const { id } = req.params;

    try {
        connection.query('SELECT * FROM Produto WHERE id = ?', id, (err, result) => {
            if (err) {
                console.error('Erro ao buscar produto:', err);
                res.status(500).json({ error: 'Falha ao buscar produto' });
                return;
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ error: 'Falha ao buscar produto' });
    }
});

module.exports = rotas;
