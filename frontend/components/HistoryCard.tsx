import { Link } from "expo-router";
import { View, Image } from "react-native";
import * as React from 'react';
import { Button, Text } from 'react-native-paper'

export default function HistoryCard({props, token}: any) {    
    const oldDate = new Date(props.date).toLocaleString("en-us", {dateStyle:"long"})
    // const year = oldDate.getFullYear()
    // const month = oldDate.getMonth()
    // const date = oldDate.getDate()

    // const newDate = `${date} ${month} ${year} `
    const[finished, setFinished] = React.useState(false)
    const[visible, setVisible] = React.useState(false)
    const[justifyContent, setJustifyContent] = React.useState("space-between")

    const visibleChecker = () => {
        if(visible) {
            setJustifyContent("space-between")
        } else {
            setJustifyContent("flex-end")
        }
    }

    const dateChecker = () => {
        const now = new Date()
        if(now >= new Date(props.date) && props.status !== "Completed") {
            setVisible(true) 
        }
    }

    // const finishChecker = () => {
    //     if(props.status === "Scheduled") {
    //         setFinished(false)
    //     } else {
    //         setFinished(true)
    //         setVisible(false)
    //     }
    // }
    React.useEffect(()=>{
        dateChecker()
        visibleChecker()
        // finishChecker()
    }, [props])
    
    const finishedHandler = async () => {
        try {
            const response = await fetch(`https://handyhub-backend-production.up.railway.app/service/finish-order/${props?._id}`, {
                method: "PATCH",
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: "Completed" })
            });
            const result = await response.json();
            setFinished(true)
            } catch (err) {
            console.log(err);
            }
            setVisible(false)
            setJustifyContent('flex-end')
        };        
    
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            borderWidth: 1,
            borderColor:"#027361",
            borderRadius:10,
            overflow: "hidden"
        }}>
            <Image src={`https://handyhub-backend-production.up.railway.app/images/${props?.image[0]}`} style={{width: 120, height: 120, marginRight: 12}}/>
            <View style={{
            }}>
            <View style={{paddingRight: 12}}>
                <Text variant="titleMedium" style={{fontWeight: 'bold', marginTop: 8}}>{props.serviceName}</Text>
            </View>
            <Text variant="titleSmall" style={{fontWeight: "200"}}>{oldDate}</Text>
            <Text variant="labelSmall" style={{fontWeight: "200", marginTop: 2}}>Price: <Text variant="labelSmall">Rp {props.amount}</Text></Text>
            <View style={{marginTop: 4, display: "flex", flexDirection:"row", justifyContent:`${justifyContent}`, width: "75%"}}>
                {props.status === "Scheduled" ? 
                    <Text variant="titleMedium" style={{fontWeight: "bold", marginTop: 8, color: `#E8451E`}}>{props.status}</Text>
                    : 
                    <Text variant="titleMedium" style={{fontWeight: "bold", marginTop: 8, color: `#027361`}}>{props.status}</Text>
                }
                { props.status === "Scheduled" && visible && ( 
                    <Button buttonColor="#027361" compact style={{maxWidth: 100}} onPress={finishedHandler}>
                        <Text variant="labelMedium" style={{color: "white"}}>Finish Order</Text>
                    </Button>
                    )
                }
            </View>
            </View>
        </View>
    )
}
