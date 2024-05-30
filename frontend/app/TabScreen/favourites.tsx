import React from 'react'
import { Text } from 'react-native-paper';
import { View, Image, Pressable } from "react-native";
import FavouriteCard from '@/components/FavouriteCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

interface Service{
  _id: string,
  images: string,
  name: string,
  price: number,
  description: string,
  city: string,
  provider: string,
  category: string,
  specialty: string,
}

interface ServiceArray extends Array<Service>{};

export default function Favourites() {
  const [loading, setLoading] = React.useState(true);
  const [favoriteItem, setFavoriteItem] = React.useState<ServiceArray>([]);
  const navigation = useNavigation()
  const router = useRouter()

  const getFavoriteServices = async () => {
    const token = await AsyncStorage.getItem("token")
    if (!token) {
      //redirect to login
      router.push("Menu/login")
    }

    try {
      const response = await fetch("http://192.168.1.13:8000/favorite", {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      const result = await response.json();
      setFavoriteItem(result.favorites)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }
  
  React.useEffect(() => {
    getFavoriteServices();
  }, [favoriteItem])
  
  return (
    <View>
      {!loading ? 
        <View style={{padding: 30}}>
          <Text variant="displayMedium" style={{fontWeight: "bold", marginBottom: 12}}>Favourite</Text>
          {favoriteItem.map((favorite) => (
            <Pressable style={{marginVertical: 6}} key={favorite._id} onPress={() => {
              navigation.push("MenuStack", {screen: "Detail", params: {id: favorite._id, isFavourite: true} })}}>
              <FavouriteCard props={favorite}/>
            </Pressable>
          ))}          
        </View>
      : 
        <Text>Loading...</Text>
      }
    </View>
  )
}
