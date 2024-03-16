import React, { useState } from "react";
import NoteApp from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";

const Stack = createNativeStackNavigator();

const MyStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={NoteApp} options={{ title: "Charax" }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={({ route }) => ({ title: route.params.item })} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

AppRegistry.registerComponent(appName, () => MyStack);

export default MyStack;
