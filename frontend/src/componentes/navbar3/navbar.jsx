// src/components/NavBar.js
import { useEffect, useState } from "react";
import logo from '../../assets/logo.svg';
import { Cart3, Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig/firebaseConfig"; // firebaseConfig
import useAuth from "../hooks/useAuth"; //hooks/useAuth

export function NavBar() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>; // Adicione um indicador de carregamento, se necessário
    }

    return (
        <header>
            <div className="logo">
                <Link to="/">
                    <img width="100px" height="60px" src={logo} alt="Logo" />
                </Link>
            </div>
            <nav>
                <ul>
                    {user ? (
                        <>
                            <li><Link to={`/Perfil/${user.uid}`}><Person size={26} /></Link></li>
                            <li><Link to="/Carrinho"><Cart3 size={26} /></Link></li>
                            <li><button onClick={handleLogout}>Sair</button></li>
                        </>
                    ) : (
                        <>
                        <li><Link to="/login">Entrar</Link></li>
                        <li><Link to="/Carrinho"><Cart3 size={26} /></Link></li>
                        </>
                        
                    )}
                </ul>
            </nav>
        </header>
    );
}
