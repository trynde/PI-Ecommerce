import { useEffect, useState } from "react"
import  logo  from '../../assets/logo.svg'

export function NavBar() {
    const [grupo, setGrupo] = useState(null)
    useEffect(() => {
        setGrupo(localStorage.getItem('grupo'))
    }, [])
    return (
        <>
            <header>
                <div className="logo"><img width = '100px' height = '60px' src={logo}/>
                </div>
                <nav>
                    <ul>
                        <li><a href="http://localhost:3000/Produto">Listar Produtos</a></li>
                        {grupo !== 'Administrador' ?
                            <></>
                            :
                            <li><a href="http://localhost:3000/Usuarios">Listar Usuários</a></li>
                        }
                        <li><a href="http://localhost:3000/Login">Sair</a></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}