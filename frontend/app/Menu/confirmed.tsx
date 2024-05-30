import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React from 'react';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function Confirmed() {
    const confirmImage = require("@/assets/images/confirmation.png")
    const navigation = useNavigation()

    return (
        <SafeAreaView style={{
            display: "flex",
            flex: 1,
            paddingHorizontal: 30,
            marginTop: 40,
        }}>
            <Text variant='displayMedium' style={styles.header}>title</Text>
            <View style={styles.container}>
                <Image source={confirmImage} style={styles.image} />
                <Text style={styles.message}>Your Order Has Been Confirmed</Text>
                <Button style={styles.button} onPress={()=>{navigation.navigate("Login" as never)}}><Text style={{color: "white"}}>Go To Home</Text></Button>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
        alignItems:'center'
    },
    header: {
        fontWeight: 'bold',
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 20,
        alignItems:'center',
        justifyContent:'center'
    },
    message: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#027361',
        padding: 10,
        width: '80%',
        borderRadius: 5,
        alignItems:'center',
    },
});
