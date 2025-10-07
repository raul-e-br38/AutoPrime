import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreens from './screens/HomeScreens';
import CadastroScreen from "./screens/CadastroScreen";
import PerfilScreen from './screens/PerfilScreen';
import Toast from 'react-native-toast-message';
import ProdutoScreen from "./screens/ProdutoScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreens} />
                <Stack.Screen name="Cadastro" component={CadastroScreen} />
                <Stack.Screen name="Perfil" component={PerfilScreen} />
                <Stack.Screen name="Produto" component={ProdutoScreen} />

            </Stack.Navigator>

            <Toast />
        </NavigationContainer>
    );
}
