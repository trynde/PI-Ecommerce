import React, { useEffect, useState } from "react";
import { NavBar1 } from "../../componentes/navbar3/navbar1";

export function DetalheCompra() {
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const detalhesCompra = JSON.parse(localStorage.getItem("detalhesCompra"));
    setCompra(detalhesCompra);
  }, []);

  return (
    <>
      <NavBar1 />
      <div>
        <h2>Detalhes da Compra</h2>
        {compra ? (
          <>
            <p>
              <strong>Data:</strong> {new Date().toLocaleDateString()}
            </p>
            <p>
              <strong>Forma de pagamento:</strong> {compra.formaPagamento}
            </p>
            <p>
              <strong>Valor total:</strong> R$ {compra.total}
            </p>
            <p>
              <strong>Endereço de entrega:</strong> {compra.endereco_id}
            </p>
            <h3>Itens Comprados:</h3>
            {compra &&
            compra.nomesProdutos &&
            compra.nomesProdutos.length > 0 ? (
              <ul>
                {compra.nomesProdutos.map((nomeProduto, index) => (
                  <li key={index}>{nomeProduto}</li>
                ))}
              </ul>
            ) : (
              <p>Não há itens disponíveis para exibir.</p>
            )}
          </>
        ) : (
          <p>Não há detalhes disponíveis para exibir.</p>
        )}
      </div>
    </>
  );
}
