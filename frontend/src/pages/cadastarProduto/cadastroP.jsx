import React, { useState } from "react";
import axios from "axios";
import { NavBar } from "../../componentes/navbar/navbar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function CadastroP() {
    const navegar = useNavigate();
    const [imagem, setImagem] = useState(null); // Estado para armazenar a imagem selecionada
    const [imagemPreview, setImagemPreview] = useState(null); // Estado para armazenar a visualização da imagem

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const generateRatingOptions = () => {
      const options = [];
      for (let i = 0; i <= 10; i++) {
        options.push((i / 2).toFixed(1));
      }
      return options;
    };


    // Função para lidar com o envio do formulário
    const onSubmit = async (dados) => {
        try {
            const formData = new FormData(); // Criando um objeto FormData para enviar os dados do formulário
            formData.append("imagem", imagem); // Adicionando a imagem ao FormData

            // Adicionando os outros dados do formulário ao FormData
            Object.entries(dados).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Enviando a requisição com Axios
            await axios.post(`http://localhost:3005/upload/:id`, formData);
            navegar("/Produto");

            
            axios.post('http://localhost:3005/Usuarios', dados)
            .then((resposta) => {
                navegar('/Usuarios');
            })
        } catch (error) {
            alert("Erro ao enviar o formulário: " + error.message);
        }
    };

    // Função para lidar com a seleção de imagem
    const handleImagemChange = (event) => {
        const imagemSelecionada = event.target.files[0]; // Captura a imagem selecionada
        setImagem(imagemSelecionada); // Atualiza o estado da imagem com o arquivo selecionado

        // Exibir a visualização da imagem selecionada
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagemPreview(reader.result);
        };
        reader.readAsDataURL(imagemSelecionada);
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
                        onChange={handleImagemChange}
                        accept="image/*"
                        className="form-control"
                    />
                    <br />
                    {/* Exibição da imagem selecionada */}
                    {imagemPreview && (
                        <div className="text-center">
                            <img
                                src={imagemPreview}
                                alt="Imagem selecionada"
                                style={{ maxWidth: "250px", maxHeight: "250px" }} // Definindo o tamanho máximo da imagem
                            />
                        </div>
                    )}
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
                    <select className="form-control" id="avaliacao" {...register("avaliacao", { required: true })}>
                        {generateRatingOptions().map(option => (<option key={option} value={option}>{option}</option> ))}
                    </select>   
                    {errors.status && <span>Selecione um item válido</span>}
                    <select style={{display:'none'}} className="form-select" aria-label="Default select example" id="status" {...register("status", { required: true })}>
                        <option value="ativo">Ativo</option>
                    </select>
                    {errors.status && <span>Selecione um item válido</span>}
                    <br />
                    <br />
                    <button className="btn btn-dark" type="submit">
                        Cadastrar
                    </button>
                </form>
            </div>
        </>
    );
}
