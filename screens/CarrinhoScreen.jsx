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

export default function CarrinhoScreen() {
    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();

    const carregarCarrinho = async () => {
        try {
            const email = await AsyncStorage.getItem("email");
            if (!email) {
                Toast.show({ type: "error", text1: "Erro", text2: "Usuário não logado." });
                setItens([]);
                setLoading(false);
                return;
            }

            const dados = await carrinhoService.listarCarrinho(email);
            console.log("[Carrinho] Dados recebidos:", dados);

            if (dados && Array.isArray(dados.carrinho)) {
                // Log detalhado dos itens para debug
                console.log("[Carrinho] Itens do carrinho:", dados.carrinho);
                
                // ⚠️ SOLUÇÃO TEMPORÁRIA: A API não retorna id_produto no carrinho
                // TODO: Corrigir a API para incluir C.ID_PRODUTO ou P.ID no SELECT da rota /carrinho/<email_cliente>
                // Query atual não inclui: SELECT C.ID_ITEM, P.NOME, P.MARCA, C.QUANTIDADE...
                // Deveria incluir: SELECT C.ID_ITEM, C.ID_PRODUTO, P.NOME, P.MARCA, C.QUANTIDADE...
                
                // Busca todos os produtos para mapear nome -> id_produto (workaround temporário)
                let produtosMap = new Map();
                let produtosList = [];
                try {
                    const produtos = await produtoService.listarProdutos();
                    produtosList = produtos;
                    produtos.forEach(produto => {
                        // Normaliza o nome: lowercase, trim, remove espaços extras
                        const nomeNormalizado = produto.nome.toLowerCase().trim().replace(/\s+/g, ' ');
                        produtosMap.set(nomeNormalizado, produto.id);
                        // Também adiciona variações para melhor matching
                        produtosMap.set(produto.nome.toLowerCase().trim(), produto.id);
                        produtosMap.set(produto.nome.trim(), produto.id);
                    });
                    console.log("[Carrinho] Mapa de produtos criado com", produtosMap.size, "entradas");
                    console.log("[Carrinho] Produtos disponíveis:", produtos.map(p => ({ id: p.id, nome: p.nome })));
                } catch (error) {
                    console.error("[Carrinho] Erro ao buscar produtos para mapeamento:", error);
                }
                
                // Função auxiliar para buscar id_produto de forma flexível
                const buscarIdProduto = (nomeProduto, marca) => {
                    if (!nomeProduto) return null;
                    
                    // Normaliza o nome
                    const nomeNormalizado = nomeProduto.toLowerCase().trim().replace(/\s+/g, ' ');
                    
                    // Tenta busca exata primeiro
                    let id = produtosMap.get(nomeNormalizado);
                    if (id) return id;
                    
                    // Tenta busca case-insensitive
                    id = produtosMap.get(nomeProduto.toLowerCase().trim());
                    if (id) return id;
                    
                    // Tenta busca com o nome original
                    id = produtosMap.get(nomeProduto.trim());
                    if (id) return id;
                    
                    // Busca parcial (contém)
                    if (produtosList.length > 0) {
                        const produtoEncontrado = produtosList.find(p => {
                            const nomeP = p.nome.toLowerCase().trim();
                            const nomeI = nomeProduto.toLowerCase().trim();
                            // Busca exata ou parcial
                            return nomeP === nomeI || nomeP.includes(nomeI) || nomeI.includes(nomeP);
                        });
                        if (produtoEncontrado) {
                            console.log(`[Carrinho] Produto encontrado por busca parcial: ${produtoEncontrado.nome} (ID: ${produtoEncontrado.id})`);
                            return produtoEncontrado.id;
                        }
                    }
                    
                    return null;
                };
                
                // Processa os itens para garantir que a imagem seja encontrada e adiciona id_produto
                const itensProcessados = dados.carrinho.map((item, index) => {
                    // Tenta encontrar a imagem em vários campos possíveis
                    const imagem = item.imagem || 
                                  item.imagem_produto || 
                                  item.imagem_produto_carrinho ||
                                  item.foto ||
                                  item.foto_produto ||
                                  (item.produto && item.produto.imagem) ||
                                  null;
                    
                    // Busca o id_produto através do nome do produto (workaround)
                    let id_produto = item.id_produto || item.id_produto_carrinho;
                    if (!id_produto && item.nome_produto) {
                        id_produto = buscarIdProduto(item.nome_produto, item.marca);
                        if (!id_produto) {
                            console.warn(`[Carrinho] Não foi possível encontrar id_produto para: "${item.nome_produto}"`);
                            console.warn(`[Carrinho] Nome normalizado tentado: "${item.nome_produto.toLowerCase().trim()}"`);
                        } else {
                            console.log(`[Carrinho] id_produto encontrado para "${item.nome_produto}": ${id_produto}`);
                        }
                    }
                    
                    console.log(`[Carrinho] Item ${index}:`, {
                        id_item: item.id_item,
                        nome: item.nome_produto,
                        id_produto_encontrado: id_produto,
                        imagem_encontrada: imagem,
                        todas_props: Object.keys(item),
                        item_completo: item
                    });
                    
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
            Toast.show({ type: "error", text1: "Erro", text2: "Não foi possível carregar o carrinho." });
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
        const itemRemovido = itens.find(item => item.id_item === id_item);
        const nomeProduto = itemRemovido?.nome_produto || "Produto";
        
        console.log("[Carrinho] Iniciando remoção do item:", id_item, "Nome:", nomeProduto);
        
        try {
            // Remove o item da lista localmente primeiro (atualização otimista)
            setItens(prevItens => prevItens.filter(item => item.id_item !== id_item));
            
            const response = await carrinhoService.removerItem(id_item);
            console.log("[Carrinho] Resposta ao remover:", response);
            console.log("[Carrinho] Response tem erro?", !!response?.erro);
            console.log("[Carrinho] Response completo:", JSON.stringify(response));
            
            if (response?.erro) {
                // Se houver erro, restaura o item na lista
                console.log("[Carrinho] Erro ao remover, restaurando item");
                if (itemRemovido) {
                    setItens(prevItens => [...prevItens, itemRemovido]);
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
            console.error("[Carrinho] Erro ao remover item:", error);
            console.error("[Carrinho] Erro completo:", JSON.stringify(error));
            // Restaura o item em caso de erro
            if (itemRemovido) {
                setItens(prevItens => [...prevItens, itemRemovido]);
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

    const comprarItem = async (dadosProduto) => {
        try {
            const email = await AsyncStorage.getItem("email");
            if (!email) {
                Toast.show({ type: "error", text1: "Erro", text2: "Usuário não logado." });
                return;
            }

            let id_produto = dadosProduto.id_produto;

            // Se não tiver id_produto, tenta buscar pelo nome
            if (!id_produto && dadosProduto.nome) {
                try {
                    const produtos = await produtoService.listarProdutos();
                    const produtoEncontrado = produtos.find(p => {
                        const nomeP = p.nome.toLowerCase().trim();
                        const nomeI = dadosProduto.nome.toLowerCase().trim();
                        return nomeP === nomeI || nomeP.includes(nomeI) || nomeI.includes(nomeP);
                    });
                    if (produtoEncontrado) {
                        id_produto = produtoEncontrado.id;
                        console.log(`[Carrinho] id_produto encontrado para "${dadosProduto.nome}": ${id_produto}`);
                    }
                } catch (error) {
                    console.error("[Carrinho] Erro ao buscar produto:", error);
                }
            }

            if (!id_produto) {
                Toast.show({ 
                    type: "error", 
                    text1: "Erro", 
                    text2: "ID do produto não encontrado. Não foi possível realizar a compra." 
                });
                return;
            }

            console.log("[Carrinho] Registrando venda:", {
                email_cliente: email,
                id_produto: id_produto,
                quantidade: dadosProduto.quantidade,
                valor_unitario: dadosProduto.valor_unitario
            });

            const response = await vendaService.registrarVenda(
                email,
                id_produto,
                dadosProduto.quantidade,
                dadosProduto.valor_unitario
            );

            console.log("[Carrinho] Resposta da venda:", response);
            console.log("[Carrinho] Response tem erro?", !!response?.erro);
            console.log("[Carrinho] Response completo:", JSON.stringify(response));

            // Verifica se há erro na resposta
            if (response?.erro) {
                console.log("[Carrinho] Mostrando toast de erro");
                Toast.show({ 
                    type: "error", 
                    text1: "Erro ao comprar", 
                    text2: response.erro || "Não foi possível realizar a compra.",
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 60
                });
            } else {
                // Sucesso - mostra toast
                console.log("[Carrinho] Mostrando toast de sucesso");
                console.log("[Carrinho] Nome do produto:", dadosProduto.nome);
                
                // Força o toast a aparecer
                setTimeout(() => {
                    Toast.show({ 
                        type: "success", 
                        text1: "Produto comprado com sucesso", 
                        text2: dadosProduto.nome || "Produto",
                    });
                }, 100);
                
                // Remove o item do carrinho após compra bem-sucedida
                const itemNoCarrinho = itens.find(item => item.id_produto === dadosProduto.id_produto);
                if (itemNoCarrinho?.id_item) {
                    await removerItem(itemNoCarrinho.id_item);
                } else {
                    await carregarCarrinho();
                }
            }
        } catch (error) {
            console.error("[Carrinho] Erro ao comprar item:", error);
            console.error("[Carrinho] Erro completo:", JSON.stringify(error));
            
            // Se o erro tiver uma resposta com erro, tenta extrair
            let mensagemErro = error.message || "Não foi possível realizar a compra. Tente novamente.";
            if (error.response) {
                try {
                    const errorData = await error.response.json();
                    if (errorData.erro) {
                        mensagemErro = errorData.erro;
                    }
                } catch (e) {
                    // Ignora se não conseguir parsear
                }
            }
            
            Toast.show({ 
                type: "error", 
                text1: "Erro", 
                text2: mensagemErro,
                visibilityTime: 500,
                autoHide: true,
                topOffset: 60
            });
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
                    <View style={styles.listaProdutos}>
                    {itens.map(item => {
                        // Garante que a imagem seja passada corretamente
                        const imagemFinal = item.imagem || item.imagem_produto || null;
                        console.log("[Carrinho] Passando dados para CProduto:", {
                            id_item: item.id_item,
                            id_produto: item.id_produto,
                            nome: item.nome_produto,
                            imagem: imagemFinal,
                            tem_id_produto: !!item.id_produto
                        });
                        
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
                                onComprar={comprarItem}
                            />
                        );
                    })}
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
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10 },
    fot:{
        marginTop:300},
    titulo:{
        fontSize: 20,
        alignSelf: "center",
        margin: 10,
        fontWeight: "bold"},
});
