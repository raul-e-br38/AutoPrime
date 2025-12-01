import API_URL from "./apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const carrinhoService = {

    async buscarCarrinho(email_cliente) {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/carrinho/${email_cliente}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const erro = await res.text();
                throw new Error(`Erro ao buscar carrinho: ${erro}`);
            }
            return await res.json();
        } catch (erro) {
            throw erro;
        }
    },

    async adicionarAoCarrinho(email_cliente, id_produto, quantidade) {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/carrinho/adicionar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email_cliente, id_produto, quantidade })
            });
            if (!res.ok) {
                const erro = await res.text();
                throw new Error(`Erro ao adicionar item: ${erro}`);
            }
            return await res.json();
        } catch (erro) {
            throw erro;
        }
    },

    async atualizarQuantidade(id_item, quantidade) {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/carrinho/atualizar/${id_item}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ quantidade })
            });
            if (!res.ok) {
                const erro = await res.text();
                throw new Error(`Erro ao atualizar quantidade: ${erro}`);
            }
            return await res.json();
        } catch (erro) {
            throw erro;
        }
    },

    async removerItem(id_item) {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/carrinho/remover/${id_item}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const erro = await res.text();
                throw new Error(`Erro ao remover item: ${erro}`);
            }
            return await res.json();
        } catch (erro) {
            throw erro;
        }
    },

    async limparCarrinho() {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/carrinho/limpar`, {
                method: "POST", // trocar DELETE para POST
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const erro = await res.text();
                throw new Error(`Erro ao limpar carrinho: ${erro}`);
            }
            return await res.json();
        } catch (erro) {
            throw erro;
        }
    }


};

export default carrinhoService;
