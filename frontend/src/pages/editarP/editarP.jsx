import axios from "axios";
import { NavBar } from "../../componentes/navbar/navbar";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";


export function EditarP() {
    const [produtop, setProdutop] = useState(null)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navegar = useNavigate();
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    function onSubmit(dados) {
        console.log(dados)
        axios.put(`http://localhost:3005/editarprodutos/${id}`, dados)
            .then((resposta) => {
                // Exibir o modal de sucesso
                handleShow();
            })
            .catch((error) => alert(error.response.data.mensagem));
    }
    

    function pegarProd(){
        axios.get(`http://localhost:3005/pescarproduto/${id}`).then((response)=>{
            setProdutop(response.data)
        })
    }
    
    useEffect(()=>{
        pegarProd()
    },[])

    console.log(produtop)
    

    const generateRatingOptions = () => {
        const options = [];
        for (let i = 0; i <= 10; i++) {
          options.push((i / 2).toFixed(1));
        }
        return options;
    };

    return (
        <>
            <NavBar />
            <div className="container">
                <h1 className="mt-3 mb-3 text-center">Editar Produto</h1>
                {produtop === null?
                <h1>Carregando</h1>
                :    
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="nomeProduto">Nome:</label>
                    <input defaultValue={produtop[0].nomeProduto} className="form-control" type="text" placeholder="Nome" id="nomeProduto" {...register("nomeProduto", { required: true })}/>
                    <br/>
                    <label htmlFor="avaliação">Avaliação:</label>
                    <select defaultValue={produtop[0].avaliacao} className="form-control" id="avaliacao" {...register("avaliacao", { required: true })}>
                        {generateRatingOptions().map(option => (<option key={option} value={option}>{option}</option> ))}
                    </select>
                    <br/>
                    <label htmlFor="descricao">Descrição:</label>
                    <input defaultValue={produtop[0].descricao} className="form-control" type="text" placeholder="Descrição" id="descricao" {...register("descricao", { required: true })}/>
                    <br/>
                    <label htmlFor="preco">Preço:</label>
                    <input defaultValue={produtop[0].preco} className="form-control" type="number" placeholder="Preço" step="0.01" id="preco"  {...register("preco", { required: true })} />
                    <br/>
                    <label htmlFor="estoque">Estoque:</label>
                    <input defaultValue={produtop[0].estoque} className="form-control" type="number" placeholder="Quantidade" id="estoque"  {...register("estoque", { required: true })}/>
                    <br />
                    <button className="btn btn-dark" type="submit">
                        Editar
                    </button>
                </form>
                }
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sucesso!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Produto atualizado!</Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                navegar("/Produto");
                                handleClose();
                            }}
                        >
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}
