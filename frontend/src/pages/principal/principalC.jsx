import { NavBar1 } from "../../componentes/navbar3/navbar1";
import "./principal.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function PrincipalC() {
  const navegar = useNavigate();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState(null);

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
        const response = await axios.get(`http://localhost:3005/listarProdutosImagens`);
        // Verifica se a resposta é bem-sucedida (status 200)
        if (response.status === 200) {
          console.log(response.data);

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
    <NavBar1/>

        {productInfo === null ? (
          <h1>Carregando</h1>
        ) : (
      <div className="divPrincipal">
            {productInfo.map((produto, index) => {
              console.log(productInfo)
              return (
                <div className="card1" key={index}>
                  <p className="card1txt">{produto.nomeProduto} </p>
                  <img
                    src={`http://localhost:3005/images/${produto.nomeImagem}`}
                    width="150px"
                    height="150px"
                  />
                  <p className="card2txt1">R$ {produto.preco} </p>
                  <button
                    className="btn"
                    onClick={() => navegar(`/VisualizarCL/${produto.id}`)}
                  >
                    Detalhe
                  </button>
                </div>
              );
            })}
          </div>
        )}
    </>
  );
}
