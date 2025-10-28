import API_URL from './apiConfig'; // Importa o API_URL
// Definindo a URL base da API que será usada nas requisições.
// Aqui, a URL está apontando para um servidor local na rede.


// LOGIN
export async function login(email, senha) {
    // Função assíncrona (async) para realizar o login, que recebe 'email' e 'senha' como parâmetros.
    try {
        // Tenta fazer a requisição HTTP para a API, usando 'fetch'. O 'await' espera a resposta da requisição.
        const response = await fetch(`${API_URL}/login`, {
            // Fazendo uma requisição POST para a URL `${API_URL}/login`, com os dados do usuário.
            method: "POST",
            headers: {
                // Definindo o cabeçalho da requisição para indicar que o corpo está no formato JSON.
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
            // Corpo da requisição com os dados (email e senha) convertidos para formato JSON.
        });

        const data = await response.json();
        // Espera a resposta e a converte para um objeto JavaScript a partir do formato JSON.

        if (!response.ok) {
            // Se a resposta não for bem-sucedida
            // lança um erro com a mensagem contida no campo 'error' da resposta.
            throw new Error(data.error || "Erro ao fazer login");

        }

        return data;
        // Se a requisição for bem-sucedida, retorna os dados da resposta.
        // A resposta geralmente vai conter um objeto com {mensagem, id_cadastro, nome, email, cargo, token}.
    } catch (error) {
        // Caso ocorra algum erro (seja na requisição ou no processo de conversão da resposta),
        // ele será lançado para ser tratado fora da função.
        throw error;

    }
}

// CADASTRO
export async function cadastro(nome, email, cargo, senha) {
    // Função assíncrona para realizar o cadastro, que recebe 'nome', 'email', 'cargo' e 'senha' como parâmetros.
    try {
        // Faz a requisição para a API, assim como na função de login, mas para a URL '/cadastro'.
        const response = await fetch(`${API_URL}/cadastro`, {
            method: "POST", // Método POST para enviar dados ao servidor.
            headers: {
                "Content-Type": "application/json",
                // Cabeçalho informando que o conteúdo enviado está no formato JSON.
            },
            body: JSON.stringify({ nome, email, cargo, senha }),
            // Corpo da requisição com os dados do novo usuário, convertidos para o formato JSON.
        });

        const data = await response.json();
        // Converte a resposta da API em um objeto JavaScript.

        if (!response.ok) {
            // Se a resposta não for bem-sucedida
            // lança um erro com a mensagem de erro recebida da resposta.
            throw new Error(data.error || "Erro ao cadastrar");
        }

        return data;
        // Se o cadastro for bem-sucedido, retorna a resposta da API, que geralmente contém uma mensagem de sucesso.
        // Exemplo de resposta: {mensagem: "Usuário cadastrado com sucesso!"}.
    } catch (error) {
        // Caso ocorra algum erro durante a requisição ou processamento da resposta, o erro é lançado para ser tratado fora.
        throw error;
    }
}
