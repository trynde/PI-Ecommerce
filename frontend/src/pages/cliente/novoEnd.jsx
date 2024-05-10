import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


export function NovoEnd() {
    const navegar = useNavigate();
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState({
    logradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: ''
  });
  const [erroEndereco, setErroEndereco] = useState('');
  const [sucessoCadastro, setSucessoCadastro] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
} = useForm();

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
    axios.post('http://localhost:3005/endereco', dados)
        .then((resposta) => {
            navegar('/');
        })
        .catch((error) => alert(error.response.data.mensagem));
}

  return (
    <div>
      <h1 className='mt-3 mb-3 text-center'> Cadastrar um Novo Endereço</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
      
  );
}


