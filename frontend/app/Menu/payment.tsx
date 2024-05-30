import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MenuStackParams } from '..';
import { useNavigation } from '@react-navigation/native';

const paymentMethods = [
    { id: 'bca', label: 'Transfer BCA', icon: require('@/assets/images/bca.png') },
    { id: 'qris', label: 'QRIS', icon: require('@/assets/images/qris.png') },
    { id: 'gopay', label: 'Gopay', icon: require('@/assets/images/gopay.png') },
    { id: 'shopeepay', label: 'Shopee Pay', icon: require('@/assets/images/shopeepay.png') },
    { id: 'ovo', label: 'OVO',icon: require('@/assets/images/ovo.png') },
    ];

    type Props = NativeStackScreenProps<MenuStackParams, "Payment">

    const Payment : React.FC<Props> = ({route}) => {
    const [selectedMethod, setSelectedMethod] = useState('qris');
    
    const navigation = useNavigation()
    const paymentHandler = async () => {
        const orderData = {
            serviceID: route.params.service._id,
            amount: route.params.service.price + 10000,
            paymentMethod: selectedMethod,
            address: route.params.address,
            serviceDate: route.params.date,
        };

        try {
            const response = await fetch("http://192.168.1.13:8000/service/order", {
                method: "POST",
                body: JSON.stringify(orderData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + route.params.token,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            }

            const result = await response.json();
            navigation.navigate("Home" as never);
        } catch (err) {
            console.error("Error while placing order:", err);
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Payment Method</Text>
        <View style={styles.paymentSection}>
            {paymentMethods.map((method) => (
            <TouchableOpacity
                key={method.id}
                style={styles.paymentMethod}
                onPress={() => setSelectedMethod(method.id)}
            >
                <View style={styles.methodInfo}>
                <Image source={method.icon} style={styles.methodIcon} />
                <Text style={styles.methodLabel}>{method.label}</Text>
                </View>
                <View style={selectedMethod === method.id ? styles.radioSelected : styles.radio} />
            </TouchableOpacity>
            ))}
        </View>

        <View style={styles.paymentDetail}>
            <Text style={styles.header}>Payment Detail</Text>
            <View style={styles.detailRow}>
            <Text>Rate</Text>
            <Text>{route.params.service.price}</Text>
            </View>
            <View style={styles.detailRow}>
            <Text>Service Fee</Text>
            <Text>Rp 10000</Text>
            </View>
            <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{route.params.service.price + 10000}</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={paymentHandler}>
            <Text style={styles.confirmButtonText}>Confirm Order</Text>
        </TouchableOpacity>
        </ScrollView>
    );
    }
export default  Payment


    const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    paymentSection: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#000",
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    paymentMethod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    methodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    methodIcon: {
        width: 40,
        height: 40,
        marginRight: 16,
        objectFit: "contain",
    },
    methodLabel: {
        fontSize: 16,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
    },
    radioSelected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 6,
        borderColor: 'black',
    },
    paymentDetail: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    totalLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalAmount: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: '#027361',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
