// services/cashbackService.js
import API_URL from "./apiConfig";

const cashbackService = {
    async getCashbackTotal(id_vendedor) {
        const res = await fetch(`${API_URL}/cashback/total/${id_vendedor}`);

        if (!res.ok) {
            const erro = await res.text();
            throw new Error(`Erro ao carregar cashback: ${erro}`);
        }

        const data = await res.json();
        return data.total_cashback || 0;
    }
};

export default cashbackService;
