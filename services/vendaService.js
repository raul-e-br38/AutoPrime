// services/vendaService.js
import API_URL from "./apiConfig";

const vendaService = {
    async finalizarCompra(email_cliente) {
        const res = await fetch(`${API_URL}/carrinho/finalizar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email_cliente })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            throw new Error(err?.erro || "Erro ao finalizar compra");
        }

        return await res.json();
    }
};

export default vendaService;
