import API_URL from "./apiConfig";

// -----------------------------------------------------
// BUSCAR ID DO USUÁRIO PELO EMAIL (necessário p/ carrinho)
// -----------------------------------------------------
async function buscarID(email) {
    const response = await fetch(`${API_URL}/buscar_id/${email}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar ID do cliente");
    }

    const data = await response.json();
    return data; // deve retornar { id_cliente: X }
}

// -----------------------------------------------------
// BUSCAR USUÁRIO POR ID (caso precise em outra tela)
// -----------------------------------------------------
export async function getUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/cadastro`);

        if (!response.ok) {
            throw new Error("Erro ao buscar usuários");
        }

        const data = await response.json();
        const lista = data.cadastro || [];
        const user = lista.find(u => String(u.id_cadastro) === String(id));

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return user;
    } catch (error) {
        throw error;
    }
}

// -----------------------------------------------------
// EDITAR USUÁRIO
// -----------------------------------------------------
export async function editarUsuario(id, dados) {
    try {
        const body = { id_cadastro: id, ...dados };

        const response = await fetch(`${API_URL}/edit_cadastro`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao editar usuário");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// -----------------------------------------------------
// EXPORT DEFAULT (somente o necessário)
// -----------------------------------------------------
export default { buscarID };
