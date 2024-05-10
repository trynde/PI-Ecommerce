import { NavBar } from "../../componentes/navbar2/navbar";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // Importa o Axios
import "./visualizar.css";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../componentes/context/appContext';

export const VisualizarCL = () => {
  const navegar = useNavigate()
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [buyButtonDisabled, setBuyButtonDisabled] = useState(true);
  const { id } = useParams();
  const { carrinho, setCarrinho, cartItems,setCartItems } = useContext(AppContext);
  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
    setCartItems([...cartItems,produto])
};
  const [productInfo, setProductInfo] = useState({
    nomeProduto: "",
    descricao: "",
    preco: "",
  });

  useEffect(() => {
    // Função para buscar a imagem do servidor
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/buscarImagem/${id}`
        );
        // Verifica se a resposta é bem-sucedida (status 200)
        if (response.status === 200) {
          // Atualiza o estado de imagens com a URL da imagem recebida do servidor
          console.log(response);
          setImages(response.data);
        } else {
          console.error("Erro ao buscar imagem:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar imagem:", error.message);
      }
    };

    fetchImage(); // Chama a função de busca de imagem ao montar o componente

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

  useEffect(() => {
    // Função para buscar as informações do produto do servidor
    const fetchProductInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/buscarProduto/${id}`
        );
        // Verifica se a resposta é bem-sucedida (status 200)
        if (response.status === 200) {
          console.log(response.data)

          setProductInfo(response.data[0]);
        } else {
          console.error(
            "Erro ao buscar informações do produto:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Erro ao buscar informações do produto:", error.message);
      }
    };

    fetchProductInfo(); // Chama a função de busca de informações do produto ao montar o componente
  }, []);

  return (
    <>
    <NavBar/>
    <div className="product-detail-page">
      <div className="product-images">
        <div className="carousel">
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {images.map((image, index) => {
              console.log(image);
              return (
                <SwiperSlide>
                  <img
                    key={index}
                    src={`http://localhost:3005/images/${image.nomeImagem}`}
                    alt={`Imagem ${index + 1}`}
                    width="300px"
                    height="300px"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
      <div className="product-info">
        <h2>{productInfo.nomeProduto}</h2>
        <p>{productInfo.descricao}</p>
        <p>Preço: R${productInfo.preco}</p>
        <p>Avaliação: ⭐ {productInfo.avaliacao}</p>
        <button onClick={() => navegar(`/Carrinho`)} className="btn btn-dark">Comprar</button>
        <button className='btn btn-danger' onClick={() => {
                                        adicionarAoCarrinho(productInfo)
                                        return (
                                            <NavBar data={carrinho} />

                                        )
                                    }}>
                                        Adicionar ao Carrinho
                                    </button>
      </div>
    </div>
    </>
  );
};

export default VisualizarCL;
