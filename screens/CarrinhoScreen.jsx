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
    const PENDING_SALES_KEY = "@pending_sales";

    const getPendingSales = async () => {
        try {
            const raw = await AsyncStorage.getItem(PENDING_SALES_KEY);
            if (!raw) return [];
            return JSON.parse(raw);
        } catch {
            return [];
        }
    };

    const savePendingSales = async (list) => {
        try {
            await AsyncStorage.setItem(PENDING_SALES_KEY, JSON.stringify(list));
        } catch (e) {
            console.log("[Carrinho][Offline] Falha ao salvar fila:", e);
        }
    };

    const enqueueSale = async (sale) => {
        const list = await getPendingSales();
        list.push({ ...sale, enqueuedAt: Date.now() });
        await savePendingSales(list);
    };

    // Tenta enviar vendas pendentes periodicamente e ao focar a tela
    const flushPendingSales = async () => {
        try {
            const email = await AsyncStorage.getItem("email");
            if (!email) return;
            let list = await getPendingSales();
            if (!Array.isArray(list) || list.length === 0) return;
            console.log(`[Carrinho][Offline] Tentando reenviar ${list.length} venda(s) pendentes`);
            const succeededIdx = [];
            for (let i = 0; i < list.length; i++) {
                const s = list[i];
                try {
                    const resp = await vendaService.registrarVenda(s.email_cliente, s.id_produto, s.quantidade, s.valor_unitario);
                    if (!resp?.erro) {
                        succeededIdx.push(i);
                    }
                } catch (e) {
                    // Mantém na fila
                }
            }
            if (succeededIdx.length > 0) {
                // Remove as que deram certo
                const newList = list.filter((_, idx) => !succeededIdx.includes(idx));
                await savePendingSales(newList);
                Toast.show({ type: "success", text1: "Compras pendentes enviadas", text2: `Processadas: ${succeededIdx.length}` });
                // Sincroniza carrinho
                await carregarCarrinho();
            }
        } catch (e) {
            // Silencioso
        }
    };

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
                const itensProcessados = dados.carrinho.map((item, index) => {
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
                    if (!id_produto && item.nome_produto) {
                        produtoRef = buscarProdutoPorNome(item.nome_produto, item.marca);
                        if (!produtoRef?.id) {
                            console.warn(`[Carrinho] Não foi possível encontrar id_produto para: "${item.nome_produto}"`);
                            console.warn(`[Carrinho] Nome normalizado tentado: "${item.nome_produto.toLowerCase().trim()}"`);
                        } else {
                            id_produto = produtoRef.id;
                            console.log(`[Carrinho] id_produto encontrado para "${item.nome_produto}": ${id_produto}`);
                        }
                    }
                    // Se ainda não há imagem, tenta obter do produto encontrado
                    if (!imagem && (produtoRef || produtosList.length > 0)) {
                        const p = produtoRef || produtosList.find(p => String(p.id) === String(id_produto));
                        if (p?.imagem) {
                            imagem = p.imagem;
                            console.log(`[Carrinho] Imagem definida via produto: ${imagem}`);
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
            // tenta flush ao focar
            flushPendingSales();
        }
    }, [isFocused]);

    useEffect(() => {
        // Intervalo para tentar enviar pendências
        const id = setInterval(() => {
            flushPendingSales();
        }, 10000); // a cada 10s
        return () => clearInterval(id);
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        carregarCarrinho();
    }, []);

    const removerItem = async (id_item) => {
        // Salva o item antes de remover para poder restaurar em caso de erro
        const indexOriginal = itens.findIndex(item => item.id_item === id_item);
        const itemRemovido = indexOriginal >= 0 ? itens[indexOriginal] : null;
        const nomeProduto = itemRemovido?.nome_produto || "Produto";
        
        console.log("[Carrinho] Iniciando remoção do item:", id_item, "Nome:", nomeProduto);
        
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
            console.log("[Carrinho] Resposta ao remover:", response);
            console.log("[Carrinho] Response tem erro?", !!response?.erro);
            console.log("[Carrinho] Response completo:", JSON.stringify(response));
            
            if (response?.erro) {
                // Se houver erro, restaura o item na lista
                console.log("[Carrinho] Erro ao remover, restaurando item");
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
            console.error("[Carrinho] Erro ao remover item:", error);
            console.error("[Carrinho] Erro completo:", JSON.stringify(error));
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

    const comprarItem = async (dadosProduto) => {
        try {
            const email = await AsyncStorage.getItem("email");
            if (!email) {
                Toast.show({ type: "error", text1: "Erro", text2: "Usuário não logado." });
                return;
            }

            let id_produto = dadosProduto.id_produto;
            const id_item = dadosProduto.id_item;

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

            const payload = {
                email_cliente: email,
                id_produto: id_produto,
                quantidade: Number(dadosProduto.quantidade || 1),
                valor_unitario: Number(dadosProduto.valor_unitario || 0),
            };
            console.log("[Carrinho] Registrando venda:", payload);

            // Tenta algumas vezes além do retry interno do serviço
            let response;
            let success = false;
            const MAX_LOCAL_TRIES = 2;
            for (let i = 0; i < MAX_LOCAL_TRIES; i++) {
                try {
                    response = await vendaService.registrarVenda(
                        payload.email_cliente,
                        payload.id_produto,
                        payload.quantidade,
                        payload.valor_unitario
                    );
                    if (!response?.erro) {
                        success = true;
                        break;
                    }
                } catch (e) {
                    // espera breve antes de tentar de novo
                    await new Promise(r => setTimeout(r, 800));
                }
            }

            console.log("[Carrinho] Resposta da venda:", response);
            console.log("[Carrinho] Response tem erro?", !!response?.erro);

            // Verifica se há erro na resposta
            if (!success || response?.erro) {
                console.log("[Carrinho] Mostrando toast de erro");
                // Fallback: enfileira compra para enviar quando a rede voltar
                await enqueueSale(payload);
                // Remoção otimista do item (opcional para “forçar” a compra)
                if (id_item) {
                    setItens(prev => prev.filter(i => i.id_item !== id_item));
                }
                setTimeout(() => {
                    Toast.show({ 
                        type: "info", 
                        text1: "Compra pendente", 
                        text2: "Será enviada quando a conexão voltar.",
                        visibilityTime: 2500,
                    });
                }, 100);
                Toast.show({ 
                    type: "error",
                    text1: "Rede instável",
                    text2: "Tentaremos automaticamente em segundo plano.",
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
                
                // Remove o item do carrinho após compra bem-sucedida, priorizando id_item
                if (id_item) {
                    await removerItem(id_item);
                } else {
                    const itemNoCarrinho = itens.find(item => item.id_produto === id_produto);
                    if (itemNoCarrinho?.id_item) {
                        await removerItem(itemNoCarrinho.id_item);
                    } else {
                        await carregarCarrinho();
                    }
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
                text2: "Erro de conexão, tente novamente.",
                visibilityTime: 2000,
                autoHide: true,
                topOffset: 60
            });
            // Enfileira fallback mesmo em exceções inesperadas
            try {
                const email = await AsyncStorage.getItem("email");
                const id_produto = dadosProduto.id_produto;
                if (email && id_produto) {
                    await enqueueSale({
                        email_cliente: email,
                        id_produto: Number(id_produto),
                        quantidade: Number(dadosProduto.quantidade || 1),
                        valor_unitario: Number(dadosProduto.valor_unitario || 0),
                    });
                }
            } catch {}
        }
    };

    const comprarTudo = async () => {
        try {
            const email = await AsyncStorage.getItem("email");
            if (!email) {
                Toast.show({ type: "error", text1: "Erro", text2: "Usuário não logado." });
                return;
            }
            if (itens.length === 0) {
                Toast.show({ type: "info", text1: "Carrinho vazio" });
                return;
            }
            // Snapshot estável para processar
            const snapshot = [...itens];
            let comprados = 0;
            for (const item of snapshot) {
                try {
                    // Garante id_produto
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
                        } catch {}
                    }
                    if (!idp) continue;
                    // Registra venda (com leve retry local para rede ruim)
                    let ok = false;
                    for (let t = 0; t < 2 && !ok; t++) {
                        try {
                            await vendaService.registrarVenda(
                                email,
                                idp,
                                Number(item.quantidade || 1),
                                Number(item.valor_unitario || 0)
                            );
                            ok = true;
                        } catch (_) {
                            await new Promise(r => setTimeout(r, 600));
                        }
                    }
                    if (!ok) continue;
                    comprados += 1;
                    // Remove no backend primeiro
                    if (item.id_item) {
                        try {
                            await carrinhoService.removerItem(item.id_item);
                        } catch (_) {
                            // tenta novamente uma vez
                            try { await carrinhoService.removerItem(item.id_item); } catch {}
                        }
                    }
                    // Remove localmente após confirmação
                    setItens(prev => prev.filter(i => i.id_item !== item.id_item));
                } catch (e) {
                    // continua tentando próximos
                }
            }
            if (comprados > 0) {
                Toast.show({ type: "success", text1: "Compra concluída", text2: `Itens comprados: ${comprados}` });
            } else {
                Toast.show({ type: "error", text1: "Falha", text2: "Nenhum item foi comprado" });
            }
            // Sincroniza apenas uma vez no final
            await carregarCarrinho();
        } catch (e) {
            Toast.show({ type: "error", text1: "Erro", text2: "Não foi possível comprar tudo." });
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
                                onIncrement={(info) => alterarQuantidade(info, +1)}
                                onDecrement={(info) => alterarQuantidade(info, -1)}
                            />
                        );
                    })}
                    </View>
                    <View style={styles.comprarTudoBox}>
                        <BtnGrande title={'Comprar tudo'} onPress={comprarTudo} />
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
