import React, { useState, useEffect } from 'react';
import { NavBar1 } from '../../componentes/navbar3/navbar1';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function MinhasCompras() {
  const [compra, setCompra] = useState(null);
  const [loading, setLoading] = useState(false); // Adicionamos um estado para indicar que a solicitação está em andamento
  const navegar = useNavigate();

  useEffect(() => {
    const compraLocalStorage = JSON.parse(localStorage.getItem('compra'));
    if (compraLocalStorage) {
      setCompra(compraLocalStorage);
      console.log(compraLocalStorage);

      // Enviar dados para o backend apenas se não estiver carregando
      if (!loading) {
        setLoading(true); // Definimos o estado como true para indicar que a solicitação está em andamento
        axios.post('http://localhost:3005/api/saveCompra', { compra: compraLocalStorage })
          .then(response => {
            console.log('Compra salva com sucesso:', response.data);
            setLoading(false); // Definimos o estado como false para indicar que a solicitação foi concluída
          })
          .catch(error => {
            console.error('Erro ao salvar a compra:', error);
            setLoading(false); // Definimos o estado como false em caso de erro
          });
      }
    }
  }, [loading]); // Adicionamos 'loading' como uma dependência para que este useEffect seja chamado sempre que 'loading' mudar

  return (
    <>
      <NavBar1 />
      <div>
        <h1>Minhas Compras</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          compra ? (
            <div>
              <h2>Detalhes da Compra</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Protocolo</th>
                    <th>Total dos Produtos</th>
                    <th>Frete</th>
                    <th>Total Pago</th>
                    <th>Status</th>
                    <th>Detalhe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{compra.protocolo}</td>
                    <td>R${compra.total.toFixed(2)}</td>
                    <td>R${compra.frete.toFixed(2)}</td>
                    <td>R${(compra.total + compra.frete).toFixed(2)}</td>
                    <td>{compra.status || "Aguardando Pagamento"}</td>
                    <td><button className="btn" onClick={() => navegar("/Detalhe")}>Detalhe</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>Nenhuma compra encontrada.</p>
          )
        )}
      </div>
    </>
  );
}
