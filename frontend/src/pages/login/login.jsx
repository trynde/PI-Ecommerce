import { useState } from "react";
import "./login.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [email,setEmail] = useState('')
    const [senha,setSenha] = useState('')
    const navegar = useNavigate()
    localStorage.clear()

    function entrar() {
        let dados = {email,senha}
        axios.post('http://localhost:3005/login',dados).then((resposta => {
        const grupo = resposta.data.grupo;
        console.log(grupo);
        localStorage.setItem('grupo', grupo)
        navegar('/Principal')
    })).catch((error => {
            console.log(error)
        }))
    }
    return (
        <div className="login-container container">
            <h2>Login</h2>
                <input className="inputLogin mb-2 mt-2 form-control" type="text" name="email" placeholder="E-mail" onChange={(evento)=>{setEmail(evento.target.value)}} required />
                <input className="inputLogin mb-2 form-control" type="password" name="password" placeholder="Senha" onChange={(evento)=>{setSenha(evento.target.value)}} required />
                <button className="btn btn-dark" type="submit" onClick={() => {entrar()}}>Entrar</button>
        </div>
    )
}
