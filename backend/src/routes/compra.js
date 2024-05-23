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

  connection.query('SELECT * FROM carrinho WHERE cliente_id = ? AND status = "OPEN" LIMIT 1', [cliente_id], (err, result) => {
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

        const idCarrinho = result.insertId
        connection.query('SELECT * FROM carrinho WHERE id = ?', [idCarrinho], (err, result) => {
          if (err) {
            console.error('Erro ao buscar carrinho:', err);
            res.status(500).send('Erro ao buscar carrinho');
            return
          }

          const carrinho = result[0]
          console.log({ carrinho });
          res.send(carrinho);
        })
      })
    } else {
      res.send(result[0]);
    }
  })
})

/**
 * Lista todos os produtos do carrinho
 */
rotas.get("/carrinho/:id/produto", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      "mensagem": "ID do carrinho não informado"
    })
    return
  }

  connection.query('SELECT * FROM carrinho_produtos WHERE carrinho_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar produtos do carrinho:', err);
      res.status(500).send('Erro ao buscar produtos do carrinho');
      return
    }

    res.send(result);
  })
})

/**
 * Adiciona um produto ao carrinho
 */
rotas.post("/carrinho/:id/produto", async (req, res) => {
  const { id } = req.params;
  const { produto_id, quantidade } = req.body;
  if (!id || !produto_id || !quantidade) {
    res.status(400).json({
      "mensagem": "Dados do produto incompletos"
    })
    return
  }

  // verifica se o produto já está no carrinho
  connection.query('SELECT * FROM carrinho_produtos WHERE carrinho_id = ? AND produto_id = ?', [id, produto_id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar produtos do carrinho:', err);
      res.status(500).send('Erro ao buscar produtos do carrinho');
      return
    }

    if (result.length > 0) {
      const novaQuantidade = Number(result[0].quantidade) + Number(quantidade)

      connection.query('UPDATE carrinho_produtos SET quantidade = ? WHERE carrinho_id = ? AND produto_id = ?', [novaQuantidade, id, produto_id], (err, result) => {
        if (err) {
          console.error('Erro ao atualizar quantidade do produto no carrinho:', err);
          res.status(500).send('Erro ao atualizar quantidade do produto no carrinho');
          return
        }
      })

    } else {
      // adiciona o produto ao carrinho
      connection.query('INSERT INTO carrinho_produtos (carrinho_id, produto_id, quantidade) VALUES (?, ?, ?)', [id, produto_id, quantidade], (err, result) => {
        if (err) {
          console.error('Erro ao adicionar produto ao carrinho:', err);
          res.status(500).send('Erro ao adicionar produto ao carrinho');
          return
        }
      })
    }
  })

  res.status(200).send()
})

/**
 * Remove um produto do carrinho ou reduz a quantidade
 */
rotas.delete("/carrinho/:id/produto", async (req, res) => {
  const { produto_id, quantidade } = req.body;
  const { id } = req.params;
  if (!id || !produto_id) {
    res.status(400).json({
      "mensagem": "ID do carrinho ou ID do produto não informado"
    })
    return
  }

  connection.query('SELECT * FROM carrinho_produtos WHERE carrinho_id = ? AND produto_id = ?', [id, produto_id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar produtos do carrinho:', err);
      res.status(500).send('Erro ao buscar produtos do carrinho');
      return
    }

    if (result.length > 0) {
      const novaQuantidade = result[0].quantidade - quantidade
      if (novaQuantidade > 0) {
        connection.query('UPDATE carrinho_produtos SET quantidade = ? WHERE carrinho_id = ? AND produto_id = ?', [novaQuantidade, id, produto_id], (err, result) => {
          if (err) {
            console.error('Erro ao atualizar quantidade do produto no carrinho:', err);
            res.status(500).send('Erro ao atualizar quantidade do produto no carrinho');
            return
          }
        })
      } else {
        connection.query('DELETE FROM carrinho_produtos WHERE carrinho_id = ? AND produto_id = ?', [id, produto_id], (err, result) => {
          if (err) {
            console.error('Erro ao remover produto do carrinho:', err);
            res.status(500).send('Erro ao remover produto do carrinho');
            return
          }
        })
      }
    }
  })

  res.status(200).send()
})

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

  connection.query('SELECT * FROM compra WHERE cliente_id = ?', [cliente_id], (err, result) => {
    if (err) {
      console.error('Erro ao buscar compras:', err);
      res.status(500).send('Erro ao buscar compras');
      return
    }

    res.send(result);
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

    if (result.length === 0) {
      res.status(404).json({
        "mensagem": "Compra não encontrada"
      })
      return
    }

    res.status(200).send(result[0]);
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

  // Verifica se a compra já foi iniciada para o carrinho informado
  connection.query('SELECT * FROM compra WHERE cliente_id = ? AND carrinho_id = ?', [cliente_id, carrinho_id], (err, result) => {
    if (result.length > 0) {
      res.status(200).json(result[0])
      return
    }

    const query = 'INSERT INTO compra (cliente_id, carrinho_id) VALUES (?, ?)';
    const values = [cliente_id, carrinho_id];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Erro ao adicionar compra:', err);
        res.status(500).send('Erro ao adicionar compra');
        return;
      }

      // busca a compra criada
      connection.query('SELECT * FROM compra WHERE id = ?', [result.insertId], (err, result) => {
        if (err) {
          console.error('Erro ao buscar compra:', err);
          res.status(500).send('Erro ao buscar compra');
          return
        }

        if (result.length === 0) {
          res.status(404).json({
            "mensagem": "Compra não encontrada"
          })
          return
        }

        res.status(200).send(result[0]);
      })
    });
  })
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
 * Atualiza dados da compra
 * - adiciona entregador recebido no body
 * - adiciona endereço de entrega
 * - adiciona forma de pagamento pelo id
 * - finaliza compra se todos os dados estiverem preenchidos
 */
