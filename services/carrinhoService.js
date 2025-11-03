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
            const response = await fetch(`${API_URL}/carrinho/${email_cliente}`);
            const dados = await response.json();
            return dados; // Retorna o JSON para o componente usar
        } catch (err) {
            console.error("Erro fetch teste:", err);
            throw err;
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
