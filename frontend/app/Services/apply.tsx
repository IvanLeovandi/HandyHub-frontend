import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, View, GestureResponderEvent, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Button, RadioButton, Text, TextInput } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';

export default function Apply() {
    const [serviceName, setServiceName] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const [price, setPrice] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [description, setDescription] = useState("");
    const [token, setToken] = useState<string | null>("");
    const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);

    const [serviceNameError, setServiceNameError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [cityError, setCityError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [specialtyError, setSpecialtyError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [imageError, setImageError] = useState("");

    const router = useRouter()

    const tokenChecker = async () => {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            // route to login
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
            setImageError(""); // Reset image error if image is selected
        }
    };

    const validateInputs = () => {
        let isValid = true;

        if (!serviceName) {
            setServiceNameError("Service name is required");
            isValid = false;
        } else {
            setServiceNameError("");
        }

        if (!category) {
            setCategoryError("Category is required");
            isValid = false;
        } else {
            setCategoryError("");
        }

        if (!city) {
            setCityError("City is required");
            isValid = false;
        } else {
            setCityError("");
        }

        if (!price) {
            setPriceError("Price is required");
            isValid = false;
        } else if (!/^\d{1,7}$/.test(price)) {
            setPriceError("Price must be a number with up to 7 digits");
            isValid = false;
        } else {
            setPriceError("");
        }

        if (!specialty) {
            setSpecialtyError("Specialty is required");
            isValid = false;
        } else {
            setSpecialtyError("");
        }

        if (!description) {
            setDescriptionError("Description is required");
            isValid = false;
        } else {
            setDescriptionError("");
        }

        if (images.every(image => image === null)) {
            setImageError("At least one image is required");
            isValid = false;
        } else {
            setImageError("");
        }

        return isValid;
    };

    const submitHandler = async (event: GestureResponderEvent) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const formData = new FormData();

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
            const response = await fetch('https://handyhub-backend-production.up.railway.app/admin/add-service', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
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
            <TextInput
                label={"Service Name"}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                onChangeText={(name) => { 
                    setServiceName(name);
                    setServiceNameError(""); // Clear error when user starts typing
                }}
                mode="outlined"
                error={!!serviceNameError}
            />
            {serviceNameError ? <Text style={styles.errorText}>{serviceNameError}</Text> : null}
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Category</Text>
                <RadioButton.Group 
                    onValueChange={value => {
                        setCategory(value);
                        setCategoryError(""); // Clear error when user selects a category
                    }} 
                    value={category}>
                    <View style={styles.radioContainer}>
                        <RadioButton value="Electronics" />
                        <Text>Electronics</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton value="Plumbing" />
                        <Text>Plumbing</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton value="Cleaning" />
                        <Text>Cleaning</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton value="Renovation" />
                        <Text>Renovation</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton value="Gardening" />
                        <Text>Gardening</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton value="Relocation" />
                        <Text>Relocation</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton value="Others" />
                        <Text>Others</Text>
                    </View>
                </RadioButton.Group>
            </View>
            {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
            <TextInput
                label={"City"}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                onChangeText={(city) => { 
                    setCity(city);
                    setCityError(""); // Clear error when user starts typing
                }}
                mode="outlined"
                error={!!cityError}
            />
            {cityError ? <Text style={styles.errorText}>{cityError}</Text> : null}
            <TextInput
                label={"Price"}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                keyboardType='numeric'
                onChangeText={(price) => { 
                    setPrice(price);
                    setPriceError(""); // Clear error when user starts typing
                }}
                mode="outlined"
                error={!!priceError}
            />
            {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
            <TextInput
                label={"Specialty"}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                onChangeText={(specialty) => { 
                    setSpecialty(specialty);
                    setSpecialtyError(""); // Clear error when user starts typing
                }}
                mode="outlined"
                error={!!specialtyError}
            />
            {specialtyError ? <Text style={styles.errorText}>{specialtyError}</Text> : null}
            <TextInput
                label={"Description"}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                multiline={true}
                onChangeText={(description) => { 
                    setDescription(description);
                    setDescriptionError(""); // Clear error when user starts typing
                }}
                mode="outlined"
                error={!!descriptionError}
            />
            {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
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
                {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}
            </View>
            <Button
                style={styles.submitButton}
                onPress={submitHandler}
            >
                <Text style={styles.submitButtonText}>
                    Apply Service
                </Text>
            </Button>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginVertical: 10,
        width: "90%",
    },
    inputOutline: {
        borderRadius: 10,
        borderColor: "#027361",
        borderWidth: 1.5,
    },
    errorText: {
        color: 'red',
        marginLeft: 10,
        marginBottom: 10,
        textAlign: "left",
        width:"90%"
    },
    categoryContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginVertical: 10,
        width: "90%",
        padding: 10,
        borderRadius: 10,
        borderColor: "#027361",
        borderWidth: 1.5,
    },
    categoryLabel: {
        fontWeight: "bold",
        marginBottom: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    submitButton: {
        backgroundColor: "#027361",
        paddingHorizontal: 24,
        paddingVertical: 4,
        marginBottom: 20,
    },
    submitButtonText: {
        color: "#fff",
    },
});
