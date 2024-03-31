import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from './pages/login/login';
import { Usuarios } from './pages/usuarios/listar_usuarios';
import { Principal } from './pages/principal/principal';
import { Cadastrar } from './pages/cadastro/cadastro';
import { Editar } from './pages/editar/editar';
import { Produto } from './pages/produto/listar_produto'
import { Visualizar } from './pages/visu/visualizar'
import { CadastroP } from './pages/cadastarProduto/cadastroP';
import { EditarP } from './pages/editarP/editarP';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/Login' element={<Login></Login>}/>
      <Route path='/Usuarios' element={<Usuarios/>}/>
      <Route path='/Principal' element={<Principal/>}/>
      <Route path='/Cadastrar' element={<Cadastrar/>}/>
      <Route path='/Editar/:id' element={<Editar/>}/>
      <Route path='/EditarP/:id' element={<EditarP/>}/>
      <Route path='/CadastrarP' element={<CadastroP/>}/>
      <Route path='/Produto' element={<Produto/>}/>
      <Route path='/Visualizar/:id' element={<Visualizar/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
