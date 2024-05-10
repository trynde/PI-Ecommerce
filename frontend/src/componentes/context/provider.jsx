import React, { useState } from 'react';
import propTypes from 'prop-types';
import {AppContext} from '../context/appContext';

function Provider({ children }) {

    const [carrinho, setCarrinho] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemsComprar, setCartItemsComprar] = useState([]);


    const value = {
        cartItems,
        setCartItems,
        carrinho,
        setCarrinho,
        isCartVisible,
        setIsCartVisible,
        cartItemsComprar,
        setCartItemsComprar
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export default Provider;

Provider.propTypes = {
    children: propTypes.any,
}.isRequired;