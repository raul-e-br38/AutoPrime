import API_URL from './apiConfig';

// Helper: fetch com timeout e retries exponenciais (ULTRA ROBUSTO - FORÇA CONEXÃO)
async function fetchWithRetry(url, options = {}, { retries = 10, timeoutMs = 30000, backoffMs = 500 } = {}) {
    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);
            // Verifica se a resposta é válida
            if (response.ok || response.status < 500) {
                return response;
            }
            // Se status de erro, tenta novamente
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;
            const isAbort = error?.name === 'AbortError';
            const isNetworkError = String(error?.message || '').toLowerCase().includes('network request failed');
            const isTimeout = isAbort || isNetworkError || error?.message?.includes('HTTP');
            
            if (attempt < retries - 1 && isTimeout) {
                // Backoff exponencial mais curto inicialmente: 500ms, 1000ms, 2000ms, 4000ms...
                const delay = backoffMs * Math.pow(2, attempt) + Math.floor(Math.random() * 300);
                if (attempt === 0) {
                    console.log(`[fetchWithRetry] Tentando conectar... (${attempt + 1}/${retries})`);
                }
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
            }, { retries: 10, timeoutMs: 30000, backoffMs: 500 });
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
            }, { retries: 10, timeoutMs: 30000, backoffMs: 500 });
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
            }, { retries: 10, timeoutMs: 30000, backoffMs: 500 });
            const text = await response.text();
            try { return JSON.parse(text); } catch { return { raw: text }; }
        } catch (error) {
            console.error('Erro ao remover item do carrinho:', error);
            throw error;
        }
    },
};

export default carrinhoService;
