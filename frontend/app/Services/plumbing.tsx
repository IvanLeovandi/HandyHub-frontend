import Card from '@/components/Card'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'

interface Plumbing{
    _id: string,
    name: string,
    price: number,
    description: string,
    city: string,
    provider: string,
    category: string,
    specialty: string,
}

interface PlumbingArray extends Array<Plumbing>{};

export default function Plumbing() {
    const[plumbing, setPlumbing] = React.useState<PlumbingArray>([])
    const[loading, setLoading] = React.useState(true)
    const navigation = useNavigation()
    async function getPlumbing() {        
        const response = await fetch("https://handyhub-backend-production.up.railway.app/services/Plumbing", {
        });
        const result = await response.json();
        setPlumbing(result.services);
        setLoading(false)
        }        
        
        React.useEffect(() => {
            getPlumbing();
        }, [])
    return (
        <SafeAreaView style={{
            paddingHorizontal: 28,
        }}>
            {!loading && plumbing ? 
            <ScrollView>
                <Text variant='displaySmall' style={{
                    fontWeight: "bold",
                    marginVertical: 20
                }}>
                    Plumbing
                </Text>
                {plumbing.map((p) => (
                        <Pressable style={{
                            marginVertical: 8
                        }} key={p._id} onPress={() => {
                            navigation.push("MenuStack", {screen: "Detail", params: {
                                id:p._id
                            }})
                        }}>
                            <Card props={p}/>
                        </Pressable>
                    )                    
                )}
            </ScrollView>
            : !plumbing ?
            <Text>There is no service available right now</Text>
            : 
            <Text>Loading</Text>
            }
        </SafeAreaView>
    )
}

