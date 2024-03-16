import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert, BackHandler } from "react-native";
import { MarkdownTextInput } from "@expensify/react-native-live-markdown";
import { styles as homestyles } from "./HomeScreen";

// import RNFS from "react-native-fs";
import * as FileSystem from "expo-file-system";

const ProfileScreen = ({ navigation, route }) => {
    const [initialText, setInitialText] = useState("");
    const [info, setInfo] = useState("");
    const [isEditing, setIsEditing] = useState(false); // Add this line

    useEffect(() => {
        const backAction = () => {
            if (initialText !== info) {
                Alert.alert("Hold on!", "Are you sure you want to go back? You have unsaved changes.", [
                    {
                        text: "Cancel",
                        onPress: () => true, // Prevent the back action
                        style: "cancel",
                    },
                    { text: "YES", onPress: () => navigation.goBack() },
                ]);
                return true; // Prevent the back action
            }
            return false; // Allow the back action
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, [initialText, info]);

    useEffect(() => {
        const fileName = route.params.item + ".txt";
        const path = FileSystem.documentDirectory + fileName;

        // read the file
        FileSystem.readAsStringAsync(path)
            .then((result) => {
                console.log("FILE READ!");
                setInfo(result);
                setInitialText(result);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const saveInfo = async () => {
        const fileName = route.params.item + ".txt";
        const path = FileSystem.documentDirectory + fileName;

        // write the file
        FileSystem.writeAsStringAsync(path, info)
            .then(() => {
                console.log("FILE WRITTEN!");
                Alert.alert("Success", "File saved successfully!");
            })
            .catch((err) => {
                console.log(err.message);
            });
        setInitialText(info);
        setIsEditing(false);
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>{route.params.item}'s Profile</Text> */}

            <ScrollView style={styles.scroll}>
                {isEditing ? (
                    <TextInput
                        style={homestyles.inputContainer}
                        multiline
                        placeholder="Enter information about this person..."
                        value={info}
                        onChangeText={setInfo}
                    />
                ) : (
                    <Text style={homestyles.inputContainer}>{info}</Text>
                )}
            </ScrollView>
            {isEditing ? (
                <Button title="Save Info" onPress={saveInfo} />
            ) : (
                <Button title="Edit" onPress={() => setIsEditing(true)} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    scroll: {
        flex: 1,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        margin: 10,
    },
});

export default ProfileScreen;
