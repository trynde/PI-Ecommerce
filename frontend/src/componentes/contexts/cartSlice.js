import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id } = action.payload;
      const existingProductIndex = state.cart.findIndex(item => item.id === id);
    
      console.log('Payload recebido:', action.payload);
      if (existingProductIndex !== -1) {
        console.log('Produto existente encontrado:', existingProductIndex);
        state.cart = state.cart.map((item, index) => {
          if (index === existingProductIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        console.log('Carrinho após incrementar a quantidade:', state.cart);
      } else {
        console.log('Novo produto adicionado:', action.payload);
        state.cart = [...state.cart, { ...action.payload, quantity: 1 }]; // Corrigido aqui
        console.log('Carrinho após adicionar o novo produto:', state.cart);
      }
      console.log('Carrinho atualizado após adicionar ao carrinho:', state.cart);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.cart.find(item => item.id === id);
      if (product) {
        product.quantity = quantity;
      }
      console.log('Carrinho atualizado após atualizar quantidade:', state.cart); // Adicionando log aqui
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      console.log('Carrinho atualizado após remover do carrinho:', state.cart); // Adicionando log aqui
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
