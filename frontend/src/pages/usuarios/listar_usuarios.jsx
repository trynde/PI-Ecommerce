import axios from "axios";
import "./listar_usuarios.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Button, FormControl, Modal, Table } from "react-bootstrap";
import { Search } from 'react-bootstrap-icons';
import { DatabaseFillAdd } from 'react-bootstrap-icons';
import { NavBar } from "../../componentes/navbar/navbar";
import { useNavigate } from "react-router-dom";

export function Usuarios() {
    const navegar = useNavigate()
    const [usuarios, setUsuarios] = useState(null)
    const [buscar, setBuscar] = useState('')
    const [busca, setBusca] = useState('')
    const [show, setShow] = useState(false);
    const [id, setId] = useState(null);
    const [situacao, setSituacao] = useState(null);

    const handleClose = () => {
        setId(null);
        setId(null);
        setShow(false)
    };

    const handleShow = (id, situacao) => {
        setId(id);
        setSituacao(situacao)
        setShow(true)
    };
    function alterarSituacao(id, mudarSituacao) {
        if (mudarSituacao === 'ativo') {
            const trocarSituacao = 'inativo'
            const objeto = {trocarSituacao}
            axios.put(`http://localhost:3005/usuarios/${id}/situacao`, { situacao: trocarSituacao }).then(res => {
                listarUsuario()
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
            handleClose();

        } else {
            const trocarSituacao = 'ativo'
            const objeto = {trocarSituacao}
            axios.put(`http://localhost:3005/usuarios/${id}/situacao`, { situacao: trocarSituacao }).then(res => {
                listarUsuario()
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
            handleClose();
        }
    }

    useEffect(() => {
        listarUsuario();
    }, [])
    function listarUsuario() {
        axios.get("http://localhost:3005/").then((res) => {
            setUsuarios(res.data);
            console.log(res.data);
        }).catch((error) => {
            console.log(error);
        })
    }
    const lowerCaseUsuarios = buscar.toLowerCase()
    const buscarNome = usuarios?.filter((usuario => usuario.nome.toLowerCase().includes(lowerCaseUsuarios)))
    return (
        <>
            <div className="cabeçalho">
                <NavBar></NavBar>
            </div>
            <div className="listarUsuario">
                <div className="listar-usuarios-container">
                    <h1>Listar Usuários</h1>
                    <div className="pesquisa">
                        <FormControl onChange={(evento) => { setBusca(evento.target.value) }} type="text" placeholder="Pesquisar usuário" />
                        <button onClick={() => { setBuscar(busca) }} className="btn btn-dark"><Search /></button>
                        <button onClick={() => navegar('/Cadastrar')} className="btn btn-dark"><DatabaseFillAdd /></button>
                    </div>
                    {
                        usuarios === null ?
                            <h1>Listando tabela</h1>
                            :
                            <Table bsPrefix="table table-bordered table-striped table-hover align-middle text-center" className="tabela">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>Grupo</th>
                                        <th>Situação</th>
                                        <th>Editar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        buscarNome.map(usuario => {
                                            return (
                                                <tr>
                                                    <td>{usuario.nome}</td>
                                                    <td>{usuario.email}</td>
                                                    <td>{usuario.grupo}</td>
                                                    <td>
                                                        {usuario.situacao !== 'ativo' ? 
                                                        <button className="btn" style={{color:'red'}} onClick={() => handleShow(usuario.id, usuario.situacao)}>{usuario.situacao}</button>
                                                         :
                                                        <button className="btn" style={{color:'green'}} onClick={() => handleShow(usuario.id, usuario.situacao)}>{usuario.situacao}</button>
                                                    } 
                                                    </td>
                                                    <td>Editar</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                    }
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deseja editar a situação?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => alterarSituacao(id, situacao)}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
