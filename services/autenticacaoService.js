const API_URL = "http://10.92.3.174:5000"; // Coloque o IP certo da sua máquina

export async function login(email, senha) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.error || "Erro ao fazer login");
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export async function cadastro(nome, email, cargo, senha) {
    try {
        const response = await fetch(`${API_URL}/cadastro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, cargo, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro ao cadastrar");
        }
        return data;
    } catch (error) {
        throw error;
    }
}