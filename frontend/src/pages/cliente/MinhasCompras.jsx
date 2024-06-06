import React, { useState, useEffect } from 'react';
import { NavBar1 } from '../../componentes/navbar3/navbar1';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function MinhasCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const navegar = useNavigate();

  useEffect(() => {
    const cliente_id = localStorage.getItem('id');
    if (cliente_id) {
      axios.get(`http://localhost:3005/compras/${cliente_id}`)
        .then(response => {
          console.log('Compras encontradas:', response.data);
          setCompras(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar compras:', error);
          setLoading(false);
        });
    }
  }, []);

  return (
    <>
      <NavBar1 />
      <div>
        <h1>Minhas Compras</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          compras.length > 0 ? (
            <div>
              <h2>Minhas Compras</h2>
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
                  {compras.map(compra => (
                    <tr key={compra.id}>
                      <td>{compra.protocolo}</td>
                      <td>R${compra.total.toFixed(2)}</td>
                      <td>R${compra.frete.toFixed(2)}</td>
                      <td>R${(compra.total + compra.frete).toFixed(2)}</td>
                      <td>{compra.situacao}</td>
                      <td>
                        <button className="btn" onClick={() => navegar(`/Detalhe/${compra.id}`)}>Detalhe</button>
                      </td>
                    </tr>
                  ))}
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
