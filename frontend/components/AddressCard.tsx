import React from 'react'
import { View } from 'react-native'
import { Text, Button } from 'react-native-paper'

export default function AddressCard({props}:any) {
    return (
        <View style={{
            borderWidth: 1,
            borderColor: "#3E5155",
            borderRadius: 14,
            padding: 12,
            marginBottom: 12,
            display: "flex",
            alignItems: "flex-start"
        }}>
            <Text variant='bodyMedium' style={{
            color:"#027361",
            fontWeight: "bold",
            marginBottom: 4
            }}>{props.name}</Text>
            <Text style={{
            color: "#3E5155",
            marginBottom: 4,
            fontWeight: "bold"
            }}>{props.phone}</Text>
            <Text style={{
            color: "#3E5155",
            marginBottom: 4,
            }}>{props.address}</Text>
            <Button style={{
            marginLeft: -20
            }}>
            <Text variant='bodyMedium' style={{
                color:"#027361",
                }}>Edit</Text>
            </Button>
        </View>
    )
}
