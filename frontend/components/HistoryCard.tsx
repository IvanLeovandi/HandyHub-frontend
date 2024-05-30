import { Link } from "expo-router";
import { View, Image } from "react-native";
import * as React from 'react';
import { Button, Text } from 'react-native-paper'

export default function HistoryCard({props}: any) {
    
    const oldDate = new Date(props.date).toLocaleString("en-us", {dateStyle:"long"})
    // const year = oldDate.getFullYear()
    // const month = oldDate.getMonth()
    // const date = oldDate.getDate()

    // const newDate = `${date} ${month} ${year} `
    const[finished, setFinished] = React.useState(false)
    // /service/finish-order/:orderId
    
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            borderWidth: 1,
            borderColor:"#027361",
            borderRadius:10,
        }}>
            <Image src={`http://192.168.1.13:8000/images/${props?.image}`} style={{width: 120, height: 120, marginRight: 12}}/>
            <View style={{
            }}>
            <View style={{paddingRight: 12, width: "75%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems:"center", backgroundColor: "yellow"}}>
                <Text variant="titleMedium" style={{fontWeight: 'bold', marginTop: 8}}>{props.providerName}</Text>
                {!finished ? 
                <Text variant="titleMedium" style={{fontWeight: "bold", marginTop: 8, color: `#E8451E`}}>{props.status}</Text>
                : 
                <Text variant="titleMedium" style={{fontWeight: "bold", marginTop: 8, color: `#027361`}}>{props.status}</Text>
            }
            </View>
            <Text variant="titleSmall" style={{fontWeight: "200", marginHorizontal: 12}}>{oldDate}</Text>
            <Text variant="labelSmall" style={{fontWeight: "200", marginHorizontal: 12, marginTop: 2}}>Price: <Text variant="labelSmall" style={{fontWeight: "bold"}}>Rp {props.amount}</Text></Text>
            <View style={{marginTop: 4, display: "flex", flexDirection:"row", justifyContent:"flex-end", width: "75%"}}>
                <Button buttonColor="#027361" compact style={{maxWidth: 100}}>
                    <Text variant="labelMedium" style={{color: "white"}}>Finish Order</Text>
                </Button>
            </View>
            </View>
        </View>
    )
}
