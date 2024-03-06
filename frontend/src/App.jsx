import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from './pages/login/login';
import { Usuarios } from './pages/usuarios/listar_usuarios';
import { Principal } from './pages/principal/principal';
import { Cadastrar } from './pages/cadastro/cadastro';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/Login' element={<Login></Login>}/>
      <Route path='/Usuarios' element={<Usuarios/>}/>
      <Route path='/Principal' element={<Principal/>}/>
      <Route path='/Cadastrar' element={<Cadastrar/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
