import axios from "axios";
import { NavBar } from "../../componentes/navbar/navbar";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

export function EditarP() {
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
        delete dados.confirmar
        axios.put(`http://localhost:3005/editarprodutos/${id}`, dados).then((resposta) => {
        handleShow()
    })
            .catch((error) => alert(error.response.data.mensagem))
    }

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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input className="form-control" type="text" placeholder="Nome" {...register("nome", { required: true })}/>
                    {errors.nome && <span>Nome obrigatório</span>}
                    <br />
                    <select className="form-control" {...register("avaliacao", { required: true })}>
                        {generateRatingOptions().map(option => (<option key={option} value={option}>{option}</option> ))}
                    </select>
                    {errors.avaliacao && <span>Avaliação obrigatória</span>}
                    <br />
                    <input className="form-control" type="text" placeholder="Descrição" {...register("descricao", { required: true })}/>
                    {errors.descricao && <span>Descrição obrigatória</span>}
                    <br />
                    <input className="form-control" type="number" placeholder="Preço" step="0.01" {...register("preco", { required: true })} />
                    {errors.preco && <span>Preço obrigatório</span>}
                    <br />
                    <input className="form-control" type="number" placeholder="Quantidade" {...register("quantidade", { required: true })}/>
                    {errors.quantidade && <span>Quantidade obrigatória</span>}
                    <br />
                    <button className="btn btn-dark" type="submit">
                        Editar
                    </button>
                </form>
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
