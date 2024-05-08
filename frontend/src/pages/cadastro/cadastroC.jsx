import axios from "axios";
import { NavBar } from "../../componentes/navbar2/navbar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export function CadastrarCli() {
    const navegar = useNavigate();
    const [cpfValido, setCpfValido] = useState(true);
    const [clienteGenero, setClienteGenero] = useState();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

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
        delete dados.confirmar;
        axios.post('http://localhost:3005/Cliente', dados)
            .then((resposta) => {
                navegar('/Entrar');
            })
            .catch((error) => alert(error.response.data.mensagem));
    }

    return (
        <>
            <NavBar />
            <div className="container">
                <h1 className='mt-3 mb-3 text-center'>Cadastro de Usuário</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input className="form-control" type="text" name="Nome" placeholder="Nome" {...register("nome", { required: true })} />
                    {errors.nome && <span>Nome obrigatório</span>}
                    <br />
                    <input className="form-control" type="date" name="Data" placeholder="Data de nacimento" {...register("data_nascimento", { required: true })} />
                    <br />
                    <select defaultValue={clienteGenero} className="form-control" id="genero" {...register("genero", { required: true })}>
                    {["Masculino", "Feminino", "Outro"].map(option => (<option key={option} value={option}>{option}</option>))}
                    </select>
                    <br />
                    <input className="form-control" type="email" name="Email" placeholder="E-mail" {...register("email", { required: true })} />
                    {errors.email && <span>E-mail obrigatório</span>}
                    <br />
                    <input className="form-control" type="text" name="CPF" placeholder="CPF" maxLength="14" {...register("cpf", { 
                        required: true,
                        validate: (value) => cpfValidator.isValid(value) || "CPF inválido" 
                    })} />
                    {errors.cpf && <span>{errors.cpf.message}</span>}
                    <br />
                    <input className="form-control" type="password" name="Senha" placeholder="Senha" {...register("senha", { required: true })} />
                    {errors.senha && <span>Preencha a senha</span>}
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
                    <div>
                        <input className="form-control" type="text" name="CEP" placeholder="CEP" maxLength="9" {...register("cep", { 
                            required: true,
                            pattern: /^[0-9]{5}-?[0-9]{3}$/i,
                        })} onBlur={(e) => buscarCEP(e.target.value)} />
                        {errors.cep && <span>CEP inválido</span>}
                        {erroEndereco && <span>{erroEndereco}</span>}
                    </div>
                    <br />
                    <input className="form-control" type="text" name="Endereco" placeholder="Endereço" value={endereco.logradouro || ''} {...register("endereco")} />
                    <br />
                    <input className="form-control" type="text" name="Numero" placeholder="Numero da casa" {...register("numero", { required: true })} />
                    <br />
                    <input className="form-control" type="text" name="Bairro" placeholder="Bairro" value={endereco.bairro || ''} {...register("bairro")} />
                    <br />
                    <input className="form-control" type="text" name="Cidade" placeholder="Cidade" value={endereco.localidade || ''} {...register("cidade")} />
                    <br />
                    <input className="form-control" type="text" name="Estado" placeholder="Estado" value={endereco.uf || ''} {...register("estado")} />
                    <br />
                    <button className="btn btn-dark" type="submit">Cadastrar</button>
                </form>
            </div>
        </>
    );
}
