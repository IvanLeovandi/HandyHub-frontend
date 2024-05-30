import { Link, useRouter } from 'expo-router';
import * as React from 'react'
import { View, Image, GestureResponderEvent } from "react-native";
import { Text, TextInput,Button, Checkbox, Snackbar } from 'react-native-paper'
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
    const[username, setUsername] = React.useState("")
    const[password, setPassword] = React.useState("")
    const [checked, setChecked] = React.useState(false);
    const[isSecure, setIsSecure] = React.useState(true)
    const [visible, setVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const router = useRouter();

    const loginHandler = async (event: GestureResponderEvent) => {
        event.preventDefault();
        
        try {
            const response = await fetch("https://handyhub-backend-production.up.railway.app/auth/login", {
                method: "POST",
                body: JSON.stringify({
                username: username,
                password: password,
                }),
                headers: {
                "Content-Type": "application/json",
                },
            });
        
            if (response.status === 422) {
                throw new Error("Validation failed");
            }

            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Username or password is incorrect");
            }
        
            const result = await response.json();
            await AsyncStorage.setItem("token", result.token);
            await AsyncStorage.setItem("userId", result.userId);
            const remainingMilisecond = 60 * 60 * 1000;
            const expiryDate = new Date().getTime() + remainingMilisecond;
            await AsyncStorage.setItem("expiryDate", expiryDate.toString());
            router.replace("/")
            
            } catch (err) {
                setErrorMessage(err.message || "An error occurred");
                setVisible(true);
            }
        };
        
    const onDismissSnackBar = () => setVisible(false);
    
    const logo = require("@/assets/images/splash.png")

    return (
        <View
        style={{
            backgroundColor: '#027361',
            paddingTop: 20,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
        }}
        >
            <Image source={logo} style={{
                width: 200,
                height: 200
            }}/>
            <View style={{
                backgroundColor: '#fff',
                width: '80%',
                paddingHorizontal: 12,
                borderWidth: 1,
                borderRadius: 16,
                borderColor: '#000',
                height: '60%',
                display: "flex",
                alignItems: "center"
            }}>
                <Text variant="headlineLarge" style={{fontWeight: 'bold', marginTop: 20, marginBottom: 30, textAlign: 'center'}}>Login</Text>
                <TextInput label={"Username"} style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    marginHorizontal: 10,
                    marginVertical: 10,
                    width: "90%"
                }}
                onChangeText={(username) => setUsername(username)}
                mode="outlined"/>
                <TextInput label={"Password"} style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    marginHorizontal: 10,
                    marginVertical: 10,
                    width: "90%"
                }}
                onChangeText={(password) => setPassword(password)}
                mode="outlined"
                secureTextEntry={isSecure}
                />
                <View style={{display:"flex", flexDirection: "row", alignItems: "center", justifyContent:"flex-start", width: "95%"}}>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                            setIsSecure(!isSecure)
                    }}/>
                    <Text>Show password</Text>
                </View>
                <Button mode="contained" style={{
                    backgroundColor: "#027361",
                    width: "80%",
                    marginVertical: 20
                }} onPress={loginHandler}>
                    Login
                </Button>
                <Text variant="bodySmall" style={{ marginTop: 20, textAlign: 'center'}}>Don't have an account?<Link href={"Menu/register"} style={{ fontWeight: 'bold'}}> Register Now</Link></Text>
            </View>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={3000}
                style={{ backgroundColor: 'red' }}
            >
                {errorMessage}
            </Snackbar>
        </View>
    )
}
