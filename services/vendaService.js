// vendaService.js
import API_URL from "./apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const vendaService = {

    // Finaliza a venda para um cliente específico
    async finalizarVenda(email_cliente) {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Token não encontrado. Faça login primeiro.");

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
                throw new Error(`Erro ao finalizar venda: ${erro}`);
            }

            return await res.json();
        } catch (erro) {
            throw erro;
        }
    },

    // Opção extra: finalizar uma venda item a item, caso queira replicar o comportamento do web
    async venderItem(id_cliente, id_produto, quantidade, valor_unitario) {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Token não encontrado. Faça login primeiro.");

            const payload = {
                id_cliente,
                id_vendedor: id_cliente, // se quiser usar mesmo esquema web
                id_produto,
                quantidade,
                valor_unitario
            };

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
                throw new Error(`Erro ao vender item: ${erro}`);
            }

            return await res.json();
        } catch (erro) {
            throw erro;
        }
    }

};

export default vendaService;
