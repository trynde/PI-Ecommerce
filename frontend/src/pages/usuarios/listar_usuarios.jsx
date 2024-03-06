import axios from "axios";
import "./listar_usuarios.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { FormControl, Table } from "react-bootstrap";
import { Search } from 'react-bootstrap-icons';
import { DatabaseFillAdd } from 'react-bootstrap-icons';
import { NavBar } from "../../componentes/navbar/navbar";
import { useNavigate } from "react-router-dom";

export function Usuarios() {
    const navegar = useNavigate()
    const [usuarios, setUsuarios] = useState(null)
        useEffect(()=>{
            listarUsuario();
        },[])
    function listarUsuario(){
    axios.get("http://localhost:3005/").then((res) => {
        setUsuarios(res.data);
        console.log(res.data);
    }).catch((error) => {
        console.log(error);
    })
}
    return (
        <>
        <div className="cabeçalho">
        <NavBar></NavBar>
        </div>
        <div className="listarUsuario">
            <div className="listar-usuarios-container">
                <h1>Listar Usuários</h1>
                <div className="pesquisa">
                    <FormControl type="text" placeholder="Pesquisar usuário" />
                    <button className="btn btn-dark"><Search/></button>
                    <button onClick={() => navegar('/Cadastrar')} className="btn btn-dark"><DatabaseFillAdd/></button>
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
                            usuarios.map(usuario=>{
                                return(
                                    <tr>
                                        <td>{usuario.nome}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.grupo}</td>
                                        <td>{usuario.situacao}</td>
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
        </>
    )
}
