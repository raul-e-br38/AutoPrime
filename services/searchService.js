const API_URL = "http://192.168.1.117:5000";
// Define a URL base para a API

export async function buscarProdutos(nome) {
    // Define uma função assíncrona chamada 'buscarProdutos' que recebe o parâmetro 'nome'.
    // A função vai buscar produtos com base no nome fornecido.

    try {
        // Tenta executar o código dentro do bloco 'try'. Se algo der errado, o erro será capturado no bloco 'catch'.

        const response = await fetch(`${API_URL}/buscar_produto?nome=${encodeURIComponent(nome)}`);
        // Faz uma requisição HTTP GET para a URL `${API_URL}/buscar_produto`, passando o parâmetro 'nome' como query string.
        // 'encodeURIComponent' é usado para garantir que o nome seja corretamente codificado para ser usado em uma URL (por exemplo, espaços são convertidos para '%20').

        const data = await response.json();
        // Após a resposta ser recebida, ela é convertida de JSON para um objeto JavaScript usando 'response.json()'.
        // 'await' faz o código esperar que a conversão de JSON seja concluída.

        if (!response.ok) {
            // Verifica se a resposta da requisição não foi bem-sucedida (status HTTP não está no intervalo 200-299).
            // 'response.ok' retorna 'true' se o status HTTP da resposta for 2xx, e 'false' caso contrário.

            throw new Error(data.error || 'Erro ao buscar produtos');
            // Se a resposta não for OK, lança um erro com a mensagem de erro recebida na resposta (se houver) ou uma mensagem padrão: 'Erro ao buscar produtos'.
        }

        return data.produtos || [];
        // Se a resposta for bem-sucedida, retorna a lista de produtos (data.produtos).
        // Se a chave 'produtos' não existir ou for undefined, retorna um array vazio.
    } catch (error) {
        // Se ocorrer algum erro em qualquer parte do processo (seja na requisição, na conversão de JSON ou na lógica de erro), ele será capturado aqui.

        throw error;
        // Relança o erro capturado, para que ele possa ser tratado em outro lugar onde a função 'buscarProdutos' foi chamada.
    }
}
