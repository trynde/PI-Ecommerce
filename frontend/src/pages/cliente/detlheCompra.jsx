import React, { useEffect, useState } from 'react';
import { NavBar1 } from '../../componentes/navbar3/navbar1';

export function DetalheCompra() {
  const [compra, setCompra] = useState(null);
  

  useEffect(() => {
    // Recupera os dados armazenados no localStorage
    const compraLocalStorage = localStorage.getItem('compra');
    if (compraLocalStorage) {
      const compraData = JSON.parse(compraLocalStorage);
      setCompra(compraData);
      console.log(compraLocalStorage)
    }
  }, []);

  return (
    <>
      <NavBar1 />
      <div>
        <h2>Detalhes da Compra</h2>
        {compra ? (
          <>
            <p><strong>Protocolo da compra:</strong> {compra.protocolo}</p>
            <p><strong>Data:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Forma de pagamento:</strong> {compra.formaPagamento}</p>
            <p><strong>Valor total:</strong> R$ {compra.total.toFixed(2)}</p>
            <p><strong>Endereço de entrega:</strong> {compra.enderecoSelecionado}</p>
            <h3>Itens Comprados:</h3>
            <ul>
              {compra.nomesProdutos.map((produto, index) => (
                <li key={index}>{produto}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Não há detalhes disponíveis para exibir.</p>
        )}
      </div>
    </>
  );
};
