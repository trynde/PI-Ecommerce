const express = require("express");
const rotas = express.Router();
const connection = require("../db/db")

/**
 * Retorna o carrinho atual do usuário, se não tiver nenhum cria um novo
 */
rotas.get("/carrinho", async (req, res) => {
  const { cliente_id } = req.body;
  if (!cliente_id) {
    res.status(400).json({
      "mensagem": "id do cliente não informado"
    })
    return
  }

  connection.query('SELECT * FROM carrinho WHERE cliente_id = ?', [cliente_id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar carrinho:', err);
      res.status(500).send('Erro ao buscar carrinho');
      return
    }

    if (result.length === 0) {
      connection.query('INSERT INTO carrinho (cliente_id) VALUES (?)', [cliente_id], (err, result) => {
        if (err) {
          console.error('Erro ao criar carrinho:', err);
          res.status(500).send('Erro ao criar carrinho');
          return
        }

        connection.query('SELECT * FROM carrinho WHERE cliente_id = ?', [cliente_id], (err, result) => {
          if (err) {
            console.error('Erro ao buscar carrinho:', err);
            res.status(500).send('Erro ao buscar carrinho');
            return
          }

          console.log({ result })
          res.send(result);
        })
      })
    } else {
      res.send(result);
    }
  })
})

/**
 * Lista todos os produtos do carrinho
 */
rotas.get("/carrinho/:id/produto", async (req, res) => { })

/**
 * Adiciona um produto ao carrinho
 */
rotas.post("/carrinho/:id/produto", async (req, res) => { })

/**
 * Remove um produto do carrinho
 */
rotas.delete("/carrinho/:id/produto/:produto_id", async (req, res) => { })


/**
 * Lista todas as compras do cliente
 */
rotas.get("/compra", async (req, res) => {
  const { cliente_id } = req.body;
  if (!cliente_id) {
    res.status(400).json({
      "mensagem": "id do cliente não informado"
    })
    return
  }

  connection.query('SELECT * FROM compra WHERE cliente_id = ?', (err, result) => {
    if (err) {
      console.error('Erro ao buscar compras:', err);
      res.status(500).send('Erro ao buscar compras');
      return
    }

    res.send(result);
  })
})

/**
 * Inicia uma nova compra
 */
rotas.post("/compra", async (req, res) => {
  const { cliente_id, carrinho_id } = req.body;
  if (!cliente_id || !carrinho_id) {
    console.log({ cliente_id, carrinho_id });
    res.status(400).json({
      "mensagem": "Dados da compra incompletos"
    })
    return
  }

  const status = "PAGAMENTO_PENDENTE"

  const query = 'INSERT INTO compra (cliente_id, carrinho_id, status) VALUES (?, ?, ?)';
  const values = [cliente_id, carrinho_id, status];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao adicionar compra:', err);
      res.status(500).send('Erro ao adicionar compra');
      return;
    }

    res.status(200).send()
  });
})

/**
 * Cancela uma compra
 */
rotas.delete("/compra/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      "mensagem": "ID da compra não informado"
    })
    return
  }

  connection.query('UPDATE compra SET status = "CANCELADA" WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao cancelar compra:', err);
      res.status(500).send('Erro ao cancelar compra');
      return
    }

    res.status(200).send()
  })
})

/**
 * Busca compra por ID
 */
rotas.get("/compra/:id", async (req, res) => {
  const { cliente_id } = req.body;
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      "mensagem": "ID da compra não informado"
    })
    return
  }

  connection.query('SELECT * FROM compra WHERE id = ? AND cliente_id = ?', [id, cliente_id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar compra:', err);
      res.status(500).send('Erro ao buscar compra');
      return
    }

    res.status(200).send(result);
  })
})


/**
 * Atualiza dados da compra
 * - adiciona entregador recebido no body
 * - adiciona endereço de entrega
 * - adiciona forma de pagamento pelo id
 * - finaliza compra se todos os dados estiverem preenchidos
 */
rotas.put("/compra/:id", async (req, res) => {
  const { id } = req.params;
  const { entregador, endereco, forma_pagamento_id } = req.body;
  if (!id || !entregador || !endereco || !forma_pagamento_id) {
    console.log({ id, entregador, endereco, forma_pagamento_id });
    res.status(400).json({
      "mensagem": "Dados da compra incompletos"
    })
    return
  }

  connection.query('UPDATE compra SET entregador = ?, endereco = ?, forma_pagamento_id = ? WHERE id = ?', [entregador, endereco, forma_pagamento_id, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar compra:', err);
      res.status(500).send('Erro ao atualizar compra');
      return
    }

    connection.query('SELECT * FROM compra WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Erro ao buscar compra:', err);
        res.status(500).send('Erro ao buscar compra');
        return
      }

      // Finaliza compra se todos os dados estiverem preenchidos com sucesso
      const compra = result[0]
      if (compra.entregador_id && compra.endereco_id && compra.forma_pagamento_id) {
        connection.query('UPDATE compra SET status = "FINALIZADA" WHERE id = ?', [id], (err, result) => {
          if (err) {
            console.error('Erro ao finalizar compra:', err);
            res.status(500).send('Erro ao finalizar compra');
            return
          }
        })
      }

      res.status(200).json({ "mensagem": "Compra realizada com sucesso" }).send()
    })
  })

})

/**
 * [Backoffice]
 * Lista todas as compras de todos os clientes
 */
rotas.get("/backoffice/compra", async (req, res) => {
  connection.query('SELECT * FROM compra', (err, result) => {
    if (err) {
      console.error('Erro ao buscar compras:', err);
      res.status(500).send('Erro ao buscar compras');
      return
    }

    res.send(result);
  })
})

/**
 * [Backoffice]
 * Busca compra por ID
 * essa rota é importante pro usuário e o admin não terem acesso as mesmas informações!
 */
rotas.get("/backoffice/compra/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      "mensagem": "ID da compra não informado"
    })
    return
  }

  connection.query('SELECT * FROM compra WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar compra:', err);
      res.status(500).send('Erro ao buscar compra');
      return
    }

    res.status(200).send(result);
  })
})

/**
 * [Backoffice]
 * Atualiza stats de uma compra
 * 
 * @param {string} status - status da compra
 * - PAGAMENTO_PENDENTE
 * - PAGAMENTO_CONFIRMADO
 * - EM_TRANSPORTE
 * - ENTREGUE
 * - CANCELADA
 * - FINALIZADA
 * @param {string} id - id da compra
 * @returns {json} - mensagem de sucesso ou erro
 */
rotas.put("/backoffice/compra/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id || !status) {
    res.status(400).json({
      "mensagem": "Dados da compra incompletos"
    })
    return
  }

  const statusValidos = ["PAGAMENTO_PENDENTE", "PAGAMENTO_CONFIRMADO", "EM_TRANSPORTE", "ENTREGUE", "CANCELADA", "FINALIZADA"]
  if (!statusValidos.includes(status)) {
    res.status(400).json({
      "mensagem": `Status ${status} é inválido`
    })
    return
  }

  connection.query('UPDATE compra SET status = ? WHERE id = ?', [status, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar compra:', err);
      res.status(500).send('Erro ao atualizar compra');
      return
    }

    res.status(200).send()
  })
})

module.exports = rotas