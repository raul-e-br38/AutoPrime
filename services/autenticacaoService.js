const API_URL = "http://10.92.3.168:5000/";

// LOGIN
export async function login(email, senha) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro ao fazer login");
        }

        return data; // vai trazer {mensagem, id_cadastro, nome, email, cargo, token}
    } catch (error) {
        throw error;
    }
}

// CADASTRO
export async function cadastro(nome, email, cargo, senha) {
    try {
        const response = await fetch(`${API_URL}/cadastro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, email, cargo, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro ao cadastrar");
        }

        return data; // {mensagem: "Usuário cadastrado com sucesso!"}
    } catch (error) {
        throw error;
    }
}
