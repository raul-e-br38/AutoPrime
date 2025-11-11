import API_URL from './apiConfig';

// Helper: fetch com timeout e retries exponenciais
async function fetchWithRetry(url, options = {}, { retries = 3, timeoutMs = 8000, backoffMs = 600 } = {}) {
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

const carrinhoService = {
    async adicionarAoCarrinho(email_cliente, id_produto, quantidade) {
        try {
            const response = await fetchWithRetry(`${API_URL}/carrinho/adicionar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_cliente, id_produto, quantidade }),
            }, { retries: 3, timeoutMs: 9000, backoffMs: 600 });
            const text = await response.text();
            try { return JSON.parse(text); } catch { return { raw: text }; }
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            throw error;
        }
    },

    async listarCarrinho(email_cliente) {
        try {
            const emailSafe = encodeURIComponent(email_cliente);
            const response = await fetchWithRetry(`${API_URL}/carrinho/${emailSafe}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                },
            }, { retries: 3, timeoutMs: 9000, backoffMs: 600 });
            const text = await response.text();
            let dados;
            try { dados = JSON.parse(text); } catch { dados = { raw: text }; }
            return dados; // Retorna o JSON para o componente usar
        } catch (err) {
            console.error("Erro fetch teste:", err);
            throw err;
        }
    },


    async removerItem(id_item) {
        try {
            const response = await fetchWithRetry(`${API_URL}/carrinho/remover/${id_item}`, {
                method: 'DELETE',
            }, { retries: 3, timeoutMs: 9000, backoffMs: 600 });
            const text = await response.text();
            try { return JSON.parse(text); } catch { return { raw: text }; }
        } catch (error) {
            console.error('Erro ao remover item do carrinho:', error);
            throw error;
        }
    },
};

export default carrinhoService;
