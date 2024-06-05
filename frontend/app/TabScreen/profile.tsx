import React, { useState } from 'react'
import { Button, Dialog, PaperProvider, Portal, Text, TextInput } from 'react-native-paper';
import { View, Image, ScrollView, Pressable, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import UserServicesCard from '@/components/UserServicesCard';
import Card from '@/components/Card';
import OrderCard from '@/components/OrderCard';

interface userProfile {
  image: string
  username: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface userServices {
  image: string
  _id: string
  name: string
  price: number
  category: {
    name: string
  }
  specialty: string
  jobs: number
  rating: number
  description: string
}

interface userOrders {
  image: string
  _id: string
  userId :string
  name: string
  price: number
  specialty: string
  serviceDate: Date
  addres: string
  status: string
}

interface UserServicesArray extends Array<userServices>{};
interface UserOrdersArray extends Array<userOrders>{};

export default function Profile() {
  const avatar = require("@/assets/images/Bob.png");
  const [userLoading, setUserLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const [user,setUser] = React.useState<userProfile>({
    image: "",username:"",name:"",phoneNumber:"",email:"",address:"",
  });
  const [services, setServices] = React.useState<UserServicesArray>([])
  const [orders, setOrders] = React.useState<UserOrdersArray>([])
  const [token, setToken] = useState<string | null>("")
  const [visible, setVisible] = useState(false);
  const [currentService, setCurrentService] = useState<userServices | null>(null);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState('UserDetail')
  const navigation = useNavigation()
  const router = useRouter()

  async function getProfile() {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("Menu/login" as never);
    }
    setToken(token)
    const response = await fetch("https://handyhub-backend-production.up.railway.app/profile", {
        headers: {
          Authorization : `Bearer ${token}`,
        },
    });
    const result = await response.json();    
    setUser(result.user);
    setUserLoading(false)
  }  
  
  async function getService() {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("Menu/login" as never);
    }
    setToken(token)
    const response = await fetch("https://handyhub-backend-production.up.railway.app/admin/service", {
        headers: {
          Authorization : `Bearer ${token}`,
        },
    });
    const result = await response.json();    
    setServices(result.services)
    setServicesLoading(false)
  }  

  async function getOrder() {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("Menu/login" as never);
    }
    setToken(token)
    const response = await fetch("https://handyhub-backend-production.up.railway.app/provider-order", {
        headers: {
          Authorization : `Bearer ${token}`,
        },
    });
    const result = await response.json();    
    setOrders(result.orders)
    setOrderLoading(false)
  } 

  React.useEffect(() => {
    getProfile();
    getService()
    getOrder()
  }, [services])  

  const showDialog = (service: userServices) => {
    setCurrentService(service);
    setName(service.name);
    setPrice(service.price.toString())
    setSpecialty(service.specialty);
    setDescription(service.description);
    setVisible(true);
    console.log(service._id);
    
  };

  const hideDialog = () => setVisible(false);

  const editHandler = async () => {
    try {
      const response = await fetch(`https://handyhub-backend-production.up.railway.app/admin/edit-service/${currentService?._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, specialty, price, description })
      });
      const result = await response.json();
      console.log(result);
      hideDialog();
    } catch (err) {
      console.log(err);
    }
  };

  const UserDetailComponent = () => {
    return (
      <View style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}>
        {/* nama */}
        <Text variant='bodyMedium' style={{
          color: "#3E5155",
          fontWeight: "bold",
        }}>Name</Text>
        <Text variant='titleMedium' style={{
          color: "#027361",
          fontWeight: "bold",
          marginBottom: 20,
          borderBottomColor: "#3E5155",
          borderBottomWidth: 1,
        }}>{user.name}</Text>

        {/* no hp */}
        <Text variant='bodyMedium' style={{
          color: "#3E5155",
          fontWeight: "bold",
        }}>Phone Number</Text>
        <Text variant='titleMedium' style={{
          color: "#3E5155",
          marginBottom: 20,
          borderBottomColor: "#3E5155",
          borderBottomWidth: 1,
        }}>{user.phoneNumber}</Text>

        {/* email */}
        <Text variant='bodyMedium' style={{
          color: "#3E5155",
          fontWeight: "bold",
        }}>Email</Text>
        <Text variant='titleMedium' style={{
          color: "#3E5155",
          marginBottom: 20,
          borderBottomColor: "#3E5155",
          borderBottomWidth: 1,
        }}>{user.email}</Text>


        {/* address list title */}

        <Text variant='bodyMedium' style={{
          color: "#3E5155",
          fontWeight: "bold",
        }}>Address</Text>
        <Text variant='titleMedium' style={{
          color: "#3E5155",
          marginBottom: 20,
          borderBottomColor: "#3E5155",
          borderBottomWidth: 1,
        }}>{user.address}</Text>
        <Text variant='bodyMedium' style={{
          color: "#3E5155",
          fontWeight: "bold",
          marginBottom: 10,
        }}>My Services</Text>
        {!servicesLoading && services.length === 0 ? (
          <Text variant='bodyMedium' style={{
            color: "#3E5155",
            marginBottom: 10,
          }}>You haven't applied any services yet</Text>
        ) : 
          <View>
            {services.map((service) => (
              <Pressable style={{ marginBottom: 20 }} key={service._id}
                onPress={() => {navigation.push("MenuStack", {screen: "Detail", params: {
                  id:service._id
              }})}}
              >
                <UserServicesCard props={service} token={token} showDialog={showDialog} />
              </Pressable>
            ))}
          </View>
        }
      </View>
    )
  }

  // const MyOrder = () => {
  //   orders.map((order) => {
  //     return (
  //       // <OrderCard props={order}/>
  //       <Text>Halo</Text>
  //     )
  //   }
  //   )
  // }
  
  if (!userLoading && user) {
    return (
      <PaperProvider>
        <ScrollView style={{
          display: "flex",
          paddingHorizontal: 32,
          flexGrow: 1
        }} contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}>
          <View style={{
            paddingTop: 20,
            marginBottom: 20,
          }}>
            {user.image ?
              <Image source={{ uri: `https://handyhub-backend-production.up.railway.app/images/${user.image}` }} style={{ borderRadius: 30, width: 300, height: 300, objectFit: "cover" }} />
              :
              <Image source={avatar} style={{ borderRadius: 30, width: 300, height: 300, objectFit: "cover" }} />
            }
          </View>
          <Text variant='displaySmall' style={{
            color: "#027361",
            fontWeight: "bold",
            marginVertical: 4,
          }}>{user.username}</Text>
          {/* detail and order section */}
          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly", width: "100%", marginVertical: 20}}>
            {section === 'UserDetail' ? (
            <Pressable onPress={()=>setSection("UserDetail")} style={{borderBottomColor: "#027361", borderBottomWidth: 1}}>
                <Text style={{color: "black", fontWeight: "bold"}}>My Detail</Text>
            </Pressable>
              ): (
            <Pressable onPress={()=>setSection("UserDetail")}>
                <Text style={{color: "black"}}>My Detail</Text>
            </Pressable>
              )}
            {section === 'MyOrder' ? (
            <Pressable onPress={()=>setSection("MyOrder")} style={{borderBottomColor: "#027361", borderBottomWidth: 1}}>
                <Text style={{color: "black", fontWeight: "bold"}}>My Order</Text>
            </Pressable>
              ): (
            <Pressable onPress={()=>setSection("MyOrder")}>
                <Text style={{color: "black"}}>My Order</Text>
            </Pressable>
              )}
          </View>
          {section === 'UserDetail' ? (
            <UserDetailComponent />
          ) : 
            orders.map((order) => (
              <View style={{ display: "flex",
              flexDirection: "column",
              width: "100%",}}>
                <OrderCard props={order}/>
              </View>
            ))
          }  
        </ScrollView>

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
            <Dialog.Title style={{color:"#027361", fontWeight:"bold"}}>Edit Service</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Name"
                value={name}
                onChangeText={text => setName(text)}
                textColor='black'
                outlineColor='black'
                activeUnderlineColor='#027361'
                style={styles.input}
              />
              <TextInput
                label="Price"
                value={price}
                onChangeText={text => setPrice(text)}
                keyboardType='numeric'
                textColor='black'
                outlineColor='black'
                activeUnderlineColor='#027361'
                style={styles.input}
              />
              <TextInput
                label="Specialty"
                value={specialty}
                onChangeText={text => setSpecialty(text)}
                textColor='black'
                outlineColor='black'
                activeUnderlineColor='#027361'
                style={styles.input}
              />
              <TextInput
                label="Description"
                value={description}
                onChangeText={text => setDescription(text)}
                textColor='black'
                outlineColor='black'
                activeUnderlineColor='#027361'
                style={styles.input}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog} buttonColor='red'><Text style={{color: "white"}}>Cancel</Text></Button>
              <Button onPress={editHandler} buttonColor='#027361'><Text style={{color: "white"}}>Save</Text></Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </PaperProvider>
    );
  } else {
    return <Text>Loading...</Text>
  }
}

const styles = StyleSheet.create({
  dialog: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor:"white",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
    color: "black"
  },
});