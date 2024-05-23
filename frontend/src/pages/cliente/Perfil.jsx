import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '../../componentes/navbar3/navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function Perfil() {
  const navegar = useNavigate();
  const { id } = useParams(); // Obtém o ID do cliente da rota
  const [cliente, setCliente] = useState();
  const [enderecos, setEnderecos] = useState([]);
  const [show, setShow] = useState(false);
  const [enderecoId, setEnderecoId] = useState(null);
  const [situacao, setSituacao] = useState('');

  useEffect(() => {
    // Função para buscar as informações do cliente do servidor
    const fetchClienteInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/BuscarClientes/${id}`);
        if (response.status === 200) {
          console.log(response.data);
          setCliente(response.data);
        } else {
          console.error("Erro ao buscar informações do cliente:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar informações do cliente:", error.message);
      }
    };

    // Função para buscar os endereços alternativos do cliente
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

    fetchClienteInfo(); // Chama a função de busca de informações do cliente ao montar o componente
    fetchEnderecos();   // Chama a função de busca dos endereços do cliente ao montar o componente
  }, [id]);

  const handleClose = () => {
    setEnderecoId(null);
    setSituacao(null);
    setShow(false);
  };

  const handleShow = (id, situacao) => {
    setEnderecoId(id);
    setSituacao(situacao);
    setShow(true);
  };

  const inativarEndereco = (id) => {
    const novaSituacao = 'inativo';
    axios.put(`http://localhost:3005/endereco/${id}/situacao`, { situacao: novaSituacao })
      .then(res => {
        // Atualizar a lista de endereços
        setEnderecos(enderecos.map(endereco => 
          endereco.id === id ? { ...endereco, situacao: novaSituacao } : endereco
        ));
        handleClose();
      })
      .catch(err => {
        console.error("Erro ao inativar endereço:", err);
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
            
            {/* Tabela de Endereços Alternativos */}
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {enderecos.map((endereco) => (
                  <tr key={endereco.id}>
                    <td>{endereco.endereco}</td>
                    <td>{endereco.numero}</td>
                    <td>{endereco.bairro}</td>
                    <td>{endereco.cidade}</td>
                    <td>{endereco.estado}</td>
                    <td>{endereco.tipo}</td>
                    <td>{endereco.situacao}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => inativarEndereco(endereco.id)}
                      >
                        Inativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </div>

      {/* Modal para confirmação de inativação de endereço */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja inativar o endereço?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => inativarEndereco(enderecoId)}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
