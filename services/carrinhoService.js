// src/services/carrinhoService.js
import API_URL from './apiConfig';

const carrinhoService = {
    async adicionarAoCarrinho(email_cliente, id_produto, quantidade) {
        try {
            const response = await fetch(`${API_URL}/carrinho/adicionar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_cliente, id_produto, quantidade }),
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            throw error;
        }
    },

    async listarCarrinho(email_cliente) {
        try {
            const response = await fetch("http://192.168.1.125:5000/carrinho/teco@gmail.com");
            const dados = await response.json();
            console.log("Teste fetch:", dados);
        } catch (err) {
            console.error("Erro fetch teste:", err);
        }
    },

    async removerItem(id_item) {
        try {
            const response = await fetch(`${API_URL}/carrinho/remover/${id_item}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao remover item do carrinho:', error);
            throw error;
        }
    },
};

export default carrinhoService;
