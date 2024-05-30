import HistoryCard from '@/components/HistoryCard';
import React from 'react'
import {Text} from "react-native-paper"
import { View, Image, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

interface History {
  _id: string,
  service: {
    image: string,
    provider: {
      name:string
    }
  },
  serviceDate: Date,
  amount: number,
  status: string,
  rating: number
}

interface HistoryArray extends Array<History>{};


export default function History() {
  const[historyOrder, setHistoryOrder] = React.useState<HistoryArray>([]);
  const [loading, setLoading] = React.useState(true);

  const navigation = useNavigation()
  const router = useRouter()

  async function getHistory () {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("Menu/login")
    }
    
    const response = await fetch("http://192.168.1.13:8000/orders", {
      headers: {
        Authorization : `Bearer ${token}`,
      },
    });
    const result = await response.json();        
    const history = result.orders.map((item: any) => {return {_id: item._id, providerName : item.serviceId.provider.name, amount: item.amount, date: item.serviceDate, status: item.status, rating: 5, image: item.serviceId.images}} )
    setHistoryOrder(history);
    setLoading(false)
  }  

  React.useEffect(()=>{
    getHistory()
  }, [])  

  return (
    <View>
      {!loading ? 
        <View style={{padding: 30}}>
          <Text variant="displayMedium" style={{fontWeight: "bold", marginBottom: 12}}>History</Text>
          {historyOrder.map((history) => (
            <Pressable style={{marginVertical: 6}} key={history._id}>
              <HistoryCard props={history}/>
            </Pressable>
          ))}
        </View>
      : 
        <Text>Loading...</Text>
      }
    </View>
  )
}
