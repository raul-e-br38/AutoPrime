import API_URL from "./apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const showToast = (msg) => {
    Toast.show({
        type: "error",
        text1: msg,
        position: "top",
        visibilityTime: 3000
    });
};

const carrinhoService = {

    async buscarCarrinho(email_cliente) {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/carrinho/${email_cliente}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const erro = await res.text();
                showToast(`Cliente Não Encontrado: ${erro}`);
                throw new Error(erro);
            }
            return await res.json();
        } catch (erro) {
            showToast(erro.message || "Erro ao buscar carrinho");
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
                showToast(`Erro ao adicionar item: ${erro}`);
                throw new Error(erro);
            }
            return await res.json();
        } catch (erro) {
            showToast(erro.message || "Erro ao adicionar item");
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
                showToast(`Erro ao atualizar quantidade: ${erro}`);
                throw new Error(erro);
            }
            return await res.json();
        } catch (erro) {
            showToast(erro.message || "Erro ao atualizar quantidade");
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
                showToast(`Erro ao remover item: ${erro}`);
                throw new Error(erro);
            }
            return await res.json();
        } catch (erro) {
            showToast(erro.message || "Erro ao remover item");
            throw erro;
        }
    },

    async limparCarrinho() {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${API_URL}/carrinho/limpar`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const erro = await res.text();
                showToast(`Erro ao limpar carrinho: ${erro}`);
                throw new Error(erro);
            }
            return await res.json();
        } catch (erro) {
            showToast(erro.message || "Erro ao limpar carrinho");
            throw erro;
        }
    }

};

export default carrinhoService;
