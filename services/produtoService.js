const API_URL = "http://192.168.1.117:5000";
// Define a URL base da API, que neste caso é um servidor local na rede com o endereço IP 192.168.1.115 e a porta 5000.

async function listarProdutos() {
    // Declara uma função assíncrona chamada 'listarProdutos' que vai buscar uma lista de produtos na API.
    try {
        // Tenta executar o código dentro do bloco 'try'. Se ocorrer algum erro, será tratado no 'catch'.

        const response = await fetch(`${API_URL}/produtos`);
        // Realiza uma requisição HTTP GET para a URL `${API_URL}/produtos` usando 'fetch'.
        // O 'await' faz com que o código aguarde a resposta da requisição antes de continuar.

        const data = await response.json();
        // Após a resposta ser recebida, a função 'response.json()' converte o corpo da resposta (que está no formato JSON) para um objeto JavaScript.
        // O 'await' aqui espera que a conversão do JSON seja concluída.

        if (!response.ok) {
            // Verifica se a resposta da requisição não foi bem-sucedida (se o status HTTP não for 2xx).
            // O 'response.ok' é um atalho para checar se o status HTTP é no intervalo 200-299.

            throw new Error(data.error || 'Erro ao buscar produtos');
            // Se a resposta não for OK, lança um erro.
            // O erro lançado terá a mensagem 'data.error' (se existir) ou 'Erro ao buscar produtos' como mensagem padrão.
        }

        return data.produtos || [];
        // Retorna a lista de produtos que vem da resposta (data.produtos).
        // Caso a chave 'produtos' não exista ou esteja vazia, retorna um array vazio.
    } catch (error) {
        // Se algum erro ocorrer durante o processo (seja na requisição ou no processamento dos dados),
        // o erro será capturado aqui.

        console.error("Erro no service listarProdutos:", error);
        // Imprime no console a mensagem de erro com uma descrição do erro ocorrido.

        return [];
        // Em caso de erro, retorna um array vazio como fallback, para evitar que a aplicação quebre.
    }
}

export default { listarProdutos };
// Exporta a função 'listarProdutos' como o valor padrão do módulo.

