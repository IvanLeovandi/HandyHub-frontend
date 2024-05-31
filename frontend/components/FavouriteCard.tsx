import { View, Image, SafeAreaView, Pressable } from "react-native";
import * as React from 'react';
import { IconButton, Text } from 'react-native-paper'
import { useNavigation } from "@react-navigation/native";

export default function FavouriteCard({props}: any) {
    // const[image,setImage] = React.useState(require("@/assets/images/featured-placeholder.png"))
    // if(props.image){
    //     setImage(props.image)
    // }

    const navigation = useNavigation()
    
    return (
        <SafeAreaView style={{
            display: "flex",
            flexDirection: "row",
            borderWidth: 1,
            borderColor:"#027361",
            borderRadius:10,
            overflow: "hidden"
        }}
            
        >
            <Image src={`https://handyhub-backend-production.up.railway.app/images/${props?.images[0]}`} style={{width: 120, height: 120}}/>
            <View style={{

            }}>
                <Text variant="titleMedium" style={{fontWeight: 'bold', marginTop: 8, marginHorizontal: 12}}>{props?.name}</Text>
                <Text variant="titleSmall" style={{color: "#027361", fontWeight: 'bold',  marginHorizontal: 12}}>{props?.specialty}</Text>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
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
        </SafeAreaView>
    )
}
