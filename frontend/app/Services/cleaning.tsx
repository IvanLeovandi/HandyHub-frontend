import Card from '@/components/Card'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'

interface Cleaning{
    _id: string,
    name: string,
    price: number,
    description: string,
    city: string,
    provider: string,
    category: string,
    specialty: string,
}

interface CleaningArray extends Array<Cleaning>{};

export default function Cleaning() {
    const[cleaning, setCleaning] = React.useState<CleaningArray>([])
    const[loading, setLoading] = React.useState(true)
    const navigation = useNavigation()
    async function getCleaning() {        
        const response = await fetch("https://handyhub-backend-production.up.railway.app/services/Cleaning", {
        });
        const result = await response.json();
        setCleaning(result.services);
        setLoading(false)
        }        
        
        React.useEffect(() => {
            getCleaning();
        }, [])
    return (
        <SafeAreaView style={{
            paddingHorizontal: 28,
        }}>
            {!loading && cleaning ? 
            <ScrollView>
                <Text variant='displaySmall' style={{
                    fontWeight: "bold",
                    marginVertical: 20
                }}>
                    Cleaning
                </Text>
                {cleaning.map((clean) => (
                        <Pressable style={{
                            marginVertical: 8
                        }} key={clean._id} onPress={() => {
                            navigation.push("MenuStack", {screen: "Detail", params: {
                                id:clean._id
                            }})
                        }}>
                            <Card props={clean}/>
                        </Pressable>
                    )                    
                )}
            </ScrollView>
            : !cleaning ?
            <Text>There is no service available right now</Text>
            : 
            <Text>Loading</Text>
            }
        </SafeAreaView>
    )
}

