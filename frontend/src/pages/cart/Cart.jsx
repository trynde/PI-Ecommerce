import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavBar } from '../../componentes/navbar2/navbar';
import { useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart } from '../../componentes/contexts/cartSlice';

export const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  console.log('Estado do carrinho:', cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado para armazenar o valor do frete selecionado
  const [frete, setFrete] = useState(0);

  useEffect(() => {
    console.log('Carrinho atualizado:', cart);
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Função para calcular o total do carrinho, incluindo o frete
  const calcularTotal = () => {
    // Se o carrinho estiver vazio, o total dos produtos é zero
    if (cart.length === 0) {
      return 0;
    }
    
    let totalProdutos = cart.reduce((acc, product) => acc + (product.preco * product.quantity), 0);
    return totalProdutos + frete;
  };

  const handleFinalizarCompra = () => {
    // Lógica para finalizar a compra
    console.log('Compra finalizada');
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
                      <td>R${(product.preco * product.quantity).toFixed(2)}</td>
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
            <div className="frete">
              <h3>Frete:</h3>
              <select value={frete} onChange={(e) => setFrete(Number(e.target.value))}>
                <option value={0}>Selecione o frete</option>
                <option value={5}>R$5,00</option>
                <option value={10}>R$10,00</option>
                <option value={15}>R$15,00</option>
              </select>
            </div>
            <div className="finalizar-compra">
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
