// services/cashbackService.js
import API_URL from "./apiConfig";

const cashbackService = {
    /**
     * Busca o valor total de cashback acumulado pelo ID do cliente.
     * @param {number} id_cliente - O ID do cliente.
     * @returns {Promise<number>} O valor total do cashback.
     */
    async getCashbackTotal(id_cliente) {
        if (!id_cliente) {
            console.error("ID do cliente é nulo ou inválido ao buscar cashback.");
            return 0;
        }

        const url = `${API_URL}/cashback/total/${id_cliente}`;
        console.log("LOG CRÍTICO 3: URL de busca de Cashback:", url);

        try {
            const res = await fetch(url);

            if (!res.ok) {
                const erro = await res.text();
                // 🚨 LOG CRÍTICO 4: Se falhar (404/500), mostre o erro do servidor
                console.error("LOG CRÍTICO 4: Falha na API de Cashback. Status:", res.status, "Erro:", erro);
                throw new Error(`Erro ao buscar cashback: ${res.status}`);
            }

            const data = await res.json();
            return data.total_cashback || 0;

        } catch (error) {
            console.error("Erro no cashbackService:", error);
            throw new Error("Falha na comunicação com a API ao buscar cashback.");
        }
    }
};

export default cashbackService;