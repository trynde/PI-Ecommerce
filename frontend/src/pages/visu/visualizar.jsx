import React, { useState, useEffect } from 'react';
import './visualizar.css'

export const Visualizar = () => {
  const [images, setImages] = useState([
    'image1.jpg',
    'image2.jpg',
    'image3.jpg'
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [buyButtonDisabled, setBuyButtonDisabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Troca para a próxima imagem no carrossel
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Troca a cada 5 segundos

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const handleChangeImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="product-detail-page">
      <div className="product-images">
        <div className="carousel">
          {images.map((image, index) => (
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
        <h2>Nome do Produto</h2>
        <p>Descrição do produto...</p>
        <p>Preço: $XX.XX</p>
        <p>Avaliação: ⭐⭐⭐⭐</p>
        <button disabled={buyButtonDisabled}>Comprar</button>
      </div>
    </div>
  );
};

export default Visualizar;