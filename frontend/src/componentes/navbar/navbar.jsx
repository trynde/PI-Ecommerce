import { useEffect, useState } from "react"

export function NavBar() {
    const [grupo, setGrupo] = useState(null)
    useEffect(() => {
        setGrupo(localStorage.getItem('grupo'))
    }, [])
    console.log(grupo);
    return (
        <>
            <header>
                <div class="logo">Logo</div>
                <nav>
                    <ul>
                        <li><a href="#">Listar Produtos</a></li>
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