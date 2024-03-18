import React, { useState, useRef } from 'react';
import axios from 'axios';
import { NavBar } from '../../componentes/navbar/navbar';

export const CadastroP = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    rating: 0,
    images: [],
    mainImageId: null,
  });

  const formRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const updatedImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file
    }));
    setProduct({ ...product, images: [...product.images, ...updatedImages] });
  };

  const handleImageRemove = (id) => {
    const updatedImages = product.images.filter(image => image.id !== id);
    setProduct({
      ...product,
      images: updatedImages,
      mainImageId: product.mainImageId === id ? null : product.mainImageId,
    });
  };

  const handleMainImageSelect = (id) => {
    setProduct({ ...product, mainImageId: id });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    product.images.forEach(image => {
      formData.append('file', image.file);
    });

    try {
      const response = await axios.post('http://localhost:3005/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Resposta do servidor:', response.data);

      setProduct({
        name: '',
        description: '',
        price: '',
        rating: 0,
        images: [],
        mainImageId: null
      });

      formRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao enviar imagem:', error.message);
    }
  };

  const handleMouseWheel = (event) => {
    if (event.deltaY > 0) {
      window.scrollBy(0, 100);
    } else {
      window.scrollBy(0, -100);
    }
  };

  const generateRatingOptions = () => {
    const options = [];
    for (let i = 0; i <= 10; i++) {
      options.push((i / 2).toFixed(1));
    }
    return options;
  };

  const style = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    input: {
      marginBottom: '10px',
      width: '100%',
      padding: '8px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    textarea: {
      marginBottom: '10px',
      width: '100%',
      padding: '8px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    imageInput: {
      marginBottom: '10px',
    },
    previewImageContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    previewImage: {
      maxWidth: '200px',
      maxHeight: '200px',
      marginRight: '10px',
    },
    removeButton: {
      padding: '5px',
      backgroundColor: '#ff0000',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
    },
    mainImageLabel: {
      marginRight: '10px',
    },
    ratingSelect: {
      marginBottom: '10px',
    },
    scrollToBottomTarget: {
      marginTop: '100vh',
    },
  };

  return (
    <>
      <NavBar />
      <div style={style.container} onWheel={handleMouseWheel}>
        <div ref={formRef}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nome:</label>
            <input
              style={style.input}
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
            />

            <label htmlFor="description">Descrição:</label>
            <textarea
              style={style.textarea}
              name="description"
              value={product.description}
              onChange={handleInputChange}
            />

            <label htmlFor="price">Preço:</label>
            <input
              style={style.input}
              type="text"
              name="price"
              value={product.price}
              onChange={handleInputChange}
            />

            <label htmlFor="Avaliação">Avaliação:</label>
            <select
              style={style.input}
              name="rating"
              value={product.rating}
              onChange={handleInputChange}
            >
              {generateRatingOptions().map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <label htmlFor="images" style={style.imageInput}>
              Images:
            </label>
            <input
              style={style.imageInput}
              type="file"
              accept="image/*"
              name="images"
              onChange={handleImageChange}
              multiple
            />
            {product.images.map(image => (
              <div key={image.id} style={style.previewImageContainer}>
                <img
                  src={URL.createObjectURL(image.file)}
                  alt={`Product Image ${image.id}`}
                  style={style.previewImage}
                />
                <button
                  style={style.removeButton}
                  type="button"
                  onClick={() => handleImageRemove(image.id)}
                >
                  X
                </button>
                <label style={style.mainImageLabel}>
                  <input
                    type="radio"
                    name="mainImage"
                    checked={product.mainImageId === image.id}
                    onChange={() => handleMainImageSelect(image.id)}
                  />
                  Imagem Principal
                </label>
              </div>
            ))}
            <button style={style.button} type="submit">
              Submit
            </button>
          </form>
        </div>
        <div style={style.scrollToBottomTarget} />
      </div>
    </>
  );
};

export default CadastroP;
