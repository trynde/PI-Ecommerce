const express = require('express');
const multer = require('multer');
const axios = require('axios');
const rotas = express();
const connection = require("../db/db");

rotas.use(express.json());

rotas.get("/produto", async (req,res) => {
  connection.query('SELECT * FROM produto', (err, result) =>  {
      res.send(result);
  })
})

// Rota para upload de imagem
rotas.post("/upload/:id", function (req, res) {
    const { id } = req.params;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `${__dirname}/public`);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + ".jpg");
        }
    });
    const upload = multer({ storage }).single("file");

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).send(err);
        } else if (err) {
            return res.status(500).send(err);
        }

        console.log(req.file.filename);

        const fileName = req.file.filename;

        const queryString = `INSERT INTO IMAGEMPRODUTO (produtoId, nomeImagem) VALUES (?, ?)`;
        const values = [id, fileName];

        connection.query(queryString, values, (error, results) => {
            if (error) {
                console.error("Erro ao inserir imagem:", error);
                return res.status(500).send({ msg: "Erro ao inserir imagem" });
            }

            console.log("Imagem inserida com sucesso");
            return res.status(200).send({ msg: "Imagem enviada com sucesso" });
        });
    });
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
        return res.status(201).send({ msg: "Produto adicionado com sucesso" });
    });
});

// Rota para listar todos os produtos
rotas.get("/listarProdutos", async (req, res) => {
    connection.query('SELECT * FROM PRODUTO', (err, result) => {
        res.send(result);
    });
});

// Rota PUT para editar um produto existente
rotas.put('/editarprodutos/:id', (req, res) => {
  const id = req.params.id;
  const { nomeProduto, avaliacao, descricao, preco, estoque, status } = req.body;

  const queryString = `UPDATE PRODUTO SET nomeProduto=?, avaliacao=?, descricao=?, preco=?, estoque=?, status=? WHERE id=?`;
  const values = [nomeProduto, avaliacao, descricao, preco, estoque, status, id];

  connection.query(queryString, values, (error, results) => {
      if (error) {
          console.error("Erro ao editar produto:", error);
          return res.status(500).send({ msg: "Erro ao editar produto" });
      }

      console.log("Produto editado com sucesso");
      return res.status(200).send({ msg: "Produto editado com sucesso" });
  });
});


module.exports = rotas;
