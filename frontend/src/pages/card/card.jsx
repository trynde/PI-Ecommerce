import React, { useState, useEffect } from "react";
import axios from "axios"; // Importa o Axios
import "./card.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Card = (props) => {
  const navegar = useNavigate()
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useParams();
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

  }, []);

  const handleChangeImage = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    // Função para buscar as informações do produto do servidor
    const fetchProductInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/buscarProduto/${props.id}`
        );
        // Verifica se a resposta é bem-sucedida (status 200)
        if (response.status === 200) {
          console.log(response.data)

          setProductInfo(response.data);
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
    <div class="carde">
      <div>
          {images.map((image, index) => {
            console.log(image);
                <img
                  key={index}
                  src={`http://localhost:3005/images/${image.nomeImagem}`}
                  alt={`Imagem ${index + 1}`}
                  width="300px"
                  height="300px"
                />
           
          })}
      </div>
      <div class="card1">
        <p class="card1txt">Nome </p>
        <div class="card2">
          <p class="card2txt1">
            Preço -{" "}
            
          </p>
          <button className="btn" onClick={() => navegar(`/Visualizar/${productInfo.id}`)}>Detalhe</button>
        </div>
      </div>
    </div>
  </>
  );
};

export default Card;