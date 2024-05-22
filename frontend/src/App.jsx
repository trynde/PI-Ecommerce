import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './componentes/contexts/store';
import { Login } from './pages/login/login';
import { Usuarios } from './pages/usuarios/listar_usuarios';
import { Principal } from './pages/principal/principal';
import { PrincipalAE } from './pages/principal/principalAE';
import { Cadastrar } from './pages/cadastro/cadastro';
import { Editar } from './pages/editar/editar';
import { Produto } from './pages/produto/listar_produto';
import { Visualizar } from './pages/visu/visualizar';
import { CadastroP } from './pages/cadastarProduto/cadastroP';
import { EditarP } from './pages/editarP/editarP';
import { VisualizarCL } from './pages/visu/visualizarCl';
import { LoginU } from './pages/login/loginU';
import { CadastrarCli } from './pages/cadastro/cadastroC';
import { PrincipalC } from './pages/principal/principalC';
import { Perfil } from './pages/cliente/Perfil';
import { EditarCliente } from './pages/cliente/editarPerfil';
import { NovoEnd } from './pages/cliente/novoEnd';
import { Cart } from './pages/cart/Cart';
import ProtectedRoute from '../src/componentes/ProtectedRoute/ProtectedRoute'; //components/ProtectedRoute

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Backend */}
          <Route path='/Login' element={<Login />} />
          <Route path='/Usuarios' element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
          <Route path='/PrincipalAE' element={<ProtectedRoute><PrincipalAE /></ProtectedRoute>} />
          <Route path='/Visualizar/:id' element={<ProtectedRoute><Visualizar /></ProtectedRoute>} />
          <Route path='/Produto' element={<ProtectedRoute><Produto /></ProtectedRoute>} />
          <Route path='/Cadastrar' element={<ProtectedRoute><Cadastrar /></ProtectedRoute>} />
          <Route path='/EditarP/:id' element={<ProtectedRoute><EditarP /></ProtectedRoute>} />
          <Route path='/Editar/:id' element={<ProtectedRoute><Editar /></ProtectedRoute>} />
          
          {/* Cliente */}
          <Route path='/Entrar' element={<LoginU />} />
          <Route path='/' element={<Principal />} />
          <Route path='/NovoEnd/:id' element={<ProtectedRoute><NovoEnd /></ProtectedRoute>} />
          <Route path='/Perfil/:id' element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path='/PrincipalC' element={<ProtectedRoute><PrincipalC /></ProtectedRoute>} />
          <Route path='/CadastrarCli' element={<CadastrarCli />} />
          <Route path='/EditarCliente/:id' element={<ProtectedRoute><EditarCliente /></ProtectedRoute>} />
          <Route path='/CadastrarP' element={<ProtectedRoute><CadastroP /></ProtectedRoute>} />
          <Route path='/VisualizarCL/:id' element={<ProtectedRoute><VisualizarCL /></ProtectedRoute>} />
          <Route path='/Carrinho' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
