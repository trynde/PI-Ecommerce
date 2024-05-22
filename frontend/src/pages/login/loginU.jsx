import { useState } from "react";
import "./login.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { hashSenha } from "../../componentes/firebaseConfig/firebaseConfig";

export function LoginU() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const entrar = async () => {
        try {
            await signInWithEmailAndPassword(hashSenha, email, senha);
            navigate('/principalC');
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                alert("Email ou senha inválidos");
            } else if (error.code === 'auth/user-disabled') {
                setShow(true);
            } else {
                alert("Erro ao fazer login");
                console.log()
            }
        }
    };

    return (
        <div className="login-container container">
            <h2>Entrar</h2>
            <input
                className="inputLogin mb-2 mt-2 form-control"
                type="text"
                name="email"
                placeholder="E-mail"
                onChange={(evento) => { setEmail(evento.target.value) }}
                required
            />
            <input
                className="inputLogin mb-2 form-control"
                type="password"
                name="password"
                placeholder="Senha"
                onChange={(evento) => { setSenha(evento.target.value) }}
                required
            />
            <button
                className="btn btn-dark"
                type="submit"
                onClick={entrar}
            >
                Entrar
            </button>
            <a href="/CadastrarCli">Não tem conta? Cadastra-se</a>
        </div>
    );
}
