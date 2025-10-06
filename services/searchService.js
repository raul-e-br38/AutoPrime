// searchService.js
const API_URL = "http://192.168.1.115:5000";

export async function buscarProdutos(nome) {
    try {
        const response = await fetch(`${API_URL}/buscar_produto?nome=${encodeURIComponent(nome)}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar produtos');
        }
        return data.produtos || [];
    } catch (error) {
        throw error;
    }
}
