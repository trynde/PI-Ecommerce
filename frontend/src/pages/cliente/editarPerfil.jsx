import axios from "axios";
import { NavBar } from "../../componentes/navbar2/navbar";
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

    })
    const [cpfValido, setCpfValido] = useState(true);
    const [clienteGenero, setClienteGenero] = useState();
    const { register, handleSubmit, watch, formState: { errors } } = useForm(); // Importe o 'handleSubmit', 'register' e 'errors' do useForm
    const [endereco, setEndereco] = useState({});
    const [erroEndereco, setErroEndereco] = useState('');
    const [genero, setGenero] = useState('');

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


    function onSubmit(dados) {
        console.log(dados)
        axios.put(`http://localhost:3005/editarCliente/${id}`, dados)
            .then((resposta) => {
                handleShow();
            })
            .catch((error) => alert(error.response.data.mensagem));
    }


    function pegarCliente() {
        axios.get(`http://localhost:3005/BuscarClientes/${id}`).then((response) => {
            setClienteed(response.data)
        })
    }

    useEffect(() => {
        pegarCliente()

    }, [])

    console.log(clienteed)

    return (
        <>
            <NavBar />
            <div className="container">
                <h1 className='mt-3 mb-3 text-center'>Editar Perfil</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input defaultValue={clienteed.nome} className="form-control" type="text" name="Nome" placeholder="Nome"  {...register("nome", { required: true })} />
                    <br />
                    <input defaultValue={clienteed.data_nascimento}className="form-control" type="date" name="Data" placeholder="Data de nascimento" {...register("data_nascimento", { required: true })} />
                    <br />
                    <select defaultValue={clienteed.gênero} className="form-control" id="genero" onChange={handleGeneroChange} {...register("genero", { required: true })}>
                        {["Masculino", "Feminino", "Outro"].map(option => (<option key={option} value={option}>{option}</option>))}
                    </select>
                    <br />
                    <input defaultValue={clienteed.email} className="form-control" type="email" name="Email" placeholder="E-mail" {...register("email", { required: true })} />
                    <br />
                    <input defaultValue={clienteed.cpf} className="form-control" type="text" name="CPF" placeholder="CPF" maxLength="14" {...register("cpf", { 
                        required: true,
                        validate: (value) => cpfValidator.isValid(value) || "CPF inválido" 
                    })} />
                    <br />
                    <input className="form-control" type="password" name="Senha" placeholder="Senha" {...register("senha", { required: true })} />
                    <br />
                    <input className="form-control" type="password" placeholder="Confirmar senha"
                        {...register("confirmar", {
                            required: true,
                            validate: (val) => {
                                if (watch('senha') !== val) {
                                    return "senhas diferentes";
                                }
                            },
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
