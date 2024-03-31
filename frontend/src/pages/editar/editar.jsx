import axios from "axios";
import { NavBar } from "../../componentes/navbar/navbar";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";


export function Editar() {
    const [usuariop, setUsuariop] = useState(null)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navegar = useNavigate()
    const idLogado = localStorage.getItem("id")
    const grupoLogado = localStorage.getItem("grupo")
    const { id } = useParams()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()
    function onSubmit(dados) {
        if(dados.senha === ""){
            delete dados.senha
            axios.put(`http://localhost:3005/Editar/semSenha/${id}`, dados).then((resposta) => {
        handleShow()
        })
        .catch((error) => alert(error.response.data.mensagem))
    }else{
        delete dados.confirmar
        axios.put(`http://localhost:3005/Editar/${id}`, dados).then((resposta) => {
        handleShow()
    })
            .catch((error) => alert(error.response.data.mensagem))
    }
    }
    function pegarUser(){
        axios.get(`http://localhost:3005/usuario/${id}`).then((response)=>{
            setUsuariop(response.data)
        })
    }
    useEffect(()=>{
        pegarUser()
    },[])

    return (
        <>
            <NavBar></NavBar>
            <div className="container">
                <h1 className='mt-3 mb-3 text-center'>Edição Usuário</h1>
                {usuariop === null?
                <h1>Carregando</h1>
                :    
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="nome">Nome:</label>
                    <input defaultValue={usuariop[0].nome} className="form-control" type="text" name="Nome" placeholder="Nome" id="nome" {...register("nome", { required: true })} />
                    <br />
                    <label htmlFor="cpf">CPF:</label>
                    <input defaultValue={usuariop[0].cpf} className="form-control" type="text" name="CPF" placeholder="CPF" maxLength="11" id="cpf" {...register("cpf", { required: true })} />
                    <br />
                    <label htmlFor="senha">Senha:</label>
                    <input className="form-control" type="password" name="Senha" placeholder="Senha" id="senha" {...register("senha", { required: false })} />
                    <br />
                    <label htmlFor="confirmar">Confirmar senha:</label>
                    <br />
                    <input className="form-control" type="password" id="confirmar" placeholder="Confirmar senha"
                        {...register("confirmar", {
                            required: false,
                            validate: (val) => {
                                if (watch('senha') != val) {
                                    return "senhas diferentes";
                                }
                            },
                        })}
                    />
                    {errors.confirmar && <span>Senhas não conferem</span>}
                    <br />
                    <label htmlFor="grupo">Grupo:</label>
                    {
                        id === idLogado ?
                            <input className="form-control" type="text" name="Grupo" id="grupo" value={grupoLogado} {...register("grupo", { required: true })} />

                            :
                            <>
                                <select defaultValue={usuariop[0].grupo} className="form-select" aria-label="Default select example" id="grupo"{...register("grupo", { required: true })}>
                                    <option value="">Selecione o grupo</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Estoque">Estoque</option>
                                </select>
                            </>
                    }
                    <br />
                    <button className="btn btn-dark" type="submit">Editar</button>
                </form>
            }
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sucesso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Usuário atualizado!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        navegar('/Usuarios')
                        handleClose()
                    }}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </>
    )
}