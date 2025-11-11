import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import carrinhoService from "../services/carrinhoService";
import vendaService from "../services/vendaService";
import produtoService from "../services/produtoService";
import colors from "../design/colors";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CProduto from "../components/CProduto";
import BtnGrande from "../components/BtnGrande";

export default function CarrinhoScreen() {
    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [comprando, setComprando] = useState(false);
    const isFocused = useIsFocused();
    const totalCarrinho = itens.reduce((acc, it) => acc + (parseFloat(it.valor_total) || 0), 0);

    const alterarQuantidade = async ({ id_item, id_produto, quantidade }, delta) => {
        try {
            const email = await AsyncStorage.getItem("email");
            if (!email) {
                Toast.show({ type: "error", text1: "Erro", text2: "Usuário não logado." });
                return;
            }
            if (delta === -1 && (quantidade || 0) <= 1) {
                await removerItem(id_item);
                return;
            }
            // chamada API primeiro (evita flicker)
            await carrinhoService.adicionarAoCarrinho(email, id_produto, delta);
            // aplica localmente após sucesso
            setItens(prev => prev.map(it => {
                if (it.id_item !== id_item) return it;
                const nova = (it.quantidade || 0) + delta;
                const vu = parseFloat(it.valor_unitario) || 0;
                return { ...it, quantidade: nova, valor_total: Math.max(0, vu * nova) };
            }));
        } catch (e) {
            Toast.show({ type: "error", text1: "Erro", text2: "Falha ao atualizar quantidade." });
        }
    };

    const carregarCarrinho = async () => {
        try {
            setLoading(true);
            const email = await AsyncStorage.getItem("email");
            if (!email) {
                Toast.show({ type: "error", text1: "Erro", text2: "Usuário não logado." });
                setItens([]);
                setLoading(false);
                return;
            }

            // Carrega dados do carrinho e produtos em paralelo para ser mais rápido
            const [dados, produtosResult] = await Promise.allSettled([
                carrinhoService.listarCarrinho(email),
                Promise.race([
                    produtoService.listarProdutos(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000))
                ]).catch(() => null) // Se falhar, retorna null sem bloquear
            ]);

            // Processa resultado do carrinho
            const dadosCarrinho = dados.status === 'fulfilled' ? dados.value : null;

            if (dadosCarrinho && Array.isArray(dadosCarrinho.carrinho)) {
                // Processa produtos (se disponível)
                let produtosMap = new Map();
                let produtosList = [];
                
                if (produtosResult.status === 'fulfilled' && produtosResult.value && Array.isArray(produtosResult.value)) {
                    produtosList = produtosResult.value;
                    produtosList.forEach(produto => {
                        const nomeNormalizado = produto.nome.toLowerCase().trim().replace(/\s+/g, ' ');
                        produtosMap.set(nomeNormalizado, produto.id);
                        produtosMap.set(produto.nome.toLowerCase().trim(), produto.id);
                        produtosMap.set(produto.nome.trim(), produto.id);
                    });
                }
                
                // Função auxiliar para buscar produto (e obter id/imagem) de forma flexível
                const buscarProdutoPorNome = (nomeProduto, marca) => {
                    if (!nomeProduto) return null;
                    
                    // Normaliza o nome
                    const nomeNormalizado = nomeProduto.toLowerCase().trim().replace(/\s+/g, ' ');
                    
                    // Tenta busca exata primeiro
                    let id = produtosMap.get(nomeNormalizado);
                    if (id) {
                        const found = produtosList.find(p => p.id === id);
                        return found || null;
                    }
                    
                    // Tenta busca case-insensitive
                    id = produtosMap.get(nomeProduto.toLowerCase().trim());
                    if (id) {
                        const found = produtosList.find(p => p.id === id);
                        return found || null;
                    }
                    
                    // Tenta busca com o nome original
                    id = produtosMap.get(nomeProduto.trim());
                    if (id) {
                        const found = produtosList.find(p => p.id === id);
                        return found || null;
                    }
                    
                    // Busca parcial (contém)
                    if (produtosList.length > 0) {
                        const produtoEncontrado = produtosList.find(p => {
                            const nomeP = p.nome.toLowerCase().trim();
                            const nomeI = nomeProduto.toLowerCase().trim();
                            // Busca exata ou parcial
                            return nomeP === nomeI || nomeP.includes(nomeI) || nomeI.includes(nomeP);
                        });
                        if (produtoEncontrado) return produtoEncontrado;
                    }
                    
                    return null;
                };
                
                // Processa os itens para garantir que a imagem seja encontrada e adiciona id_produto
                const itensProcessados = dadosCarrinho.carrinho.map((item, index) => {
                    // Tenta encontrar a imagem em vários campos possíveis
                    let imagem = item.imagem || 
                                  item.imagem_produto || 
                                  item.imagem_produto_carrinho ||
                                  item.foto ||
                                  item.foto_produto ||
                                  (item.produto && item.produto.imagem) ||
                                  null;
                    
                    // Busca o produto (id e imagem) através do nome do produto (workaround)
                    let id_produto = item.id_produto || item.id_produto_carrinho;
                    let produtoRef = null;
                    if (!id_produto && item.nome_produto && produtosList.length > 0) {
                        produtoRef = buscarProdutoPorNome(item.nome_produto, item.marca);
                        if (produtoRef?.id) {
                            id_produto = produtoRef.id;
                        }
                    }
                    // Se ainda não há imagem, tenta obter do produto encontrado
                    if (!imagem && (produtoRef || produtosList.length > 0)) {
                        const p = produtoRef || produtosList.find(p => String(p.id) === String(id_produto));
                        if (p?.imagem) {
                            imagem = p.imagem;
                        }
                    }
                    
                    // Item processado com sucesso
                    
                    // Retorna o item com a imagem e id_produto garantidos
                    return {
                        ...item,
                        imagem: imagem,
                        id_produto: id_produto
                    };
                });
                
                setItens(itensProcessados);
            } else {
                console.error("[Carrinho] Resposta inválida:", dados);
                setItens([]);
                Toast.show({ type: "error", text1: "Erro", text2: "Não foi possível carregar os itens." });
            }
        } catch (err) {
            console.error("[Carrinho] Erro ao buscar carrinho:", err);
            if (itens.length === 0) {
                Toast.show({ 
                    type: "error", 
                    text1: "Erro de conexão", 
                    text2: "Não foi possível carregar o carrinho",
                    visibilityTime: 2000
                });
            }
            setItens([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            carregarCarrinho();
        }
    }, [isFocused]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        carregarCarrinho();
    }, []);

    const removerItem = async (id_item) => {
        // Salva o item antes de remover para poder restaurar em caso de erro
        const indexOriginal = itens.findIndex(item => item.id_item === id_item);
        const itemRemovido = indexOriginal >= 0 ? itens[indexOriginal] : null;
        const nomeProduto = itemRemovido?.nome_produto || "Produto";
        
        // Removendo item do carrinho
        
        try {
            // Remove o item da lista localmente primeiro (atualização otimista)
            setItens(prevItens => {
                const idx = prevItens.findIndex(i => i.id_item === id_item);
                if (idx === -1) return prevItens;
                const novo = [...prevItens];
                novo.splice(idx, 1);
                return novo;
            });
            
            const response = await carrinhoService.removerItem(id_item);
            
            if (response?.erro) {
                // Se houver erro, restaura o item na lista
                if (itemRemovido && indexOriginal >= 0) {
                    setItens(prevItens => {
                        const novo = [...prevItens];
                        const pos = Math.min(indexOriginal, novo.length);
                        novo.splice(pos, 0, itemRemovido);
                        return novo;
                    });
                }
                Toast.show({ 
                    type: "error", 
                    text1: "Erro ao remover", 
                    text2: response.erro || "Não foi possível remover o produto.",
                    visibilityTime: 2000,
                    autoHide: true
                });
            } else {
                // Exibe toast de sucesso
                console.log("[Carrinho] Produto removido com sucesso, mostrando toast");
                console.log("[Carrinho] Nome do produto removido:", nomeProduto);
                
                // Força o toast a aparecer com um pequeno delay
                setTimeout(() => {
                    Toast.show({ 
                        type: "success", 
                        text1: "Produto removido", 
                        text2: nomeProduto,
                        visibilityTime: 2000,
                        autoHide: true
                    });
                }, 100);
                
                // Recarrega a lista para garantir sincronização
                await carregarCarrinho();
            }
        } catch (error) {
            console.error("[Carrinho] Erro ao remover item:", error.message);
            // Restaura o item em caso de erro
            if (itemRemovido && indexOriginal >= 0) {
                setItens(prevItens => {
                    const novo = [...prevItens];
                    const pos = Math.min(indexOriginal, novo.length);
                    novo.splice(pos, 0, itemRemovido);
                    return novo;
                });
            }
            Toast.show({ 
                type: "error", 
                text1: "Erro", 
                text2: "Não foi possível remover o produto. Tente novamente.",
                visibilityTime: 2000,
                autoHide: true
            });
        }
    };

    const comprarTudo = async () => {
        if (comprando) return; // Evita múltiplas execuções simultâneas
        
        try {
            setComprando(true);
            const email = await AsyncStorage.getItem("email");
            if (!email) {
                Toast.show({ type: "error", text1: "Erro", text2: "Usuário não logado." });
                setComprando(false);
                return;
            }
            if (itens.length === 0) {
                Toast.show({ type: "info", text1: "Carrinho vazio" });
                setComprando(false);
                return;
            }

            // Snapshot estável para processar (evita problemas de concorrência)
            const snapshot = [...itens];
            let comprados = 0;
            let falhas = 0;
            const itensRemovidos = new Set(); // Rastreia itens já removidos do UI
            
            // Processa cada item sequencialmente (não em paralelo)
            for (const item of snapshot) {
                // Pula se já foi processado
                if (itensRemovidos.has(item.id_item)) {
                    continue;
                }
                try {
                    // Garante id_produto (fallback por nome se necessário)
                    let idp = item.id_produto;
                    if (!idp && item.nome_produto) {
                        try {
                            const produtos = await produtoService.listarProdutos();
                            const p = produtos.find(px => {
                                const a = (px.nome || "").toLowerCase().trim();
                                const b = (item.nome_produto || "").toLowerCase().trim();
                                return a === b || a.includes(b) || b.includes(a);
                            });
                            if (p?.id) idp = p.id;
                        } catch (e) {
                            console.error("[ComprarTudo] Erro ao buscar produto por nome:", e);
                        }
                    }
                    
                    if (!idp) {
                        console.warn("[ComprarTudo] Item sem id_produto, pulando:", item.nome_produto);
                        falhas++;
                        continue;
                    }
                    
                    // Registra venda com retry robusto (até 5 tentativas, mais agressivo)
                    let vendaOk = false;
                    for (let tentativa = 0; tentativa < 5 && !vendaOk; tentativa++) {
                        try {
                            const response = await vendaService.registrarVenda(
                                email,
                                idp,
                                Number(item.quantidade || 1),
                                Number(item.valor_unitario || 0)
                            );
                            
                            // Verifica se a resposta indica sucesso
                            if (response && !response.erro) {
                                vendaOk = true;
                                // Venda registrada com sucesso
                            } else {
                                throw new Error(response?.erro || "Erro desconhecido na venda");
                            }
                        } catch (error) {
                            const isNetworkError = String(error?.message || '').toLowerCase().includes('network');
                            // Tentativa falhou, aguardando antes de retry
                            if (tentativa < 4 && isNetworkError) {
                                // Backoff exponencial mais longo: 1000ms, 2000ms, 4000ms, 8000ms
                                const delay = 1000 * Math.pow(2, tentativa);
                                await new Promise(r => setTimeout(r, delay));
                            } else if (tentativa < 4) {
                                // Para outros erros, delay menor
                                await new Promise(r => setTimeout(r, 500));
                            }
                        }
                    }
                    
                    if (!vendaOk) {
                        console.error(`[ComprarTudo] Falha ao registrar venda após 5 tentativas: ${item.nome_produto}`);
                        falhas++;
                        continue;
                    }
                    
                    comprados++;
                    
                    // Remove do backend (com retry) - tenta remover do carrinho
                    if (item.id_item) {
                        let removido = false;
                        for (let tentativa = 0; tentativa < 3 && !removido; tentativa++) {
                            try {
                                const resp = await carrinhoService.removerItem(item.id_item);
                                if (resp && !resp.erro) {
                                    removido = true;
                                } else {
                                    throw new Error(resp?.erro || "Erro ao remover");
                                }
                            } catch (error) {
                                if (tentativa < 2) {
                                    await new Promise(r => setTimeout(r, 500 * (tentativa + 1)));
                                }
                            }
                        }
                    }
                    
                    // Remove do UI imediatamente após venda bem-sucedida
                    itensRemovidos.add(item.id_item);
                    setItens(prev => prev.filter(i => i.id_item !== item.id_item));
                    
                } catch (e) {
                    console.error("[ComprarTudo] Erro inesperado ao processar item:", e);
                    falhas++;
                }
            }
            
            // Feedback final
            if (comprados > 0) {
                const mensagem = falhas > 0 
                    ? `${comprados} comprado(s), ${falhas} falha(s)`
                    : `${comprados} item(ns) comprado(s) com sucesso!`;
                Toast.show({ 
                    type: "success", 
                    text1: "Compra concluída", 
                    text2: mensagem,
                    visibilityTime: 3000
                });
            } else {
                Toast.show({ 
                    type: "error", 
                    text1: "Falha", 
                    text2: "Nenhum item foi comprado. Verifique sua conexão.",
                    visibilityTime: 3000
                });
            }
            
            // Sincroniza o carrinho no final (apenas uma vez)
            try {
                await carregarCarrinho();
            } catch (e) {
                console.error("[ComprarTudo] Erro ao sincronizar carrinho:", e);
            }
            
        } catch (e) {
            console.error("[ComprarTudo] Erro geral:", e);
            Toast.show({ 
                type: "error", 
                text1: "Erro", 
                text2: "Não foi possível comprar tudo. Tente novamente.",
                visibilityTime: 3000
            });
        } finally {
            setComprando(false);
        }
    };


    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.azul_vibrante} />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Header />
            <Text style={styles.titulo}>Seu Carrinho 🛒</Text>
            {itens.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{ fontSize: 18 }}>Carrinho vazio</Text>
                </View>
            ) : (
                <>
                    <Text>Total do carrinho: R$ {totalCarrinho.toFixed(2)}</Text>
                    <View style={styles.listaProdutos}>
                    {itens.map(item => {
                        // Garante que a imagem seja passada corretamente
                        const imagemFinal = item.imagem || item.imagem_produto || null;
                        
                        return (
                            <CProduto
                                key={item.id_item}
                                id_item={item.id_item}
                                id_produto={item.id_produto}
                                nome={item.nome_produto}
                                marca={item.marca}
                                quantidade={item.quantidade}
                                valor_unitario={parseFloat(item.valor_unitario) || 0}
                                valor_total={parseFloat(item.valor_total) || 0}
                                imagem={imagemFinal}
                                onRemover={removerItem}
                                onIncrement={(info) => alterarQuantidade(info, +1)}
                                onDecrement={(info) => alterarQuantidade(info, -1)}
                            />
                        );
                    })}
                    </View>
                    <View style={styles.comprarTudoBox}>
                        <BtnGrande 
                            title={comprando ? 'Comprando...' : 'Comprar tudo'} 
                            onPress={comprando ? () => {} : comprarTudo}
                        />
                    </View>
                </>
            )}
            {itens.length <= 2 ? (
            <View style={styles.fot}>
                <Footer />
            </View>
            ) : (
                <Footer />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50
    },
    listaProdutos: {
        flexDirection: "column",
        padding: 10 },
    fot:{
        marginTop:300},
    titulo:{
        fontSize: 20,
        alignSelf: "center",
        margin: 10,
        fontWeight: "bold"},
    comprarTudoBox:{
        paddingHorizontal: 10,
        marginTop: 6,
        marginBottom: 10,
        alignItems: 'center'
    }
});
