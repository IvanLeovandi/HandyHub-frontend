import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, View, GestureResponderEvent, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Button, RadioButton, Text, TextInput } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';

export default function Apply() {
    const[serviceName, setServiceName] = useState("")
    const[category, setCategory] = useState("")
    const[city, setCity] = useState("")
    const[price, setPrice] = useState("")
    const[specialty, setSpecialty] = useState("")
    const[description, setDescription] = useState("")
    const[token, setToken] = useState<string|null>("")
    const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
    
    const router = useRouter()

    const tokenChecker = async () => {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            //route ke login
            router.push("Menu/login")
        }

        setToken(token);
    }

    React.useEffect(() => {
        tokenChecker();
    }, [])

    const navigation = useNavigation()

    const pickImage = async (index: number) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const newImages = [...images];
            newImages[index] = result.assets[0].uri;
            setImages(newImages);
        }
    };

    const submitHandler = async (event: GestureResponderEvent) => {
        event.preventDefault();
        
            // Create a new FormData instance
            const formData = new FormData();
        
            // Append service details to formData
            formData.append('name', serviceName);
            formData.append('price', price.toString());
            formData.append('city', city);
            formData.append('category', category);
            formData.append('description', description);
            formData.append('specialty', specialty);

            images.forEach((imageUri, index) => {
                if (imageUri) {
                    const fileName = imageUri.split('/').pop();
                    if (fileName) {
                        const fileType = imageUri.includes('jpg') || imageUri.includes('jpeg') ? 'image/jpeg' : 'image/png';
                    
                        formData.append('images', {
                            uri: imageUri,
                            name: fileName,
                            type: fileType,
                            } as any);
                        }
                    }
                });
        
            try {
            // Make a single fetch request to submit the service details along with the image
            const response = await fetch('http://192.168.1.13:8000/admin/add-service', {
                method: 'POST',
                headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type' : 'multipart/form-data'
                },
                body: formData,
            });
        
            if (response.status === 422) {
                throw new Error('Validation failed');
            }
        
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to add service');
            }
        
            const result = await response.json();
            // Redirect
            navigation.navigate("Home" as never);
            } catch (error) {
            console.log(error);
            }
        };
    
    return (
        <ScrollView style={{
            display: "flex",
        }} contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Text variant='headlineLarge' style={{
                fontWeight: "bold",
                marginVertical: 20
            }}>Apply Service</Text>
            <TextInput label={"Service Name"} style={{
                backgroundColor: "#fff",
                marginHorizontal: 10,
                marginVertical: 10,
                width: "90%"
            }} outlineStyle={{
                borderRadius: 10,
                borderColor: "#027361",
                borderWidth: 1.5,
            }}
            onChangeText={(name) => {setServiceName(name)}}
            mode="outlined"/>
            <View style={{
                backgroundColor: "#fff",
                marginHorizontal: 10,
                marginVertical: 10,
                width: "90%",
                padding: 10,
                borderRadius: 10,
                borderColor: "#027361",
                borderWidth: 1.5,
            }}>
                <Text style={{
                    fontWeight: "bold",
                    marginBottom: 10
                }}>Category</Text>
                <RadioButton.Group onValueChange={value => setCategory(value)} value={category}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="Electronics"/>
                        <Text>Electronics</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="Plumbing" />
                        <Text>Plumbing</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="Cleaning" />
                        <Text>Cleaning</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="Renovation"/>
                        <Text>Renovation</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="Gardening" />
                        <Text>Gardening</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="Relocation" />
                        <Text>Relocation</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="Others" />
                        <Text>Others</Text>
                    </View>
                </RadioButton.Group>
            </View>
            <TextInput label={"City"} style={{
                backgroundColor: "#fff",
                marginHorizontal: 10,
                marginVertical: 10,
                width: "90%"
            }} outlineStyle={{
                borderRadius: 10,
                borderColor: "#027361",
                borderWidth: 1.5,
            }}
            onChangeText={(city) => {setCity(city)}}
            mode="outlined"/>
            <TextInput label={"Price"} style={{
                backgroundColor: "#fff",
                marginHorizontal: 10,
                marginVertical: 10,
                width: "90%"
            }} outlineStyle={{
                borderRadius: 10,
                borderColor: "#027361",
                borderWidth: 1.5,
            }}
            keyboardType='numeric'
            onChangeText={(price) => {setPrice(price)}}
            mode="outlined"/>
            <TextInput label={"Specialty"} style={{
                backgroundColor: "#fff",
                marginHorizontal: 10,
                marginVertical: 10,
                width: "90%"
            }} outlineStyle={{
                borderRadius: 10,
                borderColor: "#027361",
                borderWidth: 1.5,
            }}
            onChangeText={(specialty) => {setSpecialty(specialty)}}
            mode="outlined"/>
            <TextInput label={"Description"} style={{
                backgroundColor: "#fff",
                marginHorizontal: 10,
                marginVertical: 10,
                width: "90%"
            }} outlineStyle={{
                borderRadius: 10,
                borderColor: "#027361",
                borderWidth: 1.5,
            }} multiline={true}
            onChangeText={(description) => {setDescription(description)}}
            mode="outlined"/>
            <View style={styles.container}>
                <Text style={styles.title}>Upload Picture</Text>
                <View style={styles.imageRow}>
                    {images.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => pickImage(index)} style={styles.imagePlaceholder}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.image} />
                            ) : (
                                <Text style={styles.imageText}>+</Text>
                            )}
                        </TouchableOpacity>
                    ))}
            </View>
        </View>
            <Button style={{
                backgroundColor: "#027361",
                paddingHorizontal: 24,
                paddingVertical: 4,
                marginBottom: 20,
            }}
                onPress={submitHandler}
            >
                <Text style={{
                    color: "#fff",
                }}>
                    Apply Service
                </Text>
            </Button>
        </ScrollView>
    )
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