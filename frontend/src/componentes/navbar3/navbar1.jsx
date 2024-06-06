import React from 'react';
import { Link } from "react-router-dom";
import { Cart3, Person } from 'react-bootstrap-icons';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

export function NavBar1() {

  const id = localStorage.id;
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar o localStorage
    localStorage.clear();
    // Redirecionar para a página inicial
    navigate("/");
  }

  return (
    <>
      <header>
        <div className="logo">
          <Link to="/principalC">
            <img width="100px" height="60px" src={logo} alt="Logo" />
          </Link>
        </div>
        <nav>
          <ul>
            {/* Aqui você usa o estado `id` para criar a URL da página de perfil */}
            <li><Link to={`/Perfil/${id}`}><Person size={26} /></Link></li>
            <li><Link to="/Carrinho"><Cart3 size={26} /></Link></li>
            <li><button style={{ backgroundColor: 'transparent', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }} onClick={handleLogout}>Sair</button></li>
          </ul>
        </nav>
      </header>
    </>
  );
}
