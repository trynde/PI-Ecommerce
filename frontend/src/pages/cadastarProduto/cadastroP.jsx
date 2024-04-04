import React, { useState } from "react";
import axios from "axios";
import { NavBar } from "../../componentes/navbar/navbar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./cadastroP.css";

export function CadastroP() {
    const navegar = useNavigate();

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm()
    const handleImageChange = (e) => {
        const newImages = Array.from(e.target.files); // Converte o objeto FileList em um array
        setImages(prevImages => prevImages.concat(newImages)); // Concatena as novas imagens com as imagens existentes
    };

    const handleRemoveImage = (indexToRemove) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove); // Filtra todos os itens, exceto o item no índice indexToRemove
        setImages(updatedImages); // Atualiza o estado com o novo array sem o item removido
    };
    const salvarImagem = async (id) => {
        setLoading(true);
        console.log(id)
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

            setImages([]); // Limpa o array de imagens após o envio bem-sucedido
            setLoading(false);
        } catch (error) {
            console.error('Error uploading images:', error);
            setLoading(false);
        }


    }
    // Função para lidar com o envio do formulário
    const onSubmit = async (dados) => {

        axios.post('http://localhost:3005/criarProduto', dados)
            .then(async (resposta) => {
                await salvarImagem(resposta.data.insertId)
navegar("/Produto")
            });

    };

    return (
        <>
            <NavBar />
            <div className="container">
                <h1 className="mt-3 mb-3 text-center">Cadastro de Produto</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Nome"
                        {...register("nomeProduto", { required: true })}
                    />
                    {errors.nomeProduto && <span>Nome obrigatório</span>}
                    <br />
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="form-control"
                        multiple // Permite a seleção de múltiplas imagens
                    />
                    <br />
                    {/* Exibição das visualizações das imagens selecionadas */}
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        {images.map((image, index) => (
                            <div key={index} className="image-container">
                                <img src={URL.createObjectURL(image)} alt={`Imagem ${index}`} />
                                <button onClick={() => handleRemoveImage(index)} className="remove-button">Remover</button>
                            </div>
                        ))}
                    </div>
                    <br />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Descrição"
                        maxLength="2000"
                        {...register("descricao", { required: true })}
                    />
                    {errors.descricao && <span>Descrição obrigatória</span>}
                    <br />
                    <input
                        className="form-control"
                        type="number"
                        placeholder="Preço"
                        {...register("preco", { required: true })}
                    />
                    {errors.preco && <span>Preço obrigatório</span>}
                    <br />
                    <input
                        className="form-control"
                        type="number"
                        placeholder="Estoque"
                        {...register("estoque", { required: true })}
                    />
                    {errors.estoque && <span>Estoque obrigatório</span>}
                    <br />
                    <input 
                        className="form-control"
                        type="number"
                        placeholder="Avaliação"
                        {...register("avaliacao", { required: true })}
                        
                    />
                    
                    {errors.avaliacao && <span>Avaliação obrigatória</span>}
                    <br />
                    <select style={{display:'none'}}
                        className="form-select"
                        aria-label="Default select example"
                        id="situacao"
                        {...register("status", { required: true })}
                    >
                        <option value="ativo">Ativo</option>
                    </select>
                    {errors.status && <span>Selecione um item válido</span>}
                    <br />
                    <button className="btn btn-dark" type="submit">
                        Cadastrar
                    </button>
                </form>
            </div>
        </>
    );
}
