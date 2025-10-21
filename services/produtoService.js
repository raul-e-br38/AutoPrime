
// Define a URL base da API. Neste caso, é um servidor local com IP 192.168.1.122 e porta 5000
import API_URL from './apiConfig'; // Importa o API_URL

// Função assíncrona para listar produtos da API
async function listarProdutos() {
    try {
        // Realiza uma requisição HTTP GET para a rota /produtos da API
        const response = await fetch(`${API_URL}/produtos`);

        // Verifica se a resposta da API não foi bem-sucedida (status HTTP diferente de 2xx)
        if (!response.ok) {
            // Tenta ler o corpo da resposta como JSON, mas se der erro (ex: corpo vazio), retorna objeto vazio
            const data = await response.json().catch(() => ({}));

            // Lança um erro com a mensagem do JSON ou uma mensagem padrão com o status
            throw new Error(data.error || `Erro ao buscar produtos (status ${response.status})`);
        }

        // Converte a resposta para JSON
        const data = await response.json();

        // Loga no console os produtos recebidos, útil para depuração
        console.log("Produtos recebidos da API:", data);

        // Retorna o array de produtos. Se não existir, retorna array vazio
        return data.produtos || [];
    } catch (error) {
        // Captura qualquer erro que aconteceu durante a requisição ou processamento da resposta

        // Mostra no console o erro ocorrido
        console.error("Erro no service listarProdutos:", error);

        // Relança o erro para que o componente que chamou a função possa tratar (ex: exibir toast)
        throw error;
    }
}

// Exporta a função listarProdutos como módulo padrão
export default { listarProdutos };
