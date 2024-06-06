import { useState } from 'react';
import { NavBar } from '../../componentes/navbar/navbar';
import axios from 'axios';

export function Alterar() {
    const [estadoPagamento, setEstadoPagamento] = useState('');
    const [idCompra, setIdCompra] = useState('');

    const handleChange = (event) => {
        setEstadoPagamento(event.target.value);
    };

    const handleSubmit = async () => {
        if (!idCompra) {
            alert('Por favor, insira o ID da compra.');
            return;
        }

        try {
            await axios.put(`http://localhost:3005/compras/${idCompra}/situacao`, { situacao: estadoPagamento });
            alert('Situação da compra atualizada com sucesso.');
            setEstadoPagamento('');
            setIdCompra('');
        } catch (error) {
            console.error('Erro ao atualizar situação da compra:', error);
            alert('Erro ao atualizar situação da compra. Por favor, tente novamente.');
        }
    };

    return (
        <>
        <NavBar />
        <div className="d-flex justify-content-center align-items-center form-control" style={{ height: '100vh'}}>
            <div>
                <input 
                    type="number" 
                    placeholder="ID da compra" 
                    value={idCompra} 
                    onChange={(event) => setIdCompra(event.target.value)} 
                    className="form-control mb-3" 
                />
                <select value={estadoPagamento} onChange={handleChange} className="form-control mb-3">
                    <option value="">Selecione o estado do pagamento</option>
                    <option value="Pago">Pago</option>
                    <option value="Em tráfego">Em tráfego</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Finalizado">Finalizado</option>
                </select>
                <button onClick={handleSubmit} className="btn btn-primary">Atualizar Situação</button>
            </div>
        </div>
        </>
    );
}
