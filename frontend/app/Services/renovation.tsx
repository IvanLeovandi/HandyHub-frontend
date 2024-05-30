import Card from '@/components/Card'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'

interface Renovations{
    _id: string,
    name: string,
    price: number,
    description: string,
    city: string,
    provider: string,
    category: string,
    specialty: string,
}

interface RenovationsArray extends Array<Renovations>{};

export default function Gardening() {
    const[renovations, setRenovations] = React.useState<RenovationsArray>([])
    const[loading, setLoading] = React.useState(true)
    async function getRenovations() {        
        const response = await fetch("https://handyhub-backend-production.up.railway.app/services/Renovation", {
        });
        const result = await response.json();
        setRenovations(result.services);
        setLoading(false)
        }
        
        React.useEffect(() => {
            getRenovations();
        }, [])

    const navigation = useNavigation()

    if(!loading){
        return (
        <SafeAreaView style={{
            paddingHorizontal: 28,
        }}>
            <ScrollView>
                <Text variant='displaySmall' style={{
                    fontWeight: "bold",
                    marginVertical: 20
                }}>
                    Renovations
                </Text>
                {renovations.map((renovation) => (
                        <Pressable style={{
                            marginVertical: 8
                        }} key={renovation._id} onPress={() => {
                            navigation.push("MenuStack", {screen: "Detail", params: {
                                id:renovation._id
                            }})
                        }}>
                            <Card props={renovation}/>
                        </Pressable>
                    )                    
                )}
            </ScrollView>
        </SafeAreaView>
        )
    } else if (!renovations) {
        return (
            <Text>There is no service available right now</Text>
        )
    }
    else {
        return (
            <Text>Loading...</Text>
        )
    }
}

