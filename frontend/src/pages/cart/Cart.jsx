import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavBar } from '../../componentes/navbar3/navbar';
import { useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart } from '../../componentes/contexts/cartSlice';
import axios from 'axios';

export const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  console.log('Estado do carrinho:', cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado para armazenar o valor do frete selecionado
  const [frete, setFrete] = useState(0);
  // Estado para armazenar os endereços do cliente
  const [enderecos, setEnderecos] = useState([]);
  // Estado para armazenar o endereço selecionado
  const [enderecoSelecionado, setEnderecoSelecionado] = useState('');
  // Estado para armazenar a forma de pagamento selecionada
  const [formaPagamento, setFormaPagamento] = useState('');
  // Estado para os dados do cartão de crédito
  const [numeroCartao, setNumeroCartao] = useState('');
  const [codigoVerificador, setCodigoVerificador] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [quantidadeParcelas, setQuantidadeParcelas] = useState(1);

  // Função para calcular o total do carrinho, incluindo o frete
  const calcularTotal = () => {
    // Se o carrinho estiver vazio, o total dos produtos é zero
    if (cart.length === 0) {
      return 0;
    }
    
    let totalProdutos = cart.reduce((acc, product) => acc + (product.preco * product.quantity), 0);
    return totalProdutos + frete;
  };

  useEffect(() => {
    // Função para buscar os endereços do cliente
    const fetchEnderecos = async () => {
      try {
        // Buscar o ID do cliente do localStorage
        const cliente_id = localStorage.getItem('id');
        console.log('ID do cliente:', cliente_id);
        const response = await axios.get(`http://localhost:3005/enderecosCompra/${cliente_id}`);
        console.log('Resposta da API:', response.data);
        setEnderecos(response.data);
        // Se houver endereços disponíveis, defina o primeiro como selecionado
        if (response.data.length > 0) {
          setEnderecoSelecionado(response.data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
      }
    };
  
    fetchEnderecos();
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleEnderecoChange = (e) => {
    setEnderecoSelecionado(e.target.value);
  };

  const handleFormaPagamentoChange = (e) => {
    setFormaPagamento(e.target.value);
  };

  const handleFinalizarCompra = () => {
    // Lógica para finalizar a compra
    if (formaPagamento === 'boleto' || (formaPagamento === 'cartao' && numeroCartao && codigoVerificador && nomeCompleto && dataVencimento && quantidadeParcelas > 0)) {
      console.log('Pedido final validado. Prosseguindo para a próxima etapa.');
      // Aqui você pode fazer a transição para a próxima etapa, como validar o pedido
    } else {
      console.error('Por favor, selecione uma forma de pagamento e preencha os campos obrigatórios.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <h1>Carrinho de Compras</h1>
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((product) => (
                    <tr key={product.id}>
                      <td>{product.nomeProduto}</td>
                      <td>
                        <button onClick={() => handleQuantityChange(product.id, product.quantity - 1)}>-</button>
                        {product.quantity}
                        <button onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>+</button>
                      </td>
                      <td>R${(product.preco)}</td>
                      <td>
                        <button onClick={() => handleRemove(product.id)}>Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button className="btn btn-dark" onClick={() => navigate('/')}>Voltar para a loja</button>
          </div>
          <div className="col-md-4">
            <div className="endereco">
              <h3>Selecione o Endereço:</h3>
              <select value={enderecoSelecionado} onChange={handleEnderecoChange}>
                <option value="">Selecione um endereço</option>
                {enderecos.map((endereco) => (
                  <option key={endereco.id} value={endereco.id}>{endereco.endereco}, {endereco.numero}, {endereco.cidade}, {endereco.estado}</option>
                ))}
              </select>
            </div>
            <div className="forma-pagamento">
              <br/>
              <h3>Forma de Pagamento:</h3>
              <div>
                <label>
                  <input
                    type="radio"
                    name="formaPagamento"
                    value="boleto"
                    checked={formaPagamento === 'boleto'}
                    onChange={handleFormaPagamentoChange}
                  />
                  Boleto
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="formaPagamento"
                    value="cartao"
                    checked={formaPagamento === 'cartao'}
                    onChange={handleFormaPagamentoChange}
                  />
                  Cartão de Crédito
                </label>
              </div>
            </div>
            {formaPagamento === 'cartao' && (
              <div className="cartao-info">
                <input
                  type="text"
                  placeholder="Número do Cartão"
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Código Verificador"
                  value={codigoVerificador}
                  onChange={(e) => setCodigoVerificador(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Data de Vencimento"
                  value={dataVencimento}
                  onChange={(e) => setDataVencimento(e.target.value)}
                />
                <p>Quantidade de parcelas</p>
                <input
                  type="number"
                  placeholder="Quantidade de Parcelas"
                  value={quantidadeParcelas}
                  onChange={(e) => setQuantidadeParcelas(Number(e.target.value))}
                />
              </div>
            )}
            <div className="frete">
              <br/>
              <h3>Frete:</h3>
              <select value={frete} onChange={(e) => setFrete(Number(e.target.value))}>
                <option value={0}>Selecione o frete</option>
                <option value={5}>R$5,00 - 30 dias</option>
                <option value={10}>R$10,00 - 15 dias</option>
                <option value={15}>R$15,00 - Express</option>
              </select>
            </div>
            <div className="finalizar-compra">
              <br/>
              <h3>Resumo da Compra</h3>
              <p>Total dos produtos: R${(calcularTotal() - frete).toFixed(2)}</p>
              <p>Frete: R${frete.toFixed(2)}</p>
              <p>Total a pagar: R${calcularTotal().toFixed(2)}</p>
              <button className="btn btn-success" onClick={handleFinalizarCompra}>Finalizar Compra</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;