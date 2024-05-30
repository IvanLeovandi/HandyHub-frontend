import Card from '@/components/Card'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'

interface Relocation{
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

interface RelocationArray extends Array<Relocation>{};

export default function Relocation() {
    const[relocation, setRelocation] = React.useState<RelocationArray>([])
    const[loading, setLoading] = React.useState(true)
    const navigation = useNavigation()
    async function getRelocation() {        
        const response = await fetch("https://handyhub-backend-production.up.railway.app/services/Relocation", {
        });
        const result = await response.json();
        setRelocation(result.services);
        setLoading(false)
        }        
        React.useEffect(() => {
            getRelocation();
        }, [])
    console.log(relocation);
    
    return (
        <SafeAreaView style={{
            paddingHorizontal: 28,
        }}>
            {!loading && relocation ? 
            <ScrollView>
                <Text variant='displaySmall' style={{
                    fontWeight: "bold",
                    marginVertical: 20
                }}>
                    Relocation
                </Text>
                {relocation.map((relocate) => {
                    console.log(relocate.images[0]);
                    
                    return (
                        <Pressable style={{
                            marginVertical: 8
                        }} key={relocate._id} onPress={() => {
                            navigation.push("MenuStack", {screen: "Detail", params: {
                                id:relocate._id
                            }})
                        }}>
                            <Card props={relocate}/>
                        </Pressable>
                    )                    
                })}
            </ScrollView>
            : !relocation ?
            <Text>There is no service available right now</Text>
            : 
            <Text>Loading</Text>
            }
        </SafeAreaView>
    )
}

