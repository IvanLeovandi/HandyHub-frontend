import { Link, useRouter } from "expo-router";
import * as React from "react";
import { View, Image, StyleSheet, ScrollView, GestureResponderEvent, TouchableOpacity } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [image, setImage] = React.useState<string | null>(null);

  const [emailError, setEmailError] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [phoneNumberError, setPhoneNumberError] = React.useState("");
  const [addressError, setAddressError] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [imageError, setImageError] = React.useState("");

  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled && result.assets) {
        setImage(result.assets[0].uri);
        setImageError(""); // Clear error when image is selected
    }
  };

  const validateInputs = async () => {
    let isValid = true;

    if (!name) {
      setNameError("Full name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email format is invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required");
      isValid = false;
    } else {
      setPhoneNumberError("");
    }

    if (!address) {
      setAddressError("Address is required");
      isValid = false;
    } else {
      setAddressError("");
    }

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!image) {
      setImageError("Profile picture is required");
      isValid = false;
    } else {
      setImageError("");
    }

    return isValid;
  };

  const signupHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    if (!(await validateInputs())) {
      return;
    }

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
      const response = await fetch("https://handyhub-backend-production.up.railway.app/auth/signup", {
        method: "PUT",
        body: formData,
      });

      if (response.status === 422) {
        setUsernameError("Username existed, please pick other username");
      }

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to register");
      }

      const result = await response.json();
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
          style={styles.input}
          onChangeText={(name) => {
            setName(name);
            setNameError(""); // Clear error when user starts typing
          }}
          mode="outlined"
          error={!!nameError}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        <TextInput
          label={"Email"}
          style={styles.input}
          onChangeText={(email) => {
            setEmail(email);
            setEmailError(""); // Clear error when user starts typing
          }}
          mode="outlined"
          error={!!emailError}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          label={"Phone Number"}
          style={styles.input}
          onChangeText={(phone) => {
            setPhoneNumber(phone);
            setPhoneNumberError(""); // Clear error when user starts typing
          }}
          keyboardType='numeric'
          mode="outlined"
          error={!!phoneNumberError}
        />
        {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
        <TextInput
          label={"Address"}
          style={styles.input}
          onChangeText={(address) => {
            setAddress(address);
            setAddressError(""); // Clear error when user starts typing
          }}
          mode="outlined"
          error={!!addressError}
        />
        {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
        <TextInput
          label={"Username"}
          style={styles.input}
          onChangeText={(username) => {
            setUsername(username);
            setUsernameError(""); // Clear error when user starts typing
          }}
          mode="outlined"
          error={!!usernameError}
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        <TextInput
          label={"Password"}
          style={styles.input}
          onChangeText={(password) => {
            setPassword(password);
            setPasswordError(""); // Clear error when user starts typing
          }}
          secureTextEntry={true}
          mode="outlined"
          error={!!passwordError}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
            {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    width: "90%",
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
    marginBottom: 10,
    textAlign: "left",
    width: "90%"
  },
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
