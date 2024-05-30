import Card from '@/components/Card'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'

interface Electronics{
    _id: string,
    images: string
    name: string,
    price: number,
    description: string,
    city: string,
    provider: string,
    category: string,
    specialty: string,
}

interface ElectronicsArray extends Array<Electronics>{};

export default function Electronics() {
    const[electronics, setElectronics] = React.useState<ElectronicsArray>([])
    const[loading, setLoading] = React.useState(true)
    const navigation = useNavigation()
    async function getElectronics() {        
        const response = await fetch("http://192.168.1.13:8000/services/Electronics", {
        });
        const result = await response.json();
        setElectronics(result.services);
        setLoading(false)
        }        
        
        React.useEffect(() => {
            getElectronics();
        }, [])
    console.log(electronics);
    
    return (
        <SafeAreaView style={{
            paddingHorizontal: 28,
        }}>
            {!loading && electronics ? 
            <ScrollView>
                <Text variant='displaySmall' style={{
                    fontWeight: "bold",
                    marginVertical: 20
                }}>
                    Electronics
                </Text>
                {electronics.map((electronic) => {
                    console.log(electronic.images[0]);
                    
                    return (
                        <Pressable style={{
                            marginVertical: 8
                        }} key={electronic._id} onPress={() => {
                            navigation.push("MenuStack", {screen: "Detail", params: {
                                id:electronic._id
                            }})
                        }}>
                            <Card props={electronic}/>
                        </Pressable>
                    )                    
                })}
            </ScrollView>
            : !electronics ?
            <Text>There is no service available right now</Text>
            : 
            <Text>Loading</Text>
            }
        </SafeAreaView>
    )
}

