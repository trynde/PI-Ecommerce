import React, { useEffect, useState } from 'react';
import { NavBar } from "../../componentes/navbar/navbar";

export function StatusCompra() {
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const compraLocalStorage = JSON.parse(localStorage.getItem('compra'));
    if (compraLocalStorage) {
      setCompra(compraLocalStorage);
      console.log(compraLocalStorage);

      
    }
  }, []);
  

  return (
    <>
      <NavBar />
      <div>
        <h2>Detalhes da Compra</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {compra && (
              <tr>
                <td>{compra.protocolo}</td>
                <td>{compra.status || "Aguardando Pagamento"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
