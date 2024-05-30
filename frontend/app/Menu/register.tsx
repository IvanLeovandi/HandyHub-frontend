import { Link, useRouter } from "expo-router";
import * as React from "react";
import { View, Image, StyleSheet, ScrollView, GestureResponderEvent, TouchableOpacity } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const[email, setEmail]=React.useState("")
  const[name, setName]=React.useState("")
  const[phoneNumber, setPhoneNumber]=React.useState("")
  const[address, setAddress]=React.useState("")
  const[username, setUsername]=React.useState("")
  const[password, setPassword]=React.useState("")
  const[image, setImage] = React.useState<(string | null)>("");

  const router =useRouter()

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled && result.assets) {
        setImage(result.assets[0].uri);
    }
  };

  const signupHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();
    // Create a new FormData instance
    const formData = new FormData();
        
    // Append service details to formData
    formData.append('email', email);
    formData.append('name', name);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('username', username);
    formData.append('password', password);


    const fileName = image?.split('/').pop();
    if (fileName) {
        const fileType = image?.includes('jpg') || image?.includes('jpeg') ? 'image/jpeg' : 'image/png';
    
        formData.append('image', {
            uri: image,
            name: fileName,
            type: fileType,
            } as any);
        }
    try {      
      const response = await fetch("http://192.168.1.13:8000/auth/signup", {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 422) {
        throw new Error("halo");
      }

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("ini juga halo");
      }

      const result = await response.json();
      console.log(result);
      router.replace("/Menu/registered")
    } catch (error) {
      console.log(error);
    }
  };

  const logo = require("@/assets/images/splash.png");
  return (
    <View
      style={{
        backgroundColor: "#027361",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 90,
      }}
    >
      <Image
        source={logo}
        style={{
          width: 200,
          height: 200,
        }}
      />
      <ScrollView
        style={{
          backgroundColor: "#fff",
          width: "85%",
          borderWidth: 1,
          borderRadius: 16,
          borderColor: "#000",
          height: "60%",
        }}
        contentContainerStyle={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text
          variant="headlineLarge"
          style={{
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          Register
        </Text>
        <TextInput
          label={"Full Name"}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            marginHorizontal: 10,
            marginVertical: 10,
            width: "90%",
          }}
          onChangeText={(name)=>setName(name)}
          mode="outlined"
        />
        <TextInput
          label={"Email"}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            marginHorizontal: 10,
            marginVertical: 10,
            width: "90%",
          }}
          onChangeText={(email)=>setEmail(email)}
          mode="outlined"
        />
        <TextInput
          label={"Phone Number"}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            marginHorizontal: 10,
            marginVertical: 10,
            width: "90%",
          }}
          onChangeText={(phone)=>setPhoneNumber(phone)}
          keyboardType='numeric'
          mode="outlined"
        />
        <TextInput
          label={"Address"}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            marginHorizontal: 10,
            marginVertical: 10,
            width: "90%",
          }}
          onChangeText={(address)=>setAddress(address)}
          mode="outlined"
        />
        <TextInput
          label={"Username"}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            marginHorizontal: 10,
            marginVertical: 10,
            width: "90%",
          }}
          onChangeText={(username)=>setUsername(username)}
          mode="outlined"
        />

        <TextInput
          label={"Password"}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            marginHorizontal: 10,
            marginVertical: 10,
            width: "90%",
          }}
          onChangeText={(password)=>setPassword(password)}
          secureTextEntry={true}
          mode="outlined"
        />

        <View style={styles.container}>
            <Text style={styles.title}>Upload Picture</Text>
            <View style={styles.imageRow}>
                <TouchableOpacity onPress={() => pickImage()} style={styles.imagePlaceholder}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Text style={styles.imageText}>+</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>

        <Button
          mode="contained"
          style={{
            backgroundColor: "#027361",
            width: "80%",
            marginVertical: 20,
          }}
          onPress={signupHandler}
        >
          Register
        </Button>
        <Text
          variant="bodySmall"
          style={{ marginTop: 20, textAlign: "center", paddingBottom: 30 }}
        >
          Already have an account?
          <Link href={"Menu/login"} style={{ fontWeight: "bold" }}>
            {" "}
            Login Here
          </Link>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
  },
  imageRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
  },
  imagePlaceholder: {
      width: 80,
      height: 80,
      backgroundColor: '#ddd',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
      borderRadius: 10,
      borderColor: '#027361',
      borderWidth: 1.5,
  },
  image: {
      width: 80,
      height: 80,
      borderRadius: 10,
  },
  imageText: {
      fontSize: 30,
      color: '#027361',
  },
});
