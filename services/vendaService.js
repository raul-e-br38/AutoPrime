import API_URL from './apiConfig';

const vendaService = {
    /**
     * Lista todas as vendas registradas
     * @returns {Promise<Array>} Lista de vendas
     */
    async listarVendas() {
        try {
            const response = await fetch(`${API_URL}/vendas`);
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.erro || `Erro ao buscar vendas (status ${response.status})`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao listar vendas:', error);
            throw error;
        }
    },

    /**
     * Registra uma nova venda
     * @param {string} email_cliente - Email do cliente
     * @param {number} id_produto - ID do produto
     * @param {number} quantidade - Quantidade do produto
     * @param {number} valor_unitario - Preço unitário do produto
     * @returns {Promise<Object>} Resposta da API com dados da venda e cashback
     */
    async registrarVenda(email_cliente, id_produto, quantidade, valor_unitario) {
        try {
            const response = await fetch(`${API_URL}/venda`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email_cliente,
                    id_produto,
                    quantidade,
                    valor_unitario
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || `Erro ao registrar venda (status ${response.status})`);
            }

            return data;
        } catch (error) {
            console.error('Erro ao registrar venda:', error);
            throw error;
        }
    },
};

export default vendaService;

