const express = require('express');
const multer = require('multer');
const fs = require('fs');
const rotas = express()

rotas.post("/upload",  function (req, res) {  
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, `${__dirname}/public`)
    },
    filename: function(req, flie, cb) {
      cb(null, Date.now() + ".jpg")
    }
  })
  const upload = multer({storage}).single("file");


  upload(req, res, function(err) {
    if (err instanceof multer.MulterError){
      return res.status(500).send(err)
    }
    else if(err){
      return res.status(500).send(err)
    }

    console.log(req.file.filename)

    return res.status(200).send({menssagen: "sucesso"})
  })
}
  )
module.exports = rotas;