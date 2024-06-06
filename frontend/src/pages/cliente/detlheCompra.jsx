import React, { useEffect, useState } from 'react';
import { NavBar1 } from '../../componentes/navbar3/navbar1';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export function DetalheCompra() {
  const { id } = useParams();
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/cartItems/${id}`);
        setCompra(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da compra:', error);
      }
    };

    fetchCompra();
  }, [id]);

  return (
    <>
      <NavBar1 />
      <div>
        <h2>Detalhes da Compra</h2>
        {compra ? (
          <>
            <p><strong>Data:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Forma de pagamento:</strong> {compra.formaPagamento}</p>
            <p><strong>Valor total:</strong> R$ {typeof compra.preco === 'number' ? compra.preco.toFixed(2) : 'N/A'}</p>
            <p><strong>Endereço de entrega:</strong> {compra.enderecoSelecionado}</p>
            <h3>Itens Comprados:</h3>
            <ul>
              {compra.itens.map((item, index) => (
                <li key={index}>{item.nomeProduto}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Não há detalhes disponíveis para exibir.</p>
        )}
      </div>
    </>
  );
}
