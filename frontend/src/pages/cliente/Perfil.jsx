import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { NavBar } from '../../componentes/navbar3/navbar';
import { useNavigate } from "react-router-dom";

export function Perfil() {
  const navegar = useNavigate()
  const { id } = useParams(); // Obtem o ID do cliente da rota
  const [cliente, setCliente] = useState();

  useEffect(() => {
    // Função para buscar as informações do produto do servidor
    const fetchClienteInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/BuscarClientes/${id}`
        );
        // Verifica se a resposta é bem-sucedida (status 200)
        if (response.status === 200) {
          console.log(response.data)

          setCliente(response.data);
        } else {
          console.error(
            "Erro ao buscar informações do cliente:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Erro ao buscar informações do cliente:", error.message);
      }
    };

    fetchClienteInfo(); // Chama a função de busca de informações do produto ao montar o componente
  }, []);

  
  return (
    <>
    <NavBar></NavBar>
    <div className="profile">
      
      {cliente ? (
        
        <div className='info'>
          <h1 className='mt-3 mb-3 text-center'>Perfil de {cliente.nome}</h1>
          <p><b>Genero: </b>{cliente.genero}</p>
          <p><b>Email: </b>{cliente.email}</p>
          <p><b>Endereço: </b>{cliente.endereco}</p>
          <p><b>Cidade: </b>{cliente.cidade}</p>
          <button onClick={() => navegar(`/EditarCliente/${id}`)} className="btn btn-dark">Editar</button>
          <br/>
          <br/>
          <button onClick={() => navegar(`/NovoEnd/${id}`)} className="btn btn-dark">Adicionar um novo Endereço</button>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
    </>
  );
}
