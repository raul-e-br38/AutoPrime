import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, ActivityIndicator } from 'react-native';
import colors from "../design/colors";
import API_URL from '../services/apiConfig';

export default function CProduto({ nome, marca, quantidade, valor_unitario, valor_total, imagem, id_item, id_produto, onRemover, onComprar, onIncrement, onDecrement }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Resetar estados quando a imagem mudar
    useEffect(() => {
        const imagemLimpa = imagem && typeof imagem === 'string' ? imagem.trim() : null;
        if (imagemLimpa && imagemLimpa !== 'null' && imagemLimpa !== 'undefined' && imagemLimpa !== '') {
            setImageError(false);
            setImageLoading(true);
        } else {
            console.log("[CProduto] Imagem inválida ou vazia:", imagem);
            setImageError(true);
            setImageLoading(false);
        }
    }, [imagem]);

    // Construir URL da imagem e validar
    // Remove espaços em branco e valores vazios
    const imagemLimpa = imagem && typeof imagem === 'string' ? imagem.trim() : null;
    const imageUrl = imagemLimpa && imagemLimpa !== 'null' && imagemLimpa !== 'undefined' && imagemLimpa !== '' 
        ? `${API_URL}/static/imagens/${imagemLimpa}` 
        : null;

    // Timeout para imagens que demoram muito para carregar
    useEffect(() => {
        const imagemLimpa = imagem && typeof imagem === 'string' ? imagem.trim() : null;
        if (imagemLimpa && imagemLimpa !== 'null' && imagemLimpa !== 'undefined' && imagemLimpa !== '' && !imageError) {
            const timeout = setTimeout(() => {
                if (imageLoading) {
                    console.log("[CProduto] Timeout ao carregar imagem:", imagemLimpa);
                    setImageError(true);
                    setImageLoading(false);
                }
            }, 10000); // 10 segundos de timeout

            return () => clearTimeout(timeout);
        }
    }, [imagem, imageLoading, imageError]);

    const handleImageError = () => {
        console.log("[CProduto] Erro ao carregar imagem:", imagem);
        console.log("[CProduto] URL tentada:", imageUrl);
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        console.log("[CProduto] Imagem carregada com sucesso:", imagem);
        setImageLoading(false);
        setImageError(false);
    };

    const handleRemover = () => {
        if (onRemover && id_item) {
            onRemover(id_item);
        }
    };

    const handleComprar = () => {
        if (onComprar) {
            onComprar({
                id_item,
                id_produto,
                quantidade,
                valor_unitario,
                nome
            });
        }
    };

    console.log("[CProduto] Renderizando produto:", { 
        nome, 
        imagem_original: imagem, 
        imagem_limpa: imagemLimpa,
        imageUrl, 
        temImagem: !!imagemLimpa,
        tipo_imagem: typeof imagem
    });

    return (
        <View style={styles.produto}>
            <View style={styles.imageContainer}>
                {imageLoading && imagemLimpa && !imageError && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.azul_vibrante} />
                    </View>
                )}
                {!imageError && imagemLimpa && imageUrl ? (
                    <Image
                        style={[styles.foto, imageLoading && styles.fotoLoading]}
                        source={{ uri: imageUrl }}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        onLoadStart={() => setImageLoading(true)}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Erro ao carregar a imagem</Text>
                    </View>
                )}
            </View>
            <View style={styles.infos}>
            <Text style={styles.nome}>{nome || 'Produto'}</Text>
            <Text style={styles.marca}>Marca: {marca || 'N/A'}</Text>
            <Text style={styles.preco}>Preço Uni: R$ {parseFloat(valor_unitario || 0).toFixed(2)}</Text>
            <Text style={styles.preco}>Preço Total: R$ {parseFloat(valor_total || 0).toFixed(2)}</Text>
            <Text style={styles.quantidade}>Qtd: {quantidade || 0}</Text>
            </View>
            <View style={styles.botoes}>
            {onComprar && (
                <TouchableOpacity style={styles.btnComprar} onPress={handleComprar}>
                    <Text style={styles.btnComprarText}>Comprar</Text>
                </TouchableOpacity>
            )}
            
            {onRemover && (
                <TouchableOpacity style={styles.btnRemover} onPress={handleRemover}>
                    <Text style={styles.btnRemoverText}>Remover</Text>
                </TouchableOpacity>
            )}
            {/*Colocar opção de diminuir e aumentar quantidade*/}
            <View style={styles.qtdRow}>
                <TouchableOpacity style={styles.qtdBtn} onPress={() => onDecrement && onDecrement({ id_item, id_produto, quantidade })}>
                    <Text style={styles.qtdBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantidadeValor}>{quantidade || 0}</Text>
                <TouchableOpacity style={styles.qtdBtn} onPress={() => onIncrement && onIncrement({ id_item, id_produto, quantidade })}>
                    <Text style={styles.qtdBtnText}>+</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    produto: {
        backgroundColor: colors.branco,
        padding: 16,
        width: '95%',
        borderRadius: 5,
        marginBottom: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: { 
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        width:100,
        height:100,
    },
    foto: { 
        width: 100, 
        height: 100, 
        resizeMode: 'contain',
    },
    fotoLoading: {
        opacity: 0.3,
    },
    loadingContainer: {
        position: 'absolute',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    nome: { color: colors.azul_fonte, fontWeight: "500",  },
    marca: { color: colors.azul_fonte,  fontWeight: "500",  },
    preco: { color: colors.azul_fonte, fontWeight: "bold", },
    quantidade: { color: colors.azul_fonte, fontWeight: "500", },
    btnComprar: {
        backgroundColor: colors.azul,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    btnComprarText: {
        color: colors.branco,
        fontSize: 14,
        fontWeight: 'bold',
    },
    btnRemover: {
        backgroundColor: colors.azul_vibrante,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    btnRemoverText: {
        color: colors.branco,
        fontSize: 14,
        fontWeight: 'bold',
    },
    placeholderContainer: { 
        width: 100, 
        height: 100, 
        backgroundColor: colors.cinza_claro, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.cinza,

    },
    placeholderText: { 
        color: colors.cinza_medio, 
        fontSize: 10, 
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    infos:{ flex: 1 },
    botoes:{
        flex: 1
    },
    qtdRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 6 },
    qtdBtn: { backgroundColor: colors.azul_vibrante, width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    qtdBtnText: { color: colors.branco, fontSize: 16, fontWeight: 'bold' },
    quantidadeValor: { color: colors.azul_fonte, fontWeight: "bold", marginHorizontal: 10, minWidth: 26, textAlign: 'center' }
});
