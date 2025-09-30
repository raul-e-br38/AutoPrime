import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreens from './screens/HomeScreens';
import CadastroScreen from "./screens/CadastroScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                {/* Tela de login */}
                <Stack.Screen name="Login" component={LoginScreen} />
                {/* Tela inicial do app */}
                <Stack.Screen name="Home" component={HomeScreens} />
                {/* Tela de cadastro */}
                <Stack.Screen name="Cadastro" component={CadastroScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
