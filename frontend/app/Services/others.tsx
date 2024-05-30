import Card from '@/components/Card'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'

interface Others{
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

interface OthersArray extends Array<Others>{};

export default function Others() {
    const[others, setOthers] = React.useState<OthersArray>([])
    const[loading, setLoading] = React.useState(true)
    const navigation = useNavigation()
    async function getOthers() {        
        const response = await fetch("https://handyhub-backend-production.up.railway.app/services/Others", {
        });
        const result = await response.json();
        setOthers(result.services);
        setLoading(false)
        }        
        React.useEffect(() => {
            getOthers();
        }, [])
    console.log(others);
    
    return (
        <SafeAreaView style={{
            paddingHorizontal: 28,
        }}>
            {!loading && others ? 
            <ScrollView>
                <Text variant='displaySmall' style={{
                    fontWeight: "bold",
                    marginVertical: 20
                }}>
                    Others
                </Text>
                {others.map((other) => {
                    console.log(other.images[0]);
                    
                    return (
                        <Pressable style={{
                            marginVertical: 8
                        }} key={other._id} onPress={() => {
                            navigation.push("MenuStack", {screen: "Detail", params: {
                                id:other._id
                            }})
                        }}>
                            <Card props={other}/>
                        </Pressable>
                    )                    
                })}
            </ScrollView>
            : !others ?
            <Text>There is no service available right now</Text>
            : 
            <Text>Loading</Text>
            }
        </SafeAreaView>
    )
}

