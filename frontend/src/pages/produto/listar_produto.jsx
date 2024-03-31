import axios from "axios";
import "./listar_produto.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Button, FormControl, Modal, Table } from "react-bootstrap";
import { Search } from 'react-bootstrap-icons';
import { DatabaseFillAdd } from 'react-bootstrap-icons';
import { NavBar } from "../../componentes/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

export function Produto() {
    const navegar = useNavigate()
    const [produtos, setProdutos] = useState([])
    const [buscar, setBuscar] = useState('')
    const [busca, setBusca] = useState('')
    const [show, setShow] = useState(false);
    const [id, setId] = useState(null);
    const [status, setStatus] = useState(null);

    const handleClose = () => {
        setId(null);
        setShow(false)
    };

    const handleShow = (id, status) => {
        setId(id);
        setStatus(status)
        setShow(true)
    };

    useEffect(() => {
        listarProdutos();
    }, [])

    function listarProdutos() {
        axios.get("http://localhost:3005/listarProdutos").then((res) => {
            setProdutos(res.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const lowerCaseProdutos = buscar.toLowerCase()
    const buscarNome = produtos.filter(produto => produto.nomeProduto.toLowerCase().includes(lowerCaseProdutos))
    const buscarNomeOrdenado = buscarNome ? buscarNome.slice().reverse() : [];

    function alterarStatus(id, status) {
        if (status === 'ativo') {
            const trocarStatus = 'inativo'
            const objeto = {trocarStatus}
            axios.put(`http://localhost:3005/produto/${id}/status`, { status: trocarStatus }).then(res => {
                listarProdutos()
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
            handleClose();

        } else {
            const trocarStatus = 'ativo'
            const objeto = {trocarStatus}
            axios.put(`http://localhost:3005/produto/${id}/status`, { status: trocarStatus }).then(res => {
                listarProdutos()
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
            handleClose();
        }
    }

    return (
        <>
            <div className="cabeçalho">
                <NavBar></NavBar>
            </div>
            <div className="listarProduto">
                <div className="listar-produto-container">
                    <h1>Listar Produto</h1>
                    <div className="pesquisa">
                        <FormControl onChange={(evento) => { setBusca(evento.target.value) }} type="text" placeholder="Pesquisar produto" />
                        <button onClick={() => { setBuscar(busca) }} className="btn btn-dark"><Search /></button>
                        <button onClick={() => navegar('/CadastrarP')} className="btn btn-dark"><DatabaseFillAdd /></button>
                    </div>
                    {
                        produtos.length === 0 ?
                            <h1>Nenhum produto encontrado</h1>
                            :
                            <Table bsPrefix="table table-bordered table-striped table-hover align-middle text-center" className="tabela">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Avaliação</th>
                                        <th>Preço</th>
                                        <th>Estoque</th>
                                        <th>Status</th>
                                        <th>Editar</th>
                                        <th>Visualizar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        buscarNomeOrdenado.map(produto => (
                                            <tr key={produto.id}>
                                                <td>{produto.nomeProduto}</td>
                                                <td>{produto.avaliacao}</td>
                                                <td>{produto.preco}</td>
                                                <td>{produto.estoque}</td>
                                                <td>
                                                        {produto.status !== 'ativo' ? 
                                                        <button className="btn" style={{color:'red'}} onClick={() => handleShow(produto.id, produto.status)}>{produto.status}</button>
                                                         :
                                                        <button className="btn" style={{color:'green'}} onClick={() =>  handleShow(produto.id, produto.status)}>{produto.status}</button>
                                                    } 
                                                    </td>
                                                <td>
                                                    <button className="btn" onClick={() => navegar(`/EditarP/${produto.id}`)}>Editar</button>
                                                </td>
                                                <td>
                                                    <Link to={`/Visualizar/${produto.id}`} className="btn">Visualizar</Link>
                                                </td>
                                            </tr>
                                        ))
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
                <Modal.Body>Deseja editar o status?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => alterarStatus(id, status)}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
