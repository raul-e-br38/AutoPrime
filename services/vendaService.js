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

const vendaService = {

    async finalizarVenda(email_cliente) {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                showToast("Token não encontrado. Faça login primeiro.");
                throw new Error("Token não encontrado");
            }

            const res = await fetch(`${API_URL}/carrinho/finalizar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email_cliente })
            });

            if (!res.ok) {
                const erro = await res.text();
                showToast(`Erro ao finalizar venda: ${erro}`);
                throw new Error(erro);
            }

            return await res.json();
        } catch (erro) {
            showToast(erro.message || "Erro ao finalizar venda");
            throw erro;
        }
    },

    async venderItem(id_cliente, id_produto, quantidade, valor_unitario) {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                showToast("Token não encontrado. Faça login primeiro.");
                throw new Error("Token não encontrado");
            }

            const payload = { id_cliente, id_vendedor: id_cliente, id_produto, quantidade, valor_unitario };
            const res = await fetch(`${API_URL}/venda`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const erro = await res.text();
                showToast(`Erro ao vender item: ${erro}`);
                throw new Error(erro);
            }

            return await res.json();
        } catch (erro) {
            showToast(erro.message || "Erro ao vender item");
            throw erro;
        }
    }
};

export default vendaService;
