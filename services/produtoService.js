const API_URL = "http://192.168.1.119:5000";

async function listarProdutos() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar produtos');
        }
        return data.produtos || [];
    } catch (error) {
        console.error("Erro no service listarProdutos:", error);
        return [];
    }
}

export default { listarProdutos }; // export default
