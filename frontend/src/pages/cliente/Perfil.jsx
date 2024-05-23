import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '../../componentes/navbar3/navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function Perfil() {
  const navegar = useNavigate();
  const { id } = useParams();
  const [cliente, setCliente] = useState();
  const [enderecos, setEnderecos] = useState([]);
  const [show, setShow] = useState(false);
  const [enderecoId, setEnderecoId] = useState(null);
  const [situacao, setSituacao] = useState('');

  useEffect(() => {
    const fetchClienteInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/BuscarClientes/${id}`);
        if (response.status === 200) {
          setCliente(response.data);
        } else {
          console.error("Erro ao buscar informações do cliente:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar informações do cliente:", error.message);
      }
    };

    const fetchEnderecos = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/enderecos/${id}`);
        if (response.status === 200) {
          setEnderecos(response.data);
        } else {
          console.error("Erro ao buscar endereços do cliente:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar endereços do cliente:", error.message);
      }
    };

    fetchClienteInfo();
    fetchEnderecos();
  }, [id]);

  const handleToggleSituacao = (id, situacao) => {
    if (situacao === 'ativo') {
      inativarEndereco(id);
    } else if (situacao === 'inativo') {
      ativarEndereco(id);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const inativarEndereco = (id) => {
    const novaSituacao = 'inativo';
    axios.put(`http://localhost:3005/endereco/${id}/situacao`, { situacao: novaSituacao })
      .then(res => {
        setEnderecos(enderecos.map(endereco =>
          endereco.id === id ? { ...endereco, situacao: novaSituacao } : endereco
        ));
        handleClose();
      })
      .catch(err => {
        console.error("Erro ao inativar endereço:", err);
      });
  };

  const ativarEndereco = (id) => {
    const novaSituacao = 'ativo';
    axios.put(`http://localhost:3005/endereco/${id}/situacao`, { situacao: novaSituacao })
      .then(res => {
        setEnderecos(enderecos.map(endereco =>
          endereco.id === id ? { ...endereco, situacao: novaSituacao } : endereco
        ));
        handleClose();
      })
      .catch(err => {
        console.error("Erro ao ativar endereço:", err);
      });
  };

  return (
    <>
      <NavBar />
      <div className="profile">
        {cliente ? (
          <div className='info'>
            <h1 className='mt-3 mb-3 text-center'>Perfil</h1>
            <p><b>Nome: </b>{cliente.nome}</p>
            <p><b>Gênero: </b>{cliente.genero}</p>
            <p><b>Email: </b>{cliente.email}</p>
            <p><b>Endereço: </b>{cliente.endereco}</p>
            <p><b>Cidade: </b>{cliente.cidade}</p>
            <button onClick={() => navegar(`/EditarCliente/${id}`)} className="btn btn-dark">Editar</button>
            <br />
            <br />
            <button onClick={() => navegar(`/NovoEnd/${id}`)} className="btn btn-dark">Adicionar endereço</button>
            
            <h2 className='mt-4'>Endereços Alternativos</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Endereço</th>
                  <th>Número</th>
                  <th>Bairro</th>
                  <th>Cidade</th>
                  <th>Estado</th>
                  <th>Tipo</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {enderecos.map((endereco) => (
                  <tr key={endereco.id} onClick={() => handleToggleSituacao(endereco.id, endereco.situacao)}>
                    <td>{endereco.endereco}</td>
                    <td>{endereco.numero}</td>
                    <td>{endereco.bairro}</td>
                    <td>{endereco.cidade}</td>
                    <td>{endereco.estado}</td>
                    <td>{endereco.tipo}</td>
                    <td className={endereco.situacao === 'ativo' ? 'text-success' : 'text-danger'}>{endereco.situacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </>
  );
}
