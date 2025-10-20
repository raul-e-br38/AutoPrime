import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import colors from "../design/colors";
import Header from '../components/Header';
import Footer from '../components/Footer';
import BtnGrande from "../components/BtnGrande";

// Definindo o componente ProdutoScreen
export default function ProdutoScreen() {
    const route = useRoute();
    const produto = route.params?.produto;  // Pegando o parâmetro 'produto' da rota
    if (!produto) {
        return (
            <View>
                <Header />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ marginBottom: 600, marginTop: 100 }}>Produto não encontrado.</Text>
                </View>
                <Footer />
            </View>
        );
    }

    // Estado para controlar a quantidade de produto
    const [counter, setCounter] = useState(1);

    const increment = () => setCounter(counter + 1);
    const decrement = () => {
        if (counter > 0) {
            setCounter(counter - 1);
        }
    };


    return (

        <ScrollView>
            <Header />
            <View>
                {/* Imagem do produto */}
                <Image
                    style={styles.imagem}
                    source={{
                        uri: produto.imagem
                            ? `http://192.168.1.122:5000/static/imagens/${produto.imagem}`
                            : 'https://via.placeholder.com/200x200.png?text=Sem+Imagem',
                    }}
                    onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)}
                    onLoad={() => console.log("Imagem carregada com sucesso")}
                />
            </View>

            {/* Nome do produto */}
            <Text style={styles.nome}>{produto.nome}</Text>

            {/* Exibindo a Marca */}
            <Text style={styles.marca1}>Marca: <Text style={styles.marca2}>{produto.marca}</Text> </Text> {/* Exibe a marca do produto */}

            {/* Preço do produto */}
            <Text style={styles.preco}>R${parseFloat(produto.preco).toFixed(2)}</Text>



            {/* Variações do produto */}
            <View style={styles.variacoes}>
                <TouchableOpacity style={styles.variacao}><Text style={styles.textoBtn}>Black Piano</Text></TouchableOpacity>
                <TouchableOpacity style={styles.variacao}><Text style={styles.textoBtn}>Aço Polido</Text></TouchableOpacity>
            </View>

            {/* Contador para aumentar ou diminuir a quantidade do produto */}
            <View style={styles.counterContainer}>
                <TouchableOpacity onPress={decrement} style={styles.counterButton}>
                    <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>

                <View style={styles.counterBox}>
                    <Text style={styles.counterValue}>{counter}</Text>
                </View>

                <TouchableOpacity onPress={increment} style={styles.counterButton}>
                    <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Botão de adicionar ao carrinho */}
            <View style={styles.carrinho}>
                <BtnGrande title={'Adicionar ao Carrinho'} />
            </View>
            <View style={{
                marginVertical: 25,
                height: 1,          // altura da linha
                backgroundColor: 'black', // cor da linha
                width: '100%'       // ocupa toda a largura da tela
            }} />

            {/* Descrição do produto */}
            <Text style={styles.titulo}>Descrição:</Text>
            <Text style={styles.descricao}>{produto.descricao}</Text>

            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    imagem: {
        alignSelf: 'center',
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        margin: 10,
        borderWidth: 0.5,
    },
    nome: {
        fontSize: 25,
        fontWeight: 'light',
        color: colors.azul_fonte,
        margin: 10,
        fontStyle: 'italic',
    },

    preco: {
        fontSize: 30,
        fontWeight: "600",
        color: colors.azul_fonte,
        margin: 10,
    },
    descricao: {
        margin: 10,
        marginBottom: 230,
    },
    carrinho: {
        alignItems: 'center',
        margin: 10,
    },
    variacao: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.azul_vibrante,
        borderRadius: 5,
        padding: 10,
        width: '25%',
        margin: 10,
    },
    textoBtn: {
        color: colors.azul_vibrante,
        fontSize: 13,
    },
    variacoes: {
        flexDirection: 'row',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.azul_vibrante,
        borderRadius: 5,
        margin: 10,
        width: '25%',
        borderTopColor: colors.azul_vibrante,
        borderBottomColor: colors.azul_vibrante,
        borderLeftColor: colors.azul_vibrante,
        borderRightColor: colors.azul_vibrante,
        borderWidth: 2,
    },
    counterButton: {
        padding: 0,
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderColor: colors.azul_vibrante,
        borderWidth: 2,
    },
    counterText: {
        fontSize: 24,
        color: colors.branco,
    },
    counterBox: {
        backgroundColor: colors.branco,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 10,
    },
    counterValue: {
        fontSize: 18,
        color: colors.azul_vibrante,
    },
    titulo:{
        margin: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    marca1:{
        fontSize: 20,
        fontWeight: 'light',
        color: colors.azul_fonte,
        marginHorizontal:10,
        fontStyle: 'italic',
    },
    marca2:{
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.azul_fonte,
        marginHorizontal:10,
        fontStyle: 'italic',
    },
});
