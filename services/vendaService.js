import API_URL from './apiConfig';

// Helper: fetch com timeout e retries exponenciais
async function fetchWithRetry(url, options = {}, { retries = 3, timeoutMs = 9000, backoffMs = 600 } = {}) {
    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;
            const isAbort = error?.name === 'AbortError';
            const isNetworkError = String(error?.message || '').toLowerCase().includes('network request failed');
            if (attempt < retries - 1 && (isAbort || isNetworkError)) {
                const delay = backoffMs * Math.pow(2, attempt) + Math.floor(Math.random() * 250);
                await new Promise(res => setTimeout(res, delay));
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

const vendaService = {
    /**
     * Lista todas as vendas registradas
     * @returns {Promise<Array>} Lista de vendas
     */
    async listarVendas() {
        try {
            const response = await fetchWithRetry(`${API_URL}/vendas`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                },
            });
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
            const payload = {
                email_cliente: String(email_cliente),
                id_produto: Number(id_produto),
                quantidade: Number(quantidade),
                valor_unitario: Number(valor_unitario),
            };

            const response = await fetchWithRetry(`${API_URL}/venda`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                },
                body: JSON.stringify(payload),
            });

            const raw = await response.text();
            let data;
            try { data = JSON.parse(raw); } catch { data = { raw }; }

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





