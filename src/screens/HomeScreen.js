// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput, Button, FlatList } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Image } from "react-native";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

const NoteApp = ({ navigation }) => {
    const [notes, setNotes] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const path = FileSystem.documentDirectory + "notes.json";

        // read the JSON file
        FileSystem.readAsStringAsync(path)
            .then((result) => {
                console.log("FILE READ!");
                setNotes(JSON.parse(result));
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const addNote = () => {
        const lowerCaseInputValue = inputValue.toLowerCase();
        if (lowerCaseInputValue.trim() !== "" && !notes.map((note) => note.toLowerCase()).includes(lowerCaseInputValue)) {
            const newNotes = [...notes, inputValue];
            setNotes(newNotes);
            setInputValue("");

            const path = FileSystem.documentDirectory + "notes.json";

            // write the JSON file
            FileSystem.writeAsStringAsync(path, JSON.stringify(newNotes))
                .then(() => {
                    console.log("FILE WRITTEN!");
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } else {
            Alert.alert("Error", inputValue + " already exists.");
        }
    };

    const deleteNote = (index) => {
        const fileName = notes[index] + ".txt";
        const path = FileSystem.documentDirectory + fileName;

        // delete the file
        FileSystem.deleteAsync(path)
            .then(() => {
                console.log("FILE DELETED!");
            })
            .catch((err) => {
                console.log(err.message);
            });
        const newNotes = notes.filter((_, i) => i !== index);
        setNotes(newNotes);

        const notespath = FileSystem.documentDirectory + "notes.json";

        // write the JSON file
        FileSystem.writeAsStringAsync(notespath, JSON.stringify(newNotes))
            .then(() => {
                console.log("FILE WRITTEN!");
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                {/* <Button title="Go to Jane's profile" onPress={() => navigation.navigate("Profile", { name: "Jane" })} /> */}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={inputValue}
                        onChangeText={(text) => setInputValue(text)}
                        placeholder="Add character"
                        onSubmitEditing={addNote}
                    />
                    <TouchableOpacity style={styles.button} onPressIn={addNote}>
                        {/* <View style={styles.button}> */}
                        <Text style={styles.buttonText}>+</Text>
                        {/* </View> */}
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={notes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("Profile", { item })}>
                            <View style={styles.inputContainer}>
                                <Image source={{ uri: "https://robohash.org/" + item }} style={styles.image} />
                                <Text style={styles.name}>{item}</Text>
                                <TouchableOpacity activeOpacity={1} style={styles.button} onPressIn={() => deleteNote(index)}>
                                    {/* <View style={styles.button}> */}
                                    <Text style={styles.buttonText}>-</Text>
                                    {/* </View> */}
                                </TouchableOpacity>
                                {/* <Button title="Delete" style={styles.button} onPress={() => deleteNote(index)} /> */}
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default NoteApp;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: StatusBar.currentHeight * 2,
        padding: 20,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    },
    inputContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#841584",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#f8f8f8",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
    },
    textInput: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: "#841584",
        // borderRadius: 10,
        padding: 10,
        fontSize: 18,
        marginRight: 10,
    },
    button: {
        borderWidth: 1,
        borderColor: "#841584",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        backgroundColor: "#841584",
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 30,
        color: "white",
        textAlign: "center",
        // lineHeight: 40,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        width: "50%",
        padding: 10,
    },
});
