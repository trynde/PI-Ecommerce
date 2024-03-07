import axios from "axios";
import { NavBar } from "../../componentes/navbar/navbar";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";


export function Cadastrar() {
    const navegar = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()
    function onSubmit(dados) {
        delete dados.confirmar
        axios.post('http://localhost:3005/Usuarios', dados).then((resposta) => {
        navegar('/Usuarios')

    })
        .catch((error) => alert(error.response.data.mensagem))
    }
    return(
    <>
    <NavBar></NavBar>
    <div className="container">
        <h1 className='mt-3 mb-3 text-center'>Cadastro de Usuário</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input className="form-control" type="text" name="Nome" placeholder="Nome" {...register("nome", { required: true })}/>
            {errors.nome && <span>Nome obrigatório</span>}
            <br/>
            <input className="form-control" type="email" name="Email" placeholder="E-mail" {...register("email", { required: true })}/>
            {errors.email && <span>E-mail obrigatório</span>}
            <br/>
            <input className="form-control" type="text" name="CPF" placeholder="CPF" {...register("cpf", { required: true })}/>
            {errors.cpf && <span>CPF obrigatório</span>}
            <br/>
            <input className="form-control" type="password" name="Senha" placeholder="Senha" {...register("senha", { required: true })}/>
            {errors.senha && <span>Preencha a senha</span>}
            <br/>
            <input className="form-control" type="password" placeholder="Confirmar senha"
                        {...register("confirmar", {
                            required: true,
                            validate: (val) => {
                                if (watch('senha') != val) {
                                    return "senhas diferentes";
                                }
                            },
                        })}
                    />
                    {errors.confirmar && <span>Senhas não conferem</span>}
                    <br/>
                    <select className="form-select" aria-label="Default select example" id="grupo"{...register("grupo", { required: true })}>
                        <option value="">Selecione o grupo</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Estoque">Estoque</option>
                    </select>
                    {errors.grupo && <span>Grupo obrigatório</span>}
                    <br/>
                    <select className="form-select" aria-label="Default select example" id="situacao"{...register("situacao", { required: true })}>
                        <option value="">Situação</option>
                        <option value="ativo">Ativo</option>
                    </select>
                    {errors.situacao && <span>Selecione um item válido</span>}
                    <br/>

            <button className="btn btn-dark" type="submit">Cadastrar</button>
        </form>
    </div>
    </>
)    
}