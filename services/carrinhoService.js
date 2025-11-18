// services/carrinhoService.js
import API_URL from "./apiConfig";

const carrinhoService = {
    async listarCarrinho(email_cliente) {
        const res = await fetch(`${API_URL}/carrinho/${email_cliente}`);

        if (!res.ok) {
            throw new Error("Erro ao buscar carrinho");
        }

        return await res.json();
    },

    async adicionarAoCarrinho(email_cliente, id_produto, quantidade) {
        const res = await fetch(`${API_URL}/carrinho/adicionar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email_cliente,
                id_produto,
                quantidade
            })
        });

        if (!res.ok) {
            const erro = await res.text();
            throw new Error(`Erro ao adicionar ao carrinho: ${erro}`);
        }

        return await res.json();
    },

    async removerItem(id_item) {
        const res = await fetch(`${API_URL}/carrinho/remover/${id_item}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const erro = await res.text();
            throw new Error(`Erro ao remover item: ${erro}`);
        }

        return await res.json();
    },

    async atualizarQuantidade(id_item, quantidade) {
        const res = await fetch(`${API_URL}/carrinho/atualizar/${id_item}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantidade })
        });

        if (!res.ok) {
            const erro = await res.text();
            throw new Error(`Erro ao atualizar quantidade: ${erro}`);
        }

        return await res.json();
    }
};

export default carrinhoService;