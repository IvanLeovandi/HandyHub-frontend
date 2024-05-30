import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { Text, Button, Card, IconButton, TextInput } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuStackParams } from '..';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Props = NativeStackScreenProps<MenuStackParams, "Order">

interface userProfile {
    username: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

const Order : React.FC<Props> = ({route}) => {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string|null>("");
    const [orderAddress, setOrderAddress] = useState("halo")
    const router = useRouter()

    const [user,setUser] = React.useState<userProfile>({
        username:"",name:"",phoneNumber:"",email:"",address:"",
    });
    const navigation = useNavigation()
    async function getProfile() {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            router.push("Menu/login");
        }
        const response = await fetch("https://handyhub-backend-production.up.railway.app/profile", {
            headers: {
                Authorization : `Bearer ${token}`,
            },
        });
        const result = await response.json();
        setToken(token);
        setUser(result.user);
        setOrderAddress(result.user.address)
        setLoading(false)
    }

    React.useEffect(() => {
        getProfile();
    }, [])

    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const OrderPlaceholder = require("@/assets/images/Bob.png")
    

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };    
    
    return (
        <View>
            {!loading 
            
            ? 
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileSection}>
                    <Image src={`https://handyhub-backend-production.up.railway.app/images/${route.params.service.images}`} style={styles.profileImage} />
                    <View style={styles.profileTextContainer}>
                    <Text style={styles.profileName}>{route.params.service.provider.name}</Text>
                    <Text style={styles.profileDetail}>
                        <Text style={styles.profileDetailLabel}>Category: </Text>{route.params.service.category.name}
                    </Text>
                    <Text style={styles.profileDetail}>
                        <Text style={styles.profileDetailLabel}>Specialty: </Text>{route.params.service.specialty}
                    </Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Detail</Text>
                    <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Button mode="text" onPress={() => setShowDatePicker(true)}>
                        {date.toDateString()}
                    </Button>
                    {showDatePicker && (
                        <DateTimePicker
                        minimumDate={new Date()}
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        />
                    )}
                    </View>
                    <Text style={styles.sectionSubtitle}>Address List</Text>
                    <Card style={styles.addressCard}>
                        <Card.Content>
                            <TextInput
                                label="Address"
                                value={orderAddress}
                                onChangeText={(address) => setOrderAddress(address)}
                                style={styles.input}
                                multiline
                                activeUnderlineColor='#027361'
                            />
                        </Card.Content>
                    </Card>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Detail</Text>
                    <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Rate:</Text>
                    <Text>{route.params.service.price}</Text>
                    </View>
                    <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Service Fee:</Text>
                    <Text>Rp 10.000</Text>
                    </View>
                    <View style={styles.detailRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>{route.params.service.price + 10000}</Text>
                    </View>
                    <Button mode="contained" style={styles.paymentButton} onPress={() => {navigation.push("MenuStack", {screen: "Payment", params:{service: route.params.service, address: orderAddress, date: date.toISOString(), token: token}})}}>
                    Choose Payment Method
                    </Button>
                </View>
            </ScrollView>
            : 
            <Text>Loading...</Text>
            }
        </View>
        
    );
    };

    const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 20,
        objectFit: "cover"
    },
    profileTextContainer: {
        marginLeft: 16,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileDetail: {
        fontSize: 16,
    },
    profileDetailLabel: {
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontWeight: 'bold',
    },
    addressCard: {
        marginVertical: 8,
        backgroundColor: "#efefef",

    },
    addressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    totalLabel: {
        fontWeight: 'bold',
    },
    totalAmount: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    paymentButton: {
        marginTop: 16,
        backgroundColor: '#027361',
    },
    input: {
        backgroundColor: "white",
        marginBottom: 8,
    },
});

export default Order;
