import axios from "axios";
import { NavBar } from "../../componentes/navbar/navbar";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";


export function EditarP() {
    const [images, setImages] = useState([]);
    const [caminhosImagens, setCaminhosImagens] = useState([]);
    const [produtop, setProdutop] = useState(null)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [grupo, setGrupo] = useState(null)

    const navegar = useNavigate();
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        setGrupo(localStorage.getItem('grupo'))
    }, [])
    const fetchImagens = async () => {
        try {
            const response = await axios.get(`http://localhost:3005/buscarImagem/${id}`);
            setCaminhosImagens(response.data);
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
        }
    };
    function removerImagemDB(caminhoImagem) {
        alert(caminhoImagem)
        axios.delete(`http://localhost:3005/deletarImagem/${caminhoImagem}`).then(() => {
            alert("imagem excluida")
            setCaminhosImagens([])
            fetchImagens()
        }).catch((error) => {
            console.log(error)
            alert("falha ao excluir a imagem")
        })
    }
    const handleImageChange = (e) => {
        const newImages = Array.from(e.target.files);
        setImages(prevImages => prevImages.concat(newImages))
    };
    const handleRemoveImage = (indexToRemove) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        setImages(updatedImages);
    };
    const salvarImagem = async () => {
        try {
            for (const image of images) {
                const formData = new FormData();
                formData.append('file', image); // Adiciona apenas a imagem atual ao FormData

                const response = await axios.post(`http://localhost:3005/upload/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response.data);
            }

        } catch (error) {
            alert('Error uploading images:');
        }


    }
    function onSubmit(dados) {
        console.log(dados)
        axios.put(`http://localhost:3005/editarprodutos/${id}`, dados)
            .then((resposta) => {
                salvarImagem()
                handleShow();
            })
            .catch((error) => alert(error.response.data.mensagem));
    }


    function pegarProd() {
        axios.get(`http://localhost:3005/pescarproduto/${id}`).then((response) => {
            setProdutop(response.data)
        })
    }

    useEffect(() => {
        pegarProd()
        fetchImagens();

    }, [])

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


                <div>

                {produtop === null ?
                    <h1>Carregando</h1>
                    :
                    <div>
                        {
    grupo !== "Estoque"?
    <div>
       <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{display:"none"}}>

                        <label htmlFor="nomeProduto">Nome:</label>
                        <input defaultValue={produtop[0].nomeProduto} className="form-control" type="text" placeholder="Nome" id="nomeProduto" {...register("nomeProduto", { required: true })} />
                        <br />
                        <label htmlFor="avaliação">Avaliação:</label>
                        <select defaultValue={produtop[0].avaliacao} className="form-control" id="avaliacao" {...register("avaliacao", { required: true })}>
                            {generateRatingOptions().map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                        <br />
                        <label htmlFor="descricao">Descrição:</label>
                        <input defaultValue={produtop[0].descricao} className="form-control" type="text" placeholder="Descrição" id="descricao" {...register("descricao", { required: true })} />
                        <br />
                        <label htmlFor="preco">Preço:</label>
                        <input defaultValue={produtop[0].preco} className="form-control" type="number" placeholder="Preço" step="0.01" id="preco"  {...register("preco", { required: true })} />
                        <br />
                        <div className="mb-3">
                            <label htmlFor="">Excluir imagens salvas</label>
                            <div className="div-imgs">
                                {caminhosImagens.map((caminho, index) => (
                                    <div className="div-imagens-excluir">
                                        <img key={index} src={`http://localhost:3005/images/${caminho.nomeImagem}`} alt={`Imagem ${index + 1}`} width="300px" height="300px" />
                                        <button onClick={() => {
                                            removerImagemDB(caminho.nomeImagem)
                                        }} className="remove-button" type="button">Excluir</button>
                                    </div>
                                ))}
                            </div>
                           
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="mb-2">Adiconar Nova Imagem</label>
                            <div className="custom-file">
                                <input type="file" multiple onChange={handleImageChange} className="file" id="customFile" />
                                <div htmlFor="customFile" className="file-label">
                                    <label>Escolha o arquivo...</label>
                                    <label htmlFor="customFile" className="label-button">Navegar</label>
                                </div>
                            </div>
                            <div className="mt-4 mb-3">
                                {images.map((image, index) => (
                                    <div key={index} className="image-container">
                                        <img src={URL.createObjectURL(image)} alt={`Imagem ${index}`} />
                                        <button onClick={() => handleRemoveImage(index)} className="remove-button">Remover</button>
                                    </div>
                                ))}
                            </div>
                        </div>

        </div>
                        <label htmlFor="estoque">Estoque:</label>
                        <input defaultValue={produtop[0].estoque} className="form-control" type="number" placeholder="Quantidade" id="estoque"  {...register("estoque", { required: true })} />
                        
                        <br />
                        <button className="btn btn-dark" type="submit">
                            Editar
                        </button>
                    </form>
 </div>
    :

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="nomeProduto">Nome:</label>
                        <input defaultValue={produtop[0].nomeProduto} className="form-control" type="text" placeholder="Nome" id="nomeProduto" {...register("nomeProduto", { required: true })} />
                        <br />
                        <label htmlFor="avaliação">Avaliação:</label>
                        <select defaultValue={produtop[0].avaliacao} className="form-control" id="avaliacao" {...register("avaliacao", { required: true })}>
                            {generateRatingOptions().map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                        <br />
                        <label htmlFor="descricao">Descrição:</label>
                        <input defaultValue={produtop[0].descricao} className="form-control" type="text" placeholder="Descrição" id="descricao" {...register("descricao", { required: true })} />
                        <br />
                        <label htmlFor="preco">Preço:</label>
                        <input defaultValue={produtop[0].preco} className="form-control" type="number" placeholder="Preço" step="0.01" id="preco"  {...register("preco", { required: true })} />
                        <br />
                        <label htmlFor="estoque">Estoque:</label>
                        <input defaultValue={produtop[0].estoque} className="form-control" type="number" placeholder="Quantidade" id="estoque"  {...register("estoque", { required: true })} />
                        <div className="mb-3">
                            <label htmlFor="">Excluir imagens salvas</label>
                            <div className="div-imgs">
                                {caminhosImagens.map((caminho, index) => (
                                    <div className="div-imagens-excluir">
                                        <img key={index} src={`http://localhost:3005/images/${caminho.nomeImagem}`} alt={`Imagem ${index + 1}`} width="300px" height="300px" />
                                        <button onClick={() => {
                                            removerImagemDB(caminho.nomeImagem)
                                        }} className="remove-button" type="button">Excluir</button>
                                    </div>
                                ))}
                            </div>
                           
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="mb-2">Adiconar Nova Imagem</label>
                            <div className="custom-file">
                                <input type="file" multiple onChange={handleImageChange} className="file" id="customFile" />
                                <div htmlFor="customFile" className="file-label">
                                    <label>Escolha o arquivo...</label>
                                    <label htmlFor="customFile" className="label-button">Navegar</label>
                                </div>
                            </div>
                            <div className="mt-4 mb-3">
                                {images.map((image, index) => (
                                    <div key={index} className="image-container">
                                        <img src={URL.createObjectURL(image)} alt={`Imagem ${index}`} />
                                        <button onClick={() => handleRemoveImage(index)} className="remove-button">Remover</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <br />
                        <button className="btn btn-dark" type="submit">
                            Editar
                        </button>
                    </form>
                    }
                </div>
                }
                </div>
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