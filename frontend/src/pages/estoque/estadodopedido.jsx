import React, { useEffect, useState } from 'react';
import { NavBar } from "../../componentes/navbar/navbar";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export function StatusCompra() {
  const [compras, setCompras] = useState([]);
  const navegar = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3005/compras')
      .then(response => {
        console.log('Compras encontradas:', response.data);
        setCompras(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar compras:', error);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div>
        <h2>Detalhes das Compras</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>Status</th>
              <th>Alterar Status</th>
            </tr>
          </thead>
          <tbody>
            {compras.map(compra => (
              <tr key={compra.protocolo}>
                <td>{compra.protocolo}</td>
                <td>{compra.situacao}</td>
                <td><button className="btn" onClick={() => navegar("/AlterarComrpa")}>Alterar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
