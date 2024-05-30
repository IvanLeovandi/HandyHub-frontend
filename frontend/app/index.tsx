import "react-native-gesture-handler";
import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import Favourites from "./TabScreen/favourites";
import History from "./TabScreen/history";
import Profile from "./TabScreen/profile";
import Navbar from "../components/navigation/Navbar";
import Home from "./TabScreen/home";
import Apply from "./Services/apply";
import Login from "./Menu/login";
import Register from "./Menu/register";
import Registered from "./Menu/registered";
import Gardening from "./Services/gardening";
import Electronics from "./Services/electronics";
import Renovation from "./Services/renovation";
import Confirmed from "./Menu/confirmed";
import Detail, { serviceDetail } from "./Menu/detail";
import Order from "./Menu/order";
import { NavigationContainer } from "@react-navigation/native";
import Payment from "./Menu/payment";
import Plumbing from "./Services/plumbing";
import Cleaning from "./Services/cleaning";

export type MenuStackParams = {
  Home: Screen
  Login: Screen
  Register: Screen
  Registered: Screen
  Detail : {
    id: string,
    isFavourite: boolean
  }
  Order: {
    service: serviceDetail
  }
  Payment : {
    service: serviceDetail,
    address: string
    token: string
    date: string
  }
  Confirmed: Screen
}


const Tab = createBottomTabNavigator();
const MenuStack = createNativeStackNavigator<MenuStackParams>();
const ServiceStack = createNativeStackNavigator();
const FavouriteStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();


function MenuStackGroup() {
  return (
    <MenuStack.Navigator>
      <MenuStack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <MenuStack.Screen name="Login" component={Login} />
      <MenuStack.Screen name="Register" component={Register} />
      <MenuStack.Screen name="Registered" component={Registered} />
      <MenuStack.Screen name="Detail" component={Detail} />
      <MenuStack.Screen name="Order" component={Order} />
      <MenuStack.Screen name="Payment" component={Payment} />
      <MenuStack.Screen name="Confirmed" component={Confirmed} />
    </MenuStack.Navigator>
  );
}

function ServiceStackGroup(){
  return (
    <ServiceStack.Navigator>
      <ServiceStack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <ServiceStack.Screen name="MenuStack" component={MenuStackGroup} options={{ headerShown: false }} />
      <ServiceStack.Screen name="Electronics" component={Electronics}/>
      <ServiceStack.Screen name="Plumbing" component={Plumbing}/>
      <ServiceStack.Screen name="Cleaning" component={Cleaning}/>
      <ServiceStack.Screen name="Gardening" component={Gardening}/>
      <ServiceStack.Screen name="Renovation" component={Renovation}/>
      <ServiceStack.Screen name="Apply" component={Apply} />
    </ServiceStack.Navigator>
  )
}

function FavouriteStackGroup(){
  return (
    <FavouriteStack.Navigator screenOptions={{headerShown: false}}>
      <FavouriteStack.Screen name="Favourite" component={Favourites} />
      <FavouriteStack.Screen name="MenuStack" component={MenuStackGroup}/>
    </FavouriteStack.Navigator>
  )
}

function ProfileStackGroup(){
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="MenuStack" component={MenuStackGroup}/>
    </ProfileStack.Navigator>
  )
}

function TabGroup() {
  return (
    <>
      <Navbar />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: "#bcbcbc",
          headerShown: false,
          tabBarStyle: { backgroundColor: "#027361" }
        }}
      >
        <Tab.Screen
          name="HomeStack"
          component={ServiceStackGroup}
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
          }}
        />
        <Tab.Screen
          name="FavouritesStackGroup"
          component={FavouriteStackGroup}
          options={{
            title: 'Favourites',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="heart" color={color} />,
          }}
        />
        <Tab.Screen
          name="History"
          component={History}
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="history" color={color} />,
          }}
        />
        <Tab.Screen
          name="ProfileStackGroup"
          component={ProfileStackGroup}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <TabGroup />
    </NavigationContainer>
  )
}
