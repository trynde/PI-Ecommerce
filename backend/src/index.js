const express = require("express");
const cors = require("cors");
const path = require('path');

const usuarioRotas = require('./routes/usuario')
const produtoImagemRotas = require('./routes/produtoimagem')
const clienteRotas = require("./routes/cliente")
require("dotenv").config();

const app = express();
app.use(express.json());

const diretorioImagens = path.join(__dirname,'routes', 'public');
app.use('/images', express.static(diretorioImagens));
app.use(cors());
app.use(usuarioRotas)
app.use(produtoImagemRotas)
app.use(clienteRotas)
app.listen(3005, () => {
    console.log("Servidor rodando em http://localhost:3005/");
});
