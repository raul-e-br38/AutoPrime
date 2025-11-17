import API_URL from './apiConfig';

const vendaService = {
    async finalizarCompra(email_cliente) {
        try {
            const response = await fetch(`${API_URL}/carrinho/finalizar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email_cliente })
            });

            const text = await response.text();

            let data;
            try { data = JSON.parse(text); }
            catch { data = { raw: text }; }

            if (!response.ok) {
                throw new Error(data?.erro || "Erro ao finalizar compra");
            }

            return data;

        } catch (error) {
            console.error("Erro ao finalizar compra:", error);
            throw error;
        }
    }
};

export default vendaService;
