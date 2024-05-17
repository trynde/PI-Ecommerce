import axios from "axios";
import { NavBar } from "../../componentes/navbar/navbar";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

export function Editar() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [usuariop, setUsuario] = useState(null);
    const navegar = useNavigate();
    const idLogado = localStorage.getItem("id");
    const grupoLogado = localStorage.getItem("grupo");
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    function onSubmit(dados) {
        delete dados.confirmar;
        axios.put(`http://localhost:3005/Editar/${id}`, dados)
            .then((resposta) => {
                handleShow();
            })
            .catch((error) => alert(error.response.data.mensagem));
    }

    function pegarUser() {
        axios.get(`http://localhost:3005/pescarusuarios/${id}`)
            .then((response) => {
                setUsuario(response.data);
            });
    }

    useEffect(() => {
        pegarUser();
    }, []);

    return (
        <>
            <NavBar />
            {usuariop === null ?
                <h1>Carregando</h1>
                :
                <div className="container">
                    <h1 className='mt-3 mb-3 text-center'>Edição Usuário</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input 
                            defaultValue={usuariop[0].nome} 
                            className="form-control" 
                            type="text" 
                            name="Nome" 
                            placeholder="Nome" 
                            {...register("nome", { required: true })} 
                        />
                        {errors.nome && <span>Nome obrigatório</span>}
                        <br />
                        <input 
                            defaultValue={usuariop[0].cpf} 
                            className="form-control" 
                            type="text" 
                            name="CPF" 
                            placeholder="CPF" 
                            maxLength="11" 
                            {...register("cpf", { required: true })} 
                        />
                        {errors.cpf && <span>CPF obrigatório</span>}
                        <br />
                        <input  
                            className="form-control" 
                            type="password" 
                            name="Senha" 
                            placeholder="Senha" 
                            {...register("senha", { required: false })} 
                        />
                        {errors.senha && <span>Preencha a senha</span>}
                        <br />
                        <input  
                            className="form-control" 
                            type="password" 
                            placeholder="Confirmar senha"
                            {...register("confirmar", {
                                required: false,
                                validate: (val) => {
                                    if (watch('senha') !== val) {
                                        return "Senhas diferentes";
                                    }
                                },
                            })}
                        />
                        {errors.confirmar && <span>Senhas não conferem</span>}
                        <br />
                        {id === idLogado ?
                            <input 
                                defaultValue={usuariop[0].grupo} 
                                className="form-control" 
                                type="text" 
                                name="Grupo" 
                                value={grupoLogado} 
                                {...register("grupo", { required: true })} 
                            />
                            :
                            <>
                                <select 
                                    className="form-select" 
                                    aria-label="Default select example" 
                                    id="grupo" 
                                    {...register("grupo", { required: true })}
                                >
                                    <option value="">Selecione o grupo</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Estoque">Estoque</option>
                                </select>
                                {errors.grupo && <span>Preencha o grupo</span>}
                            </>
                        }
                        <br />
                        <button className="btn btn-dark" type="submit">Editar</button>
                    </form>
                </div>
            }
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sucesso!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Usuário atualizado!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            navegar('/Usuarios');
                            handleClose();
                        }}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}
