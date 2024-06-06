import HistoryCard from '@/components/HistoryCard';
import React, { useState, useEffect } from 'react'
import {Text} from "react-native-paper"
import { View, Image, Pressable, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

interface History {
  _id: string,
  serviceName: string,
  providerName: string,
  serviceDate: Date,
  amount: number,
  status: string,
  rating: number,
}

interface HistoryArray extends Array<History>{};


export default function History() {
  const[historyOrder, setHistoryOrder] = React.useState<HistoryArray>([]);
  const [loading, setLoading] = React.useState(true);
  const[token, setToken] = useState<string | null>("")

  const navigation = useNavigation()
  const router = useRouter()

  async function getHistory () {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("Menu/login")
    }
    setToken(token)
    
    const response = await fetch("https://handyhub-backend-production.up.railway.app/orders", {
      headers: {
        Authorization : `Bearer ${token}`,
      },
    });
    const result = await response.json();            
    const history = result.orders.map((item: any) => {return {_id: item._id, serviceName : item.serviceId.name,providerName : item.serviceId.provider.name, amount: item.amount, date: item.serviceDate, status: item.status, rating: item.serviceId.rating, image: item.serviceId.images}} )
    setHistoryOrder(history);
    setLoading(false)
  }  
  
  React.useEffect(()=>{
    getHistory()
  }, [historyOrder])  

  return (
    <ScrollView>
      {!loading ? 
        <View style={{padding: 30}}>
          <Text variant="displayMedium" style={{fontWeight: "bold", marginBottom: 12}}>History</Text>
          {historyOrder.map((history) => (
            <Pressable style={{marginVertical: 6}} key={history._id}>
              <HistoryCard props={history} token={token}/>
            </Pressable>
          ))}
        </View>
      : 
        <Text>Loading...</Text>
      }
    </ScrollView>
  )
}
