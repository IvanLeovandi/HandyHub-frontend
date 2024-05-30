import { Link, useRouter } from 'expo-router';
import * as React from 'react'
import { View, Image } from "react-native";
import { Text, TextInput, Button } from 'react-native-paper'

export default function Registered() {
    const logo = require("@/assets/images/splash.png")
    const router = useRouter()
    const navigateToLogin = () => {
        router.push('Menu/login');
    };
    return (
        <View
        style={{
            backgroundColor: '#027361',
            paddingTop: 20,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        >
            <View style={{
                backgroundColor: '#fff',
                width: '80%',
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderWidth: 1,
                borderRadius: 16,
                borderColor: '#000',
                height: '55%',
                display: "flex",
                alignItems: "center"
            }}>
                <Image source={logo} style={{
                width: 200,
                height: 200
            }}/>
                <Text variant="headlineSmall" style={{ marginVertical: 16, textAlign: 'center'}}>You have successfully registered your account</Text>
                <Button style={{
                    backgroundColor: "#027361",
                    paddingHorizontal: 64,
                    paddingVertical: 2,
                }}
                    onPress={navigateToLogin}>
                    <Text style={{
                        color: "white"
                    }}>
                        Login
                    </Text>
                </Button>
            </View>
        </View>
    )
}
