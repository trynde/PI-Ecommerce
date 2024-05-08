import { useEffect, useState } from "react";
import logo from '../../assets/logo.svg';
import { Cart3, Person } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";

export function NavBar() {
    const [grupo, setGrupo] = useState(null);
    const [id, setID] = useState('');
   

    return (
        <>
            <header>
                <div className="logo">
                    <Link to="/">
                        <img width="100px" height="60px" src={logo} alt="Logo" />
                    </Link>
                </div>
                <nav>
                    <ul>
                        {/* Aqui você usa o estado `id` para criar a URL da página de perfil */}
                        <li><Link to={`/Perfil/${id}`}><Person size={26} /></Link></li>
                        <li><a href="/Carrinho"><Cart3 size={26} /></a></li>
                        <li><a href="http://localhost:3000/">Sair</a></li>
                    </ul>
                </nav>
            </header>
        </>
    );
}
