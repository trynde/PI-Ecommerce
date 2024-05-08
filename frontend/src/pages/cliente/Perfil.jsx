import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { NavBar } from '../../componentes/navbar3/navbar';

export function Perfil() {
  const [cliente, setCliente] = useState(null);
  const { id } = useParams(); // Obtem o ID do cliente da rota

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/cliente/${id}`);
        setCliente(response.data);
      } catch (error) {
        console.error('Erro ao buscar informações do cliente:', error);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <>
    <NavBar></NavBar>
    <div className="profile">
      {cliente ? (
        <div>
          <h1>Perfil de {cliente.nome}</h1>
          <p><strong>Nome:</strong> {cliente.nome}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Idade:</strong> {cliente.idade}</p>
          {/* Adicione outras informações do usuário conforme necessário */}
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
    </>
  );
}
