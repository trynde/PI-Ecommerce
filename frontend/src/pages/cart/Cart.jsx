import React, { useContext } from 'react';
import { CartContext } from "../../componentes/contexts/CartContext";
import { NavBar } from '../../componentes/navbar2/navbar';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  return (
    <>
      <NavBar />
      <div className="container">
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
                <th>Total</th>
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
                  <td>R${product.preco}</td>
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
    </>
  );
};

export default Cart;