rotas.put("/compra/:id", async (req, res) => {
  const { id } = req.params;
  const { entregador, endereco, pagamento } = req.body;
  if (!id || !entregador || !endereco || !pagamento) {
    console.log({ id, entregador, endereco, pagamento });
    res.status(400).json({
      "mensagem": "Dados da compra incompletos"
    })
    return
  }

  // TODO: aqui da pra fazer um select na tabela de carrinho pra pegar o valor_total
  const parcelas = pagamento.parcelas || false
  const valor_parcelas = pagamento.valor_parcelas || false
  const valor_total = pagamento.valor_total || false
  const tipo = pagamento.tipo || false
  if (!parcelas || !valor_parcelas || !valor_total || !tipo) {
    console.log({ parcelas, valor_parcelas, valor_total, tipo });
    res.status(400).json({
      "mensagem": "Dados da forma de pagamento incompletos"
    })
    return
  }

  const query = 'UPDATE compra SET entregador = ?, endereco = ?, parcelas = ?, valor_parcelas = ?, valor_total = ?, tipo_pagamento = ? WHERE id = ?';
  const values = [entregador, endereco, parcelas, valor_parcelas, valor_total, tipo, id];

  connection.query(query, values, (err, result) => {
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

      // Finaliza compra
      const carrinhoId = result[0]?.carrinho_id
      connection.query('UPDATE compra SET status = "AGUARDANDO_PAGAMENTO" WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error('Erro ao finalizar compra:', err);
          res.status(500).send('Erro ao finalizar compra');
          return
        }

        const idCarrinho = carrinhoId
        if (!idCarrinho) {
          console.log("id do carrinho não foi encontrado na compra");
          res.status(500).send('Erro ao finalizar compra');
          return
        }

        connection.query('UPDATE carrinho SET status = "DONE" WHERE id = ?', [idCarrinho], (err, result) => {
          if (err) {
            console.error('Erro ao finalizar compra:', err);
            res.status(500).send('Erro ao finalizar compra');
            return
          }

          // Pega dados atualizados da compra
          connection.query('SELECT * FROM compra WHERE id = ?', [id], (err, result) => {
            if (err) {
              console.error('Erro ao buscar compra:', err);
              res.status(500).send('Erro ao buscar compra');
              return
            }

            res.status(200).send(result[0]);
          })
        })
      })
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

    res.status(200).send(result[0]);
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

  const statusValidos = ['AGUARDANDO_PAGAMENTO', 'PAGO_COM_SUCESSO', 'PAGAMENTO_REJEITADO', 'AGUARDANDO_RETIRADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA', 'FINALIZADA']
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

rotas.put("/compra/:id", async (req, res) => {
  const { id } = req.params;
  const { entregador, endereco, pagamento } = req.body;
  if (!id || !entregador || !endereco || !pagamento) {
    console.log({ id, entregador, endereco, pagamento });
    res.status(400).json({
      "mensagem": "Dados da compra incompletos"
    })
    return
  }

  // TODO: aqui da pra fazer um select na tabela de carrinho pra pegar o valor_total
  const parcelas = pagamento.parcelas || false
  const valor_parcelas = pagamento.valor_parcelas || false
  const valor_total = pagamento.valor_total || false
  const tipo = pagamento.tipo || false
  if (!parcelas || !valor_parcelas || !valor_total || !tipo) {
    console.log({ parcelas, valor_parcelas, valor_total, tipo });
    res.status(400).json({
      "mensagem": "Dados da forma de pagamento incompletos"
    })
    return
  }

  const query = 'UPDATE compra SET entregador = ?, endereco = ?, parcelas = ?, valor_parcelas = ?, valor_total = ?, tipo_pagamento = ? WHERE id = ?';
  const values = [entregador, endereco, parcelas, valor_parcelas, valor_total, tipo, id];

  connection.query(query, values, (err, result) => {
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

      // Finaliza compra
      const carrinhoId = result[0]?.carrinho_id
      connection.query('UPDATE compra SET status = "AGUARDANDO_PAGAMENTO" WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error('Erro ao finalizar compra:', err);
          res.status(500).send('Erro ao finalizar compra');
          return
        }

        const idCarrinho = carrinhoId
        if (!idCarrinho) {
          console.log("id do carrinho não foi encontrado na compra");
          res.status(500).send('Erro ao finalizar compra');
          return
        }

        connection.query('UPDATE carrinho SET status = "DONE" WHERE id = ?', [idCarrinho], (err, result) => {
          if (err) {
            console.error('Erro ao finalizar compra:', err);
            res.status(500).send('Erro ao finalizar compra');
            return
          }

          // Pega dados atualizados da compra
          connection.query('SELECT * FROM compra WHERE id = ?', [id], (err, result) => {
            if (err) {
              console.error('Erro ao buscar compra:', err);
              res.status(500).send('Erro ao buscar compra');
              return
            }

            res.status(200).send(result[0]);
          })
        })
      })
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

    res.status(200).send(result[0]);
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

  const statusValidos = ['AGUARDANDO_PAGAMENTO', 'PAGO_COM_SUCESSO', 'PAGAMENTO_REJEITADO', 'AGUARDANDO_RETIRADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA', 'FINALIZADA']
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