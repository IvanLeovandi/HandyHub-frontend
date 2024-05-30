import Card from '@/components/Card'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'

interface Gardenings{
    _id: string,
    name: string,
    price: number,
    description: string,
    city: string,
    provider: string,
    category: string,
    specialty: string,
}

interface GardeningsArray extends Array<Gardenings>{};

export default function Gardenings() {
    const[gardenings, setGardenings] = React.useState<GardeningsArray>([])
    const[loading, setLoading] = React.useState(true)
    const navigation = useNavigation()
    async function getGardenings() {        
        const response = await fetch("https://handyhub-backend-production.up.railway.app/services/Gardening", {
        });
        const result = await response.json();
        setGardenings(result.services);
        setLoading(false)
        }        
        
        React.useEffect(() => {
            getGardenings();
        }, [])
    return (
        <SafeAreaView style={{
            paddingHorizontal: 28,
        }}>
            {!loading && gardenings ? 
            <ScrollView>
                <Text variant='displaySmall' style={{
                    fontWeight: "bold",
                    marginVertical: 20
                }}>
                    Gardening
                </Text>
                {gardenings.map((gardening) => (
                        <Pressable style={{
                            marginVertical: 8
                        }} key={gardening._id} onPress={() => {
                            navigation.push("MenuStack", {screen: "Detail", params: {
                                id:gardening._id
                            }})
                        }}>
                            <Card props={gardening}/>
                        </Pressable>
                    )                    
                )}
            </ScrollView>
            : !gardenings ?
            <Text>There is no service available right now</Text>
            : 
            <Text>Loading</Text>
            }
        </SafeAreaView>
    )
}

