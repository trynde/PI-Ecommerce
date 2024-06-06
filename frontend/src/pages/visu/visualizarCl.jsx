import React, { useState, useEffect } from "react";
import { NavBar1 } from "../../componentes/navbar3/navbar1";
import { NavBar } from '../../componentes/navbar2/navbar';
import axios from "axios";
import "./visualizar.css";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCart } from '../../componentes/contexts/cartSlice';

export const VisualizarCL = () => {
  const navegar = useNavigate();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [clientId, setClientId] = useState(0);

  const [productInfo, setProductInfo] = useState({
    nomeProduto: "",
    descricao: "",
    preco: "",
  });

  useEffect(() => {
    const storedClientId = localStorage.getItem('id');
    if (storedClientId && storedClientId !== "0") {
      setClientId(parseInt(storedClientId));
    }
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/buscarImagem/${id}`);
        if (response.status === 200) {
          setImages(response.data);
        } else {
          console.error("Erro ao buscar imagem:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar imagem:", error.message);
      }
    };

    fetchImage();

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const handleChangeImage = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/buscarProduto/${id}`);
        if (response.status === 200) {
          setProductInfo(response.data[0]);
        } else {
          console.error("Erro ao buscar informações do produto:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar informações do produto:", error.message);
      }
    };

    fetchProductInfo();
  }, [id]);

  const handleBuy = () => {
    console.log('Informações do produto:', productInfo);
    const product = {
      id,
      nomeProduto: productInfo.nomeProduto,
      descricao: productInfo.descricao,
      preco: productInfo.preco,
      quantity: 1 // Definindo a quantidade inicial como 1 ao adicionar ao carrinho
    };

    // Adiciona o produto ao carrinho
    dispatch(addToCart(product));

    // Produto adicionado com sucesso
    alert("Produto adicionado ao carrinho com sucesso!");
  };

  return (
    <>
      {clientId === 0 ? <NavBar /> : <NavBar1 />}
      <div className="product-detail-page">
        <div className="product-images">
          <div className="carousel">
            <Swiper
              pagination={{ dynamicBullets: true }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:3005/images/${image.nomeImagem}`}
                    alt={`Imagem ${index + 1}`}
                    width="300px"
                    height="300px"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="product-info">
          <h2>{productInfo.nomeProduto}</h2>
          <p>{productInfo.descricao}</p>
          <p>Preço: R${productInfo.preco}</p>
          <p>Avaliação: ⭐ {productInfo.avaliacao}</p>
          <button className="btn btn-dark" onClick={handleBuy}>Comprar</button>
        </div>
      </div>
    </>
  );
};

export default VisualizarCL;
