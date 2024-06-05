import { Link } from "expo-router";
import { View, Image } from "react-native";
import * as React from 'react';
import { Button, Text } from 'react-native-paper'

export default function OrderCard({props}: any) {    
    const serviceDate = new Date(props.serviceDate).toLocaleString("en-us", {dateStyle:"long"})
    // const year = oldDate.getFullYear()
    // const month = oldDate.getMonth()
    // const date = oldDate.getDate()

    // const newDate = `${date} ${month} ${year} `
    
    // interface userOrders {
    //     image: string
    //     _id: string
    //     userId :string
    //     name: string
    //     price: number
    //     specialty: string
    //     serviceDate: Date
    //     addres: string
    //     status: string
    //   }
    const placeholder = require('@/assets/images/Bob.png')

    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            borderWidth: 1,
            borderColor:"#027361",
            borderRadius:10,
            overflow: "hidden"
        }}>
            <Image src={`https://handyhub-backend-production.up.railway.app/images/${props.serviceId.images[0]}`} style={{width: 120, height: 120, marginRight: 12}}/>
            {/* <Image source={placeholder} style={{width: 120, height: 120, marginRight: 12}}/> */}
            <View style={{
            }}>
                <View style={{paddingRight: 12, width: "75%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems:"center"}}>
                    <Text variant="titleMedium" style={{fontWeight: 'bold', marginTop: 8, color: "#027361"}}>{props.serviceId.name}</Text>
                </View>
                <Text variant="titleSmall" style={{fontWeight: "200", color: "black"}}>{serviceDate}</Text>
                <Text variant="titleSmall" style={{fontWeight: "200", color: "black"}}>{props.address}</Text>
                <Text variant="labelSmall" style={{fontWeight: "200", marginTop: 2, color: "black"}}>Price: <Text variant="labelSmall" style={{color: "black"}}>Rp {props.amount}</Text></Text>
                <View style={{paddingRight: 12, width: "75%", display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems:"center", marginTop: -8}}>
                    {props.status === "Scheduled" ? 
                    <Text variant="titleMedium" style={{fontWeight: "bold", marginTop: 8, color: `#E8451E`}}>{props.status}</Text>
                    : 
                    <Text variant="titleMedium" style={{fontWeight: "bold", marginTop: 8, color: `#027361`}}>{props.status}</Text>
                    }
                </View>
            </View>
        </View>
    )
}
