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
import { VisualizarCL } from './pages/visu/visualizarCl'
import { PrincipalAE } from './pages/principal/principalAE';
import { LoginU } from './pages/login/loginU';
import { CadastrarCli } from './pages/cadastro/cadastroC';
import { PrincipalC } from './pages/principal/principalC';
import { Perfil } from './pages/cliente/Perfil';
import { EditarCliente } from './pages/cliente/editarPerfil';
import { NovoEnd } from './pages/cliente/novoEnd';


function App() {
  return (
    
    <BrowserRouter>
    <Routes>
      <Route path='/Login' element={<Login></Login>}/>
      <Route path='/Entrar' element={<LoginU />}/>
      <Route path='/Usuarios' element={<Usuarios/>}/>
      <Route path='/' element={<Principal/>}/>
      <Route path='/NovoEnd/:id' element={<NovoEnd/>}/>
      <Route path='/Perfil/:id' element={<Perfil/>}/>
      <Route path='/principalAE' element={<PrincipalAE/>}/>
      <Route path='/principalC' element={<PrincipalC/>}/>
      <Route path='/Cadastrar' element={<Cadastrar/>}/>
      <Route path='/CadastrarCli' element={<CadastrarCli/>}/>
      <Route path='/Editar/:id' element={<Editar/>}/>
      <Route path='/EditarCliente/:id' element={<EditarCliente/>}/>
      <Route path='/EditarP/:id' element={<EditarP/>}/>
      <Route path='/CadastrarP' element={<CadastroP/>}/>
      <Route path='/Produto' element={<Produto/>}/>
      <Route path='/Visualizar/:id' element={<Visualizar/>}/>
      <Route path='/VisualizarCL/:id' element={<VisualizarCL/>}/>
    </Routes>
    </BrowserRouter>
  
  );
}

export default App;
