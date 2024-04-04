import { useEffect, useState } from "react"
import  logo  from '../../assets/logo.svg'
import { Cart3 } from 'react-bootstrap-icons';

export function NavBar() {
    const [grupo, setGrupo] = useState(null)
    useEffect(() => {
        setGrupo(localStorage.getItem('grupo'))
    }, [])
    return (
        <>
            <header>
                <div className="logo">
                <a href="http://localhost:3000/">
                    <img width = '100px' height = '60px' src={logo}/>
                    </a>
                </div>
                <nav>
                    <ul>
                        <li><a href="">Entrarﾠ|ﾠCadastrar</a></li>
                        <li><a href=""><Cart3 size={26}/></a></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}