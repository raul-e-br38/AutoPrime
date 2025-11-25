import API_URL from "./apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const vendaService = {
    async registrarVenda({ id_cliente, id_vendedor, id_produto, quantidade, valor_unitario }) {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${API_URL}/venda`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_cliente, id_vendedor, id_produto, quantidade, valor_unitario })
        });
        if (!res.ok) {
            const erro = await res.text();
            console.log(erro);

            throw new Error(`Erro ao registrar venda: ${erro}`);
        }
        return res.json();
    }
};

export default vendaService;
