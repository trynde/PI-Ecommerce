const express = require("express");
const cors = require("cors");
const usuarioRotas = require('./routes/usuario')
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());
app.use(usuarioRotas)
app.listen(3005, () => {
    console.log("Servidor rodando em http://localhost:3005/");
});
