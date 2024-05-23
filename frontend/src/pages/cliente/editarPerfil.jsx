import axios from "axios";
import { NavBar } from "../../componentes/navbar3/navbar";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export function EditarCliente() {
    const navegar = useNavigate();
    const { id } = useParams();
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [clienteed, setClienteed] = useState({
        nome: "",
        data_nascimento: "",
        genero: "",
        email: "",
        cpf: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: ""
    });
    const [cpfValido, setCpfValido] = useState(true);
    const { register, handleSubmit, watch, formState: { errors } } = useForm(); // Importe o 'handleSubmit', 'register' e 'errors' do useForm
    const [endereco, setEndereco] = useState({});
    const [erroEndereco, setErroEndereco] = useState('');
    const [genero, setGenero] = useState(clienteed.genero);

    const handleGeneroChange = (event) => {
        setGenero(event.target.value);
    };

    useEffect(() => {
        if (Object.keys(endereco).length !== 0) {
            setErroEndereco('');
        }
    }, [endereco]);

    const buscarCEP = (cep) => {
        axios.get(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                setEndereco(response.data);
            })
            .catch(error => {
                setErroEndereco('CEP não encontrado');
            });
    };

    const pegarCliente = () => {
        axios.get(`http://localhost:3005/BuscarClientes/${id}`).then((response) => {
            setClienteed(response.data);
        });
    };

    useEffect(() => {
        pegarCliente();
    }, []);

    const onSubmit = (dados) => {
        const atualizacoes = {};

        for (let key in dados) {
            if (dados[key] && dados[key] !== clienteed[key]) {
                atualizacoes[key] = dados[key];
            }
        }

        if (Object.keys(atualizacoes).length === 0) {
            alert("Nenhum campo foi modificado.");
            return;
        }

        axios.put(`http://localhost:3005/editarCliente/${id}`, atualizacoes)
            .then((resposta) => {
                handleShow();
            })
            .catch((error) => alert(error.response.data.mensagem));
    };

    return (
        <>
            <NavBar />
            <div className="container">
                <h1 className='mt-3 mb-3 text-center'>Editar Perfil</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        defaultValue={clienteed.nome}
                        className="form-control"
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        {...register("nome")}
                    />
                    <br />
                    <input
                        defaultValue={clienteed.data_nascimento}
                        className="form-control"
                        type="date"
                        name="data_nascimento"
                        placeholder="Data de nascimento"
                        {...register("data_nascimento")}
                    />
                    <br />
                    <select
                        defaultValue={clienteed.genero}
                        className="form-control"
                        id="genero"
                        onChange={handleGeneroChange}
                        {...register("genero")}
                    >
                        {["Masculino", "Feminino", "Outro"].map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <br />
                    <input
                        defaultValue={clienteed.email}
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        {...register("email")}
                    />
                    <br />
                    <input
                        defaultValue={clienteed.cpf}
                        className="form-control"
                        type="text"
                        name="cpf"
                        placeholder="CPF"
                        maxLength="14"
                        {...register("cpf", {
                            validate: (value) => cpfValidator.isValid(value) || "CPF inválido"
                        })}
                    />
                    <br />
                    <input
                        className="form-control"
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        {...register("senha")}
                    />
                    <br />
                    <input
                        className="form-control"
                        type="password"
                        placeholder="Confirmar senha"
                        {...register("confirmar", {
                            validate: (val) => {
                                if (watch('senha') !== val) {
                                    return "Senhas diferentes";
                                }
                            }
                        })}
                    />
                    {errors.confirmar && <span>Senhas não conferem</span>}
                    <br />
                    <button className="btn btn-dark" type="submit">Editar</button>
                </form>
            </div>
        </>
    );
}
