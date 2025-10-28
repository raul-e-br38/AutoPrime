import API_URL from "./apiConfig";

export async function getUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/cadastro`);
        if (!response.ok) {
            console.error("Erro ao buscar usuários:", response.status);
            throw new Error("Erro ao buscar usuários");
        }

        const data = await response.json();
        // Ajuste de chave: a API retorna { cadastro: [...] }
        const lista = data.cadastro || [];
        const user = lista.find(u => String(u.id_cadastro) === String(id));

        if (!user) {
            console.error("Usuário não encontrado na lista");
            throw new Error("Usuário não encontrado");
        }

        return user;
    } catch (error) {
        throw error;
    }
}

export async function editarUsuario(id, dados) {
    try {
        const body = { id_cadastro: id, ...dados }; // a API espera esse formato
        const response = await fetch(`${API_URL}/edit_cadastro`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro ao editar usuário:", response.status, errorText);
            throw new Error(errorText || "Erro ao editar usuário");
        }

        return await response.json();
    } catch (error) {
        console.error("editarUsuario:", error);
        throw error;
    }
}
