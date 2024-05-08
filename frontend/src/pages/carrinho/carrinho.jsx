import React, { useState } from 'react';

export function Carrinho() {
  const [carrinho, setCarrinho] = useState([]);
  const [frete, setFrete] = useState(10);

  // Função para adicionar um item ao carrinho
  const adicionarItem = (produto) => {
    const novoCarrinho = [...carrinho];
    const itemExistente = novoCarrinho.find((item) => item.nome === produto.nome);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      novoCarrinho.push({ ...produto, quantidade: 1 });
    }

    setCarrinho(novoCarrinho);
  };

  // Função para remover um item do carrinho
  const removerItem = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
  };

  // Função para calcular o preço total do carrinho
  const calcularTotal = () => {
    let total = 0;
    carrinho.forEach((item) => {
      total += item.preco * item.quantidade;
    });
    return total + frete;
  };

  // Função para selecionar o tipo de frete
  const selecionarFrete = (valor) => {
    setFrete(valor);
  };

  return (
    <div>
      <h2>Carrinho</h2>
      {carrinho.map((item, index) => (
        <div key={index}>
          <p>{item.nome} - R${item.preco.toFixed(2)}</p>
          <button onClick={() => adicionarItem(item)}>Adicionar</button>
          <button onClick={() => removerItem(index)}>Remover</button>
          <span>Quantidade: {item.quantidade}</span>
        </div>
      ))}
      <h3>Frete:</h3>
      <div>
        <button onClick={() => selecionarFrete(10)}>R$10</button>
        <button onClick={() => selecionarFrete(15)}>R$15</button>
        <button onClick={() => selecionarFrete(20)}>R$20</button>
      </div>
      <h3>Total: R${calcularTotal().toFixed(2)}</h3>
    </div>
  );
}

