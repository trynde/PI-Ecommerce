import { useState } from "react";
import "./login.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

export function Login() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const navegar = useNavigate()
    localStorage.clear()

    function entrar() {
        let dados = { email, senha }
        axios.post('http://localhost:3005/login', dados).then((resposta => {
            const grupo = resposta.data.grupo;
            const id = resposta.data.id;
            localStorage.setItem('grupo', grupo)
            localStorage.setItem('id', id)
            if (resposta.data.situacao !== 'ativo') {
                return handleShow()
            }
            navegar('/Principal')
        })).catch((error => {
            alert("Senha inválida");
        }))
    }
    return (
        <div className="login-container container">
            <h2>Login</h2>
            <input className="inputLogin mb-2 mt-2 form-control" type="text" name="email" placeholder="E-mail" onChange={(evento) => { setEmail(evento.target.value) }} required />
            <input className="inputLogin mb-2 form-control" type="password" name="password" placeholder="Senha" onChange={(evento) => { setSenha(evento.target.value) }} required />
            <button className="btn btn-dark" type="submit" onClick={() => { entrar() }}>Entrar</button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Alerta</Modal.Title>
                </Modal.Header>
                <Modal.Body>Usuário está inativo!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )

}
