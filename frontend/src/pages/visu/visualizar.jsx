import React, { useState, useEffect } from 'react';
import './visualizar.css';

export const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [buyButtonDisabled, setBuyButtonDisabled] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3005/produtos/${id}')
      .then(response => response.json())
      .then(data => {
        // Aqui você pode manipular os dados recebidos do backend
        // e atualizar o estado do produto
        setProduct(data);
      })
      .catch(error => {
        console.error('Erro ao obter dados do produto:', error);
      });
  }, []);

  const handleChangeImage = (index) => {
    setCurrentIndex(index);
  };

  if (!product) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-images">
        <div className="carousel">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product Image ${index + 1}`}
              onClick={() => handleChangeImage(index)}
              style={{ display: index === currentIndex ? 'block' : 'none' }}
            />
          ))}
        </div>
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Preço: ${product.price.toFixed(2)}</p>
        <p>Avaliação: {product.rating}</p>
        <button disabled={buyButtonDisabled}>Comprar</button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
