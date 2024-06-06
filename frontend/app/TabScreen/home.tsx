import { Link } from "expo-router";
import { View, Image, ScrollView, Pressable } from "react-native";
import * as React from "react";
import { Text } from "react-native-paper";
import Card from "@/components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface Services{
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

interface ServicesArray extends Array<Services>{};

export default function Home() {
    const Hero = require("@/assets/images/banner.png");
    const FeaturedPlaceholder = require("@/assets/images/featured-placeholder.png");
    const electronics = require("@/assets/images/electronics.png");
    const plumbing = require("@/assets/images/plumbing.png");
    const cleaning = require("@/assets/images/cleaning.png");
    const renovation = require("@/assets/images/renovation.png");
    const gardening = require("@/assets/images/gardening.png");
    const relocation = require("@/assets/images/relocation.png");
    const others = require("@/assets/images/others.png");
    const apply = require("@/assets/images/apply.png");

    const [token, setToken] = React.useState<string | null>(null);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [isAuth, setIsAuth] = React.useState<boolean>(false);
    const [services, setServices] = React.useState<ServicesArray>([])
    const [loading, setLoading] = React.useState(true)

    const menus = [
        { name: "Electronics", src: electronics },
        { name: "Plumbing", src: plumbing },
        { name: "Cleaning", src: cleaning },
        { name: "Renovation", src: renovation },
        { name: "Gardening", src: gardening },
        { name: "Relocation", src: relocation },
        { name: "Others", src: others },
        { name: "Apply", src: apply }
    ];

    const tokenChecker = async () => {
        const token = await AsyncStorage.getItem("token");
        const expiryDate = await AsyncStorage.getItem("expiryDate");

        if (!token || !expiryDate) {
        return;
        }

        const userId = await AsyncStorage.getItem("userId");

        setToken(token);
        setUserId(userId);
        setIsAuth(true);
    };

    async function getServices() {        
        const response = await fetch("https://handyhub-backend-production.up.railway.app/service", {
        });
        const result = await response.json();
        setServices(result.services);
        setLoading(false)
        }        
        
        React.useEffect(() => {
            getServices();
        }, [])

    React.useEffect(() => {
        tokenChecker();
    }, [services]);

    const logoutHandler = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("expiryDate");
        setToken(null);
        setUserId(null);
        setIsAuth(false);
    };

    const navigation = useNavigation()    

    return (
        <ScrollView
        style={{
            paddingHorizontal: 30,
            flexGrow: 1,
        }}
        >
        <Text
            variant="headlineLarge"
            style={{ fontWeight: "bold", marginTop: 20, marginBottom: 10 }}
        >
            Welcome!
        </Text>
        <View
            style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            }}
        >
            <Image source={Hero} style={{ width: 320, height: 170, objectFit: "contain" }} />
        </View>
        <Text variant="headlineLarge" style={{fontWeight: 'bold', marginTop: 20, marginBottom: 10}}>Services</Text>
        
        <View style={{
            display:'flex',
            flex: 4,
            justifyContent: "center",
            flexDirection: 'row',
            marginHorizontal: "auto",
            width: "100%",
            flexWrap: "wrap",
        }}>
        <View style={{
            margin: 8, 
            display: "flex", 
            flex: 4, 
            flexDirection: "row", 
            flexWrap: "wrap", 
            width: "100%", 
            justifyContent: "space-between"}}>
            {menus.map((menu)=> {
            return (
                <Pressable style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 2,
                    overflow: "visible",
                    width: 70,
                    height: 80,
                }} onPress={() => navigation.push(`${menu.name}`)}
                    key={menu.name}>
                    <Image source={menu.src} style={{
                        
                    }}/>
                    <Text variant="labelMedium" style={{
                        fontWeight: "bold",
                    }}>{menu.name}</Text>
                </Pressable>
            )
            })}
            </View>
        </View>
        
        <View style={{
            marginBottom: 20
        }}>
        <Text variant="headlineLarge" style={{fontWeight: 'bold', marginTop: 20, marginBottom: 10}}>Featured</Text>
            {services.map((service) => (
                <Pressable style={{marginBottom: 8}} key={service._id}
                    onPress={()=>{navigation.push("MenuStack", {screen: "Detail", params: {
                        id:service._id
                    }})}}
                >
                    <Card props={service}/>      
                </Pressable>
            ))}
        </View>
        </ScrollView>
    );
}