import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, ActivityIndicator } from 'react-native';
import colors from "../design/colors";
import API_URL from '../services/apiConfig';

export default function CProduto({ nome, marca, quantidade, valor_unitario, valor_total, imagem, id_item, onRemover }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Resetar estados quando a imagem mudar
    useEffect(() => {
        if (imagem) {
            setImageError(false);
            setImageLoading(true);
        }
    }, [imagem]);

    // Construir URL da imagem e validar
    const imageUrl = imagem ? `${API_URL}/static/imagens/${imagem}` : null;

    // Timeout para imagens que demoram muito para carregar
    useEffect(() => {
        if (imagem && !imageError) {
            const timeout = setTimeout(() => {
                if (imageLoading) {
                    console.log("[CProduto] Timeout ao carregar imagem:", imagem);
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

    console.log("[CProduto] Renderizando produto:", { nome, imagem, imageUrl, temImagem: !!imagem });

    return (
        <View style={styles.produto}>
            <View style={styles.imageContainer}>
                {imageLoading && imagem && !imageError && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.azul_vibrante} />
                    </View>
                )}
                {!imageError && imagem && imageUrl ? (
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

            <Text style={styles.nome}>{nome || 'Produto'}</Text>
            <Text style={styles.marca}>Marca: {marca || 'N/A'}</Text>
            <Text style={styles.preco}>Preço Uni: R$ {parseFloat(valor_unitario || 0).toFixed(2)}</Text>
            <Text style={styles.preco}>Preço Total: R$ {parseFloat(valor_total || 0).toFixed(2)}</Text>
            <Text style={styles.quantidade}>Qtd: {quantidade || 0}</Text>
            
            {onRemover && (
                <TouchableOpacity style={styles.btnRemover} onPress={handleRemover}>
                    <Text style={styles.btnRemoverText}>Remover</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    produto: {
        backgroundColor: colors.branco,
        padding: 20,
        width: '48%',
        borderRadius: 5,
        marginBottom: 10,
    },
    imageContainer: { 
        alignSelf: 'center',
        marginBottom: 15,
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
    nome: { color: colors.azul_fonte, fontWeight: "500", marginBottom: 5 },
    marca: { color: colors.azul_fonte,  fontWeight: "500", marginBottom: 5 },
    preco: { color: colors.azul_fonte, fontWeight: "bold", marginBottom: 5 },
    quantidade: { color: colors.azul_fonte, fontWeight: "500", marginBottom: 10 },
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
});
