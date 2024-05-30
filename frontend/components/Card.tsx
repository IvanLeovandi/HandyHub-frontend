import { Link } from "expo-router";
import { View, Image } from "react-native";
import * as React from 'react';
import { Text } from 'react-native-paper'

export default function Card({props}: any) {
    // const[image,setImage] = React.useState(require("@/assets/images/featured-placeholder.png"))
    // if(props.image){
    //     setImage(props.image)
    // }

    console.log(props);
    
    
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            borderWidth: 1,
            borderColor:"#027361",
            borderRadius:10
        }}>
            <Image src={`http://192.168.1.13:8000/images/${props?.images[0]}`} style={{width: 120, height: 120}}/>
            <View style={{
            
            }}>
            <Text variant="titleMedium" style={{fontWeight: 'bold', marginTop: 8, marginHorizontal: 12}}>{props?.name}</Text>
            <Text variant="titleSmall" style={{color: "#027361", fontWeight: 'bold',  marginHorizontal: 12}}>{props?.specialty}</Text>
            <View style={{
                display: "flex",
                flexDirection: "row"
            }}>
                <View>
                <Text variant="bodySmall" style={{ marginTop: 8, marginHorizontal: 12}}>Rating</Text>
                <Text variant="bodySmall" style={{ fontWeight: "bold", marginTop: 8, marginHorizontal: 12}}>{props?.rating}</Text>
                </View>
                <View>
                <Text variant="bodySmall" style={{ marginTop: 8, marginHorizontal: 12}}>Jobs</Text>
                <Text variant="bodySmall" style={{ fontWeight: "bold", marginTop: 8, marginHorizontal: 12}}>{props?.jobs}</Text>
                </View>
                <View>
                <Text variant="bodySmall" style={{ marginTop: 8, marginHorizontal: 12}}>Price</Text>
                <Text variant="bodySmall" style={{ fontWeight: "bold", marginTop: 8, marginHorizontal: 12}}>Rp{props?.price}</Text>
                </View>
            </View>
            </View>
        </View>
    )
}
