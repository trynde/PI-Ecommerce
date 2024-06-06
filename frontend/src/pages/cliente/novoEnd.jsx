import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { NavBar1 } from '../../componentes/navbar3/navbar1';
import { useNavigate } from "react-router-dom";

export function NovoEnd() {
  const navegar = useNavigate();
  const [endereco, setEndereco] = useState({
    logradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: ''
  });
  const [erroEndereco, setErroEndereco] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const id = localStorage.id

  const buscarCEP = (cep) => {
    axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => {
        setEndereco(response.data);
      })
      .catch(error => {
        setErroEndereco('CEP não encontrado');
      });
  };

  const onSubmit = (data) => {
    axios.post('http://localhost:3005/endereco', data)
      .then((resposta) => {
        console.log('Endereço adicionado com sucesso:', resposta.data);
        navegar(`/Perfil/${id}`);
      })
      .catch((error) => {
        console.error('Erro ao adicionar endereço:', error);
        alert('Erro ao adicionar endereço. Por favor, tente novamente.');
      });
  };

  return (
    <>
    <NavBar1></NavBar1>
    <div>
      <h1 className='mt-3 mb-3 text-center'>Cadastrar um Novo Endereço</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div>
          <input
            className="form-control"
            type="text"
            name="CEP"
            placeholder="CEP"
            maxLength="9"
            {...register("cep", { 
              required: true,
              pattern: /^[0-9]{5}-?[0-9]{3}$/i,
            })}
            onBlur={(e) => buscarCEP(e.target.value)}
          />
          {errors.cep && <span>CEP inválido</span>}
          {erroEndereco && <span>{erroEndereco}</span>}
        </div>
        <br />
        <input
          className="form-control"
          type="text"
          name="Endereco"
          placeholder="Endereço"
          value={endereco.logradouro || ''}
          {...register("endereco")}
        />
        <input
          type="hidden"
          className="form-control"
          name="Cliente"
          placeholder="Cliente"
          value={id || ''}
          {...register("cliente_id")}
        />
        <br />
        <input
          className="form-control"
          type="text"
          name="Numero"
          placeholder="Número da casa"
          {...register("numero", { required: true })}
        />
        <br />
        <input
          className="form-control"
          type="text"
          name="Bairro"
          placeholder="Bairro"
          value={endereco.bairro || ''}
          {...register("bairro")}
        />
        <br />
        <input
          className="form-control"
          type="text"
          name="Cidade"
          placeholder="Cidade"
          value={endereco.localidade || ''}
          {...register("cidade")}
        />
        <br />
        <input
          className="form-control"
          type="text"
          name="Estado"
          placeholder="Estado"
          value={endereco.uf || ''}
          {...register("estado")}
        />
        <br />
        <select
          className="form-control"
          name="Tipo"
          {...register("tipo", { required: true })}
        >
          <option value="">Selecione o Tipo</option>
          <option value="Principal">Principal</option>
          <option value="Alternativo">Alternativo</option>
        </select>
        {errors.tipo && <span>Por favor, selecione o tipo de endereço</span>}
        <br />
        <select style={{display:'none'}} className="form-select" aria-label="Default select example" id="situacao" {...register("situacao", { required: true })}>
        <option value="ativo">Ativo</option>
        </select>
        <button className="btn btn-dark" type="submit">Cadastrar</button>
      </form>
    </div>
    </>
  );
}
