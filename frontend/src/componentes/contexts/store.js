import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../contexts/cartSlice';

// Middleware para salvar o estado no localStorage
const saveToLocalStorage = store => next => action => {
  const result = next(action);
  localStorage.setItem('cartState', JSON.stringify(store.getState().cart));
  return result;
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(saveToLocalStorage),
});

export default store;
