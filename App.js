import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreens';
import CadastroScreen from "./screens/CadastroScreen"; // substitui pela tua tela real

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* Tela de login */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                {/* Tela inicial do app */}
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                name="Cadastro"
                component={CadastroScreen}
                options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
